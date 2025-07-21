from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

class DeviceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"

class TransactionType(str, Enum):
    REWARD = "reward"
    DEVICE_REGISTRATION = "device_registration"
    HEARTBEAT = "heartbeat"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    wallet_address: str
    qs_balance: float = 50.0  # Start with 50 QS
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    username: str
    wallet_address: str
    qs_balance: float
    created_at: datetime

# Cryptography Models
class NTRUKeyPair(BaseModel):
    public_key: str
    private_key: str
    key_size: int = 2048
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EncryptionRequest(BaseModel):
    data: str
    public_key: str

class DecryptionRequest(BaseModel):
    encrypted_data: str
    private_key: str

class EncryptionResponse(BaseModel):
    encrypted_data: str
    algorithm: str = "NTRU++"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DecryptionResponse(BaseModel):
    decrypted_data: str
    verification_status: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Device Models  
class Device(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    device_name: str
    device_type: str  # "Smart Sensor", "Security Camera", "Smart Thermostat"
    owner_id: str
    status: DeviceStatus = DeviceStatus.ACTIVE
    public_key: str
    last_heartbeat: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DeviceCreate(BaseModel):
    device_id: str
    device_name: str
    device_type: str

class DeviceHeartbeat(BaseModel):
    device_id: str
    status: DeviceStatus
    sensor_data: Dict[str, Any] = {}

# Token Models
class TokenBalance(BaseModel):
    user_id: str
    balance: float
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class TokenTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    transaction_type: TransactionType
    description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class RewardClaim(BaseModel):
    user_id: str
    device_id: str
    reward_type: str
    amount: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Dashboard Models
class DashboardStats(BaseModel):
    total_devices: int
    active_devices: int
    total_users: int
    user_qs_balance: float
    recent_activity: List[Dict[str, Any]]