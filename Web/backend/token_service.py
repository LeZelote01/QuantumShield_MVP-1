from datetime import datetime
from models import TokenBalance, TokenTransaction, TransactionType, RewardClaim
from database import users_collection, tokens_collection, transactions_collection
import uuid

class TokenService:
    def __init__(self):
        self.reward_amounts = {
            "device_registration": 10.0,
            "daily_heartbeat": 1.0,
            "first_login": 5.0
        }
        
    async def initialize_token_system(self):
        """Initialise le système de tokens"""
        # Cette méthode peut être utilisée pour des initialisations futures
        pass

    async def get_user_balance(self, user_id: str) -> float:
        """Récupère le solde QS d'un utilisateur"""
        user = await users_collection.find_one({"id": user_id})
        return user.get("qs_balance", 0.0) if user else 0.0

    async def reward_user(self, user_id: str, reward_type: str, device_id: str = None, description: str = None) -> bool:
        """Récompense un utilisateur avec des tokens QS"""
        try:
            if reward_type not in self.reward_amounts:
                raise ValueError(f"Type de récompense non reconnu: {reward_type}")
            
            reward_amount = self.reward_amounts[reward_type]
            
            # Vérifier si l'utilisateur existe
            user = await users_collection.find_one({"id": user_id})
            if not user:
                raise ValueError("Utilisateur non trouvé")
            
            # Pour les heartbeats quotidiens, vérifier qu'on n'a pas déjà récompensé aujourd'hui
            if reward_type == "daily_heartbeat" and device_id:
                today = datetime.utcnow().date()
                existing_reward = await transactions_collection.find_one({
                    "user_id": user_id,
                    "transaction_type": "heartbeat",
                    "device_id": device_id,
                    "timestamp": {
                        "$gte": datetime.combine(today, datetime.min.time()),
                        "$lt": datetime.combine(today, datetime.max.time())
                    }
                })
                
                if existing_reward:
                    return False  # Déjà récompensé aujourd'hui
            
            # Mettre à jour le solde utilisateur
            new_balance = user["qs_balance"] + reward_amount
            await users_collection.update_one(
                {"id": user_id},
                {"$set": {"qs_balance": new_balance}}
            )
            
            # Enregistrer la transaction
            transaction = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "amount": reward_amount,
                "transaction_type": reward_type,
                "description": description or f"Récompense: {reward_type}",
                "timestamp": datetime.utcnow(),
                "device_id": device_id
            }
            
            await transactions_collection.insert_one(transaction)
            
            return True
            
        except Exception as e:
            print(f"Erreur lors de la récompense: {str(e)}")
            return False

    async def get_user_transactions(self, user_id: str, limit: int = 50):
        """Récupère l'historique des transactions d'un utilisateur"""
        transactions = await transactions_collection.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit).to_list(length=None)
        
        for transaction in transactions:
            transaction['_id'] = str(transaction['_id'])
            
        return transactions

    async def get_total_qs_supply(self) -> float:
        """Calcule l'offre totale de tokens QS en circulation"""
        pipeline = [
            {"$group": {"_id": None, "total_supply": {"$sum": "$qs_balance"}}}
        ]
        
        result = await users_collection.aggregate(pipeline).to_list(length=1)
        return result[0]["total_supply"] if result else 0.0

    async def get_token_stats(self):
        """Récupère les statistiques globales des tokens"""
        total_users = await users_collection.count_documents({})
        total_supply = await self.get_total_qs_supply()
        total_transactions = await transactions_collection.count_documents({})
        
        # Récompenses distribuées par type
        pipeline = [
            {"$group": {
                "_id": "$transaction_type",
                "count": {"$sum": 1},
                "total_amount": {"$sum": "$amount"}
            }}
        ]
        
        rewards_by_type = await transactions_collection.aggregate(pipeline).to_list(length=None)
        
        return {
            "total_users": total_users,
            "total_supply": round(total_supply, 2),
            "total_transactions": total_transactions,
            "rewards_by_type": rewards_by_type,
            "reward_rates": self.reward_amounts
        }

    async def get_user_token_info(self, user_id: str):
        """Récupère les informations complètes des tokens pour un utilisateur"""
        user = await users_collection.find_one({"id": user_id})
        if not user:
            return None
        
        recent_transactions = await self.get_user_transactions(user_id, 10)
        
        # Calculer les récompenses potentielles
        potential_rewards = {
            "device_registration": {
                "amount": self.reward_amounts["device_registration"],
                "description": "Récompense pour enregistrer un nouveau dispositif"
            },
            "daily_heartbeat": {
                "amount": self.reward_amounts["daily_heartbeat"], 
                "description": "Récompense quotidienne par dispositif actif"
            }
        }
        
        return {
            "user_id": user_id,
            "balance": user["qs_balance"],
            "wallet_address": user["wallet_address"],
            "recent_transactions": recent_transactions,
            "potential_rewards": potential_rewards,
            "total_earned": sum(t["amount"] for t in recent_transactions if t["amount"] > 0)
        }

    async def claim_daily_rewards(self, user_id: str):
        """Réclame les récompenses quotidiennes pour tous les dispositifs actifs d'un utilisateur"""
        from device_service import DeviceService
        device_service = DeviceService()
        
        devices = await device_service.get_user_devices(user_id)
        active_devices = [d for d in devices if d["status"] == "active"]
        
        rewards_claimed = 0
        for device in active_devices:
            success = await self.reward_user(
                user_id=user_id,
                reward_type="daily_heartbeat",
                device_id=device["device_id"],
                description=f"Récompense quotidienne - {device['device_name']}"
            )
            if success:
                rewards_claimed += 1
        
        total_reward = rewards_claimed * self.reward_amounts["daily_heartbeat"]
        
        return {
            "success": True,
            "devices_rewarded": rewards_claimed,
            "total_devices": len(active_devices),
            "reward_amount": total_reward
        }

    def get_market_info(self):
        """Retourne les informations de marché pour les tokens QS"""
        return {
            "token_name": "QuantumShield",
            "symbol": "QS",
            "decimals": 2,
            "initial_supply": 1000000,  # 1 million QS max supply
            "current_price": 0.10,  # Prix fictif en USD
            "market_phase": "Phase 1 - MVP",
            "utility": "Récompenses pour sécurité IoT et participation réseau"
        }