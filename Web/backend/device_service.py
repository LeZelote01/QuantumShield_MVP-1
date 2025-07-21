from datetime import datetime, timedelta
from models import Device, DeviceCreate, DeviceHeartbeat, DeviceStatus
from database import devices_collection, users_collection
from ntru_service import NTRUService
import uuid

class DeviceService:
    def __init__(self):
        self.ntru_service = NTRUService()
        self.device_types = [
            "Smart Sensor",
            "Security Camera", 
            "Smart Thermostat"
        ]
        
    async def register_device(self, device_data: DeviceCreate, user_id: str) -> Device:
        """Enregistre un nouveau dispositif IoT"""
        try:
            # Vérifier que le type de device est supporté
            if device_data.device_type not in self.device_types:
                raise ValueError(f"Type de dispositif non supporté. Types disponibles: {self.device_types}")
            
            # Vérifier que l'utilisateur existe
            user = await users_collection.find_one({"id": user_id})
            if not user:
                raise ValueError("Utilisateur non trouvé")
            
            # Vérifier l'unicité du device_id
            existing_device = await devices_collection.find_one({"device_id": device_data.device_id})
            if existing_device:
                raise ValueError("Un dispositif avec cet ID existe déjà")
            
            # Générer une paire de clés pour le dispositif
            keypair = self.ntru_service.generate_keypair()
            
            # Créer le dispositif
            device = Device(
                device_id=device_data.device_id,
                device_name=device_data.device_name,
                device_type=device_data.device_type,
                owner_id=user_id,
                public_key=keypair.public_key
            )
            
            device_dict = device.dict()
            device_dict['private_key'] = keypair.private_key  # Stocker temporairement
            
            result = await devices_collection.insert_one(device_dict)
            device_dict['id'] = str(result.inserted_id)
            
            return device
            
        except Exception as e:
            raise Exception(f"Erreur enregistrement dispositif: {str(e)}")

    async def get_user_devices(self, user_id: str):
        """Récupère tous les dispositifs d'un utilisateur"""
        devices = await devices_collection.find({"owner_id": user_id}).to_list(length=None)
        
        # Nettoyer les données (ne pas retourner la clé privée)
        for device in devices:
            if 'private_key' in device:
                del device['private_key']
            device['_id'] = str(device['_id'])
                
        return devices

    async def get_device_by_id(self, device_id: str, user_id: str):
        """Récupère un dispositif par son ID"""
        device = await devices_collection.find_one({
            "device_id": device_id,
            "owner_id": user_id
        })
        
        if device:
            if 'private_key' in device:
                del device['private_key']
            device['_id'] = str(device['_id'])
            return device
        return None

    async def send_heartbeat(self, heartbeat: DeviceHeartbeat, user_id: str):
        """Traite un heartbeat de dispositif"""
        try:
            # Vérifier que le dispositif appartient à l'utilisateur
            device = await devices_collection.find_one({
                "device_id": heartbeat.device_id,
                "owner_id": user_id
            })
            
            if not device:
                raise ValueError("Dispositif non trouvé ou non autorisé")
            
            # Mettre à jour le statut et timestamp
            update_data = {
                "status": heartbeat.status.value,
                "last_heartbeat": datetime.utcnow()
            }
            
            # Ajouter les données des capteurs si présentes
            if heartbeat.sensor_data:
                update_data["last_sensor_data"] = heartbeat.sensor_data
            
            await devices_collection.update_one(
                {"device_id": heartbeat.device_id},
                {"$set": update_data}
            )
            
            return {
                "success": True,
                "message": "Heartbeat reçu avec succès",
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            raise Exception(f"Erreur traitement heartbeat: {str(e)}")

    async def get_device_metrics(self, device_id: str, user_id: str):
        """Récupère les métriques d'un dispositif"""
        device = await devices_collection.find_one({
            "device_id": device_id,
            "owner_id": user_id
        })
        
        if not device:
            raise ValueError("Dispositif non trouvé")
        
        # Calculer l'uptime (basique)
        now = datetime.utcnow()
        last_heartbeat = device.get('last_heartbeat', device['created_at'])
        time_diff = now - last_heartbeat
        
        # Considérer le device comme online si heartbeat < 10 minutes
        is_online = time_diff < timedelta(minutes=10)
        uptime_hours = (now - device['created_at']).total_seconds() / 3600
        
        return {
            "device_id": device_id,
            "device_name": device["device_name"],
            "device_type": device["device_type"],
            "status": device["status"],
            "is_online": is_online,
            "last_heartbeat": last_heartbeat,
            "uptime_hours": round(uptime_hours, 2),
            "created_at": device["created_at"],
            "last_sensor_data": device.get("last_sensor_data", {})
        }

    async def get_devices_stats(self, user_id: str):
        """Récupère les statistiques des dispositifs pour un utilisateur"""
        devices = await devices_collection.find({"owner_id": user_id}).to_list(length=None)
        
        total_devices = len(devices)
        active_devices = len([d for d in devices if d["status"] == "active"])
        online_devices = 0
        
        now = datetime.utcnow()
        for device in devices:
            last_heartbeat = device.get('last_heartbeat', device['created_at'])
            if (now - last_heartbeat) < timedelta(minutes=10):
                online_devices += 1
        
        devices_by_type = {}
        for device in devices:
            device_type = device["device_type"]
            devices_by_type[device_type] = devices_by_type.get(device_type, 0) + 1
        
        return {
            "total_devices": total_devices,
            "active_devices": active_devices,
            "online_devices": online_devices,
            "devices_by_type": devices_by_type
        }

    async def update_device_status(self, device_id: str, new_status: DeviceStatus, user_id: str):
        """Met à jour le statut d'un dispositif"""
        device = await devices_collection.find_one({
            "device_id": device_id,
            "owner_id": user_id
        })
        
        if not device:
            raise ValueError("Dispositif non trouvé")
        
        await devices_collection.update_one(
            {"device_id": device_id},
            {"$set": {"status": new_status.value}}
        )
        
        return {"success": True, "new_status": new_status.value}

    def get_supported_device_types(self):
        """Retourne la liste des types de dispositifs supportés"""
        return {
            "device_types": self.device_types,
            "descriptions": {
                "Smart Sensor": "Capteurs intelligents (température, humidité, etc.)",
                "Security Camera": "Caméras de sécurité connectées",
                "Smart Thermostat": "Thermostats intelligents"
            }
        }