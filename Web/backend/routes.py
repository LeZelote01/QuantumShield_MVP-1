from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from models import (
    UserCreate, UserLogin, UserProfile,
    NTRUKeyPair, EncryptionRequest, DecryptionRequest,
    DeviceCreate, DeviceHeartbeat, DeviceStatus
)
from auth_service import AuthService
from ntru_service import NTRUService
from device_service import DeviceService
from token_service import TokenService
from dashboard_service import DashboardService

# Services
auth_service = AuthService()
ntru_service = NTRUService()
device_service = DeviceService()
token_service = TokenService()
dashboard_service = DashboardService()

# Security
security = HTTPBearer()

# Routers
auth_router = APIRouter(prefix="/auth", tags=["authentication"])
crypto_router = APIRouter(prefix="/crypto", tags=["cryptography"])
device_router = APIRouter(prefix="/devices", tags=["devices"])
token_router = APIRouter(prefix="/tokens", tags=["tokens"])
dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Auth dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = await auth_service.get_current_user(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# ================================
# AUTHENTICATION ROUTES
# ================================

@auth_router.post("/register")
async def register(user_data: UserCreate):
    """Inscription d'un nouvel utilisateur"""
    try:
        user = await auth_service.create_user(user_data)
        
        # Récompenser l'inscription
        await token_service.reward_user(
            user.id, 
            "first_login", 
            description="Bonus d'inscription"
        )
        
        return {
            "message": "Utilisateur créé avec succès",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "wallet_address": user.wallet_address
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")

@auth_router.post("/login")
async def login(credentials: UserLogin):
    """Connexion utilisateur"""
    user = await auth_service.authenticate_user(credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = auth_service.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 30 * 60,  # 30 minutes en secondes
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "wallet_address": user["wallet_address"],
            "qs_balance": user["qs_balance"]
        }
    }

@auth_router.get("/profile")
async def get_profile(current_user = Depends(get_current_user)):
    """Récupère le profil de l'utilisateur connecté"""
    profile = await auth_service.get_user_profile(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profil utilisateur non trouvé")
    return profile

# ================================
# CRYPTOGRAPHY ROUTES  
# ================================

@crypto_router.post("/generate-keys", response_model=NTRUKeyPair)
async def generate_keys(key_size: int = 2048):
    """Génère une paire de clés NTRU++"""
    try:
        keypair = ntru_service.generate_keypair(key_size)
        return keypair
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crypto_router.post("/encrypt")
async def encrypt_data(request: EncryptionRequest):
    """Chiffre des données avec NTRU++"""
    try:
        result = ntru_service.encrypt(request.data, request.public_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crypto_router.post("/decrypt")
async def decrypt_data(request: DecryptionRequest):
    """Déchiffre des données avec NTRU++"""
    try:
        result = ntru_service.decrypt(request.encrypted_data, request.private_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crypto_router.post("/sign")
async def sign_data(data: str, private_key: str):
    """Signe des données avec NTRU++"""
    try:
        signature = ntru_service.sign(data, private_key)
        return {
            "signature": signature,
            "algorithm": "NTRU++",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crypto_router.post("/verify")
async def verify_signature(data: str, signature: str, public_key: str):
    """Vérifie une signature avec NTRU++"""
    try:
        is_valid = ntru_service.verify(data, signature, public_key)
        return {
            "valid": is_valid,
            "algorithm": "NTRU++",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crypto_router.get("/performance")
async def get_crypto_performance():
    """Récupère les métriques de performance cryptographique"""
    return ntru_service.get_performance_metrics()

# ================================
# DEVICE ROUTES
# ================================

@device_router.post("/register")
async def register_device(device_data: DeviceCreate, current_user = Depends(get_current_user)):
    """Enregistre un nouveau dispositif IoT"""
    try:
        device = await device_service.register_device(device_data, current_user["id"])
        
        # Récompenser l'enregistrement
        await token_service.reward_user(
            current_user["id"],
            "device_registration",
            device.device_id,
            f"Enregistrement - {device.device_name}"
        )
        
        return {
            "message": "Dispositif enregistré avec succès",
            "device": device,
            "reward": f"+{token_service.reward_amounts['device_registration']} QS"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@device_router.get("/")
async def get_devices(current_user = Depends(get_current_user)):
    """Récupère tous les dispositifs de l'utilisateur"""
    devices = await device_service.get_user_devices(current_user["id"])
    return {"devices": devices}

@device_router.get("/{device_id}")
async def get_device(device_id: str, current_user = Depends(get_current_user)):
    """Récupère un dispositif par son ID"""
    device = await device_service.get_device_by_id(device_id, current_user["id"])
    if not device:
        raise HTTPException(status_code=404, detail="Dispositif non trouvé")
    return device

@device_router.post("/{device_id}/heartbeat")
async def send_heartbeat(device_id: str, heartbeat: DeviceHeartbeat, current_user = Depends(get_current_user)):
    """Envoie un heartbeat pour un dispositif"""
    try:
        # Vérifier que le device_id correspond
        if heartbeat.device_id != device_id:
            raise HTTPException(status_code=400, detail="ID de dispositif incohérent")
        
        result = await device_service.send_heartbeat(heartbeat, current_user["id"])
        
        # Possibilité de récompense quotidienne
        reward_success = await token_service.reward_user(
            current_user["id"],
            "daily_heartbeat", 
            device_id,
            "Heartbeat quotidien"
        )
        
        if reward_success:
            result["reward"] = f"+{token_service.reward_amounts['daily_heartbeat']} QS"
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@device_router.get("/{device_id}/metrics")
async def get_device_metrics(device_id: str, current_user = Depends(get_current_user)):
    """Récupère les métriques d'un dispositif"""
    try:
        metrics = await device_service.get_device_metrics(device_id, current_user["id"])
        return metrics
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@device_router.put("/{device_id}/status")
async def update_device_status(device_id: str, new_status: DeviceStatus, current_user = Depends(get_current_user)):
    """Met à jour le statut d'un dispositif"""
    try:
        result = await device_service.update_device_status(device_id, new_status, current_user["id"])
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@device_router.get("/types/supported")
async def get_supported_device_types():
    """Récupère les types de dispositifs supportés"""
    return device_service.get_supported_device_types()

# ================================
# TOKEN ROUTES
# ================================

@token_router.get("/balance")
async def get_balance(current_user = Depends(get_current_user)):
    """Récupère le solde QS de l'utilisateur"""
    balance = await token_service.get_user_balance(current_user["id"])
    return {"balance": balance, "symbol": "QS"}

@token_router.get("/transactions")
async def get_transactions(current_user = Depends(get_current_user), limit: int = 50):
    """Récupère l'historique des transactions"""
    transactions = await token_service.get_user_transactions(current_user["id"], limit)
    return {"transactions": transactions}

@token_router.get("/info")
async def get_token_info(current_user = Depends(get_current_user)):
    """Récupère les informations complètes des tokens"""
    info = await token_service.get_user_token_info(current_user["id"])
    if not info:
        raise HTTPException(status_code=404, detail="Informations utilisateur non trouvées")
    return info

@token_router.post("/claim-daily")
async def claim_daily_rewards(current_user = Depends(get_current_user)):
    """Réclame les récompenses quotidiennes"""
    result = await token_service.claim_daily_rewards(current_user["id"])
    return result

@token_router.get("/market")
async def get_market_info():
    """Récupère les informations de marché QS"""
    return token_service.get_market_info()

@token_router.get("/stats")
async def get_token_stats():
    """Récupère les statistiques globales des tokens"""
    stats = await token_service.get_token_stats()
    return stats

# ================================
# DASHBOARD ROUTES
# ================================

@dashboard_router.get("/")
async def get_dashboard(current_user = Depends(get_current_user)):
    """Récupère les données du dashboard utilisateur"""
    dashboard_stats, additional_info = await dashboard_service.get_user_dashboard(current_user["id"])
    return {
        "stats": dashboard_stats,
        "user_info": additional_info["user_info"],
        "device_stats": additional_info["device_stats"],
        "token_info": additional_info["token_info"],
        "performance_metrics": additional_info["performance_metrics"]
    }

@dashboard_router.get("/quick-stats")
async def get_quick_stats(current_user = Depends(get_current_user)):
    """Récupère des statistiques rapides"""
    stats = await dashboard_service.get_quick_stats(current_user["id"])
    return stats

@dashboard_router.get("/global")
async def get_global_stats():
    """Récupère les statistiques globales du système"""
    stats = await dashboard_service.get_global_stats()
    return stats

@dashboard_router.get("/health")
async def get_system_health():
    """Vérifie la santé du système"""
    health = await dashboard_service.get_system_health()
    return health