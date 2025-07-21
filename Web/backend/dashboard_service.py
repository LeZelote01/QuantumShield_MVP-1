from datetime import datetime, timedelta
from models import DashboardStats
from database import users_collection, devices_collection, transactions_collection
from device_service import DeviceService
from token_service import TokenService

class DashboardService:
    def __init__(self):
        self.device_service = DeviceService()
        self.token_service = TokenService()

    async def get_global_stats(self):
        """Récupère les statistiques globales du système"""
        total_users = await users_collection.count_documents({})
        total_devices = await devices_collection.count_documents({})
        active_devices = await devices_collection.count_documents({"status": "active"})
        total_transactions = await transactions_collection.count_documents({})
        total_qs_supply = await self.token_service.get_total_qs_supply()
        
        return {
            "total_users": total_users,
            "total_devices": total_devices,
            "active_devices": active_devices,
            "total_transactions": total_transactions,
            "total_qs_supply": round(total_qs_supply, 2)
        }

    async def get_user_dashboard(self, user_id: str):
        """Récupère les données du dashboard pour un utilisateur"""
        # Informations utilisateur
        user = await users_collection.find_one({"id": user_id})
        if not user:
            raise ValueError("Utilisateur non trouvé")
        
        # Statistiques des dispositifs
        device_stats = await self.device_service.get_devices_stats(user_id)
        
        # Informations tokens
        token_info = await self.token_service.get_user_token_info(user_id)
        
        # Activité récente
        recent_activity = await self.get_recent_activity(user_id)
        
        # Métriques de performance
        performance_metrics = await self.get_performance_metrics(user_id)
        
        return DashboardStats(
            total_devices=device_stats["total_devices"],
            active_devices=device_stats["active_devices"],
            total_users=1,  # Pour le dashboard utilisateur, c'est toujours 1
            user_qs_balance=user["qs_balance"],
            recent_activity=recent_activity
        ), {
            "user_info": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "wallet_address": user["wallet_address"],
                "member_since": user["created_at"]
            },
            "device_stats": device_stats,
            "token_info": token_info,
            "performance_metrics": performance_metrics
        }

    async def get_recent_activity(self, user_id: str, limit: int = 10):
        """Récupère l'activité récente d'un utilisateur"""
        activities = []
        
        # Transactions récentes
        recent_transactions = await transactions_collection.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(5).to_list(length=None)
        
        for transaction in recent_transactions:
            activities.append({
                "type": "transaction",
                "description": transaction["description"],
                "amount": f"+{transaction['amount']} QS",
                "timestamp": transaction["timestamp"],
                "icon": "💰"
            })
        
        # Dispositifs récemment ajoutés
        recent_devices = await devices_collection.find(
            {"owner_id": user_id}
        ).sort("created_at", -1).limit(3).to_list(length=None)
        
        for device in recent_devices:
            activities.append({
                "type": "device",
                "description": f"Dispositif ajouté: {device['device_name']}",
                "device_type": device["device_type"],
                "timestamp": device["created_at"],
                "icon": "📱"
            })
        
        # Trier par timestamp et limiter
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        return activities[:limit]

    async def get_performance_metrics(self, user_id: str):
        """Calcule les métriques de performance pour un utilisateur"""
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        
        # Dispositifs en ligne (heartbeat < 10 minutes)
        devices = await devices_collection.find({"owner_id": user_id}).to_list(length=None)
        online_devices = 0
        total_uptime = 0
        
        for device in devices:
            last_heartbeat = device.get('last_heartbeat', device['created_at'])
            if (now - last_heartbeat) < timedelta(minutes=10):
                online_devices += 1
            
            # Calculer uptime approximatif
            device_age = (now - device['created_at']).total_seconds()
            time_since_heartbeat = (now - last_heartbeat).total_seconds()
            uptime_ratio = max(0, 1 - (time_since_heartbeat / max(device_age, 1)))
            total_uptime += uptime_ratio
        
        avg_uptime = (total_uptime / len(devices) * 100) if devices else 0
        
        # Transactions cette semaine
        weekly_transactions = await transactions_collection.count_documents({
            "user_id": user_id,
            "timestamp": {"$gte": week_ago}
        })
        
        # QS gagnés cette semaine
        weekly_earnings_pipeline = [
            {"$match": {
                "user_id": user_id,
                "timestamp": {"$gte": week_ago},
                "amount": {"$gt": 0}
            }},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        
        weekly_earnings_result = await transactions_collection.aggregate(weekly_earnings_pipeline).to_list(length=1)
        weekly_earnings = weekly_earnings_result[0]["total"] if weekly_earnings_result else 0
        
        return {
            "online_devices": online_devices,
            "total_devices": len(devices),
            "average_uptime": round(avg_uptime, 1),
            "weekly_transactions": weekly_transactions,
            "weekly_earnings": round(weekly_earnings, 2),
            "network_status": "Excellent" if avg_uptime > 90 else "Good" if avg_uptime > 70 else "Needs Attention"
        }

    async def get_system_health(self):
        """Vérifie la santé générale du système"""
        total_devices = await devices_collection.count_documents({})
        active_devices = await devices_collection.count_documents({"status": "active"})
        
        # Dispositifs en ligne récemment
        recent_heartbeat_threshold = datetime.utcnow() - timedelta(minutes=30)
        online_devices = await devices_collection.count_documents({
            "last_heartbeat": {"$gte": recent_heartbeat_threshold}
        })
        
        health_score = 100
        if total_devices > 0:
            activity_ratio = active_devices / total_devices
            online_ratio = online_devices / total_devices
            health_score = int((activity_ratio * 0.6 + online_ratio * 0.4) * 100)
        
        status = "Excellent"
        if health_score < 80:
            status = "Good"
        if health_score < 60:
            status = "Warning"
        if health_score < 40:
            status = "Critical"
        
        return {
            "health_score": health_score,
            "status": status,
            "total_devices": total_devices,
            "active_devices": active_devices,
            "online_devices": online_devices,
            "last_check": datetime.utcnow()
        }

    async def get_quick_stats(self, user_id: str):
        """Récupère des statistiques rapides pour l'interface"""
        user = await users_collection.find_one({"id": user_id})
        devices = await devices_collection.find({"owner_id": user_id}).to_list(length=None)
        
        today = datetime.utcnow().date()
        today_transactions = await transactions_collection.count_documents({
            "user_id": user_id,
            "timestamp": {
                "$gte": datetime.combine(today, datetime.min.time()),
                "$lt": datetime.combine(today, datetime.max.time())
            }
        })
        
        return {
            "qs_balance": user["qs_balance"],
            "total_devices": len(devices),
            "active_devices": len([d for d in devices if d["status"] == "active"]),
            "today_activity": today_transactions,
            "last_updated": datetime.utcnow()
        }