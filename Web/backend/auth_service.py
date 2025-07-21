from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models import User, UserCreate, UserLogin
from database import users_collection
import secrets
import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'quantum_shield_secret')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        pass

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return pwd_context.hash(password)

    def generate_wallet_address(self):
        """Generate a unique wallet address"""
        return f"QS{secrets.token_hex(20)}"

    async def create_user(self, user_data: UserCreate):
        # Check if user exists
        existing_user = await users_collection.find_one({
            "$or": [
                {"email": user_data.email},
                {"username": user_data.username}
            ]
        })
        
        if existing_user:
            raise ValueError("User with this email or username already exists")

        # Create new user
        hashed_password = self.get_password_hash(user_data.password)
        wallet_address = self.generate_wallet_address()
        
        user = User(
            email=user_data.email,
            username=user_data.username,
            wallet_address=wallet_address
        )
        
        user_dict = user.dict()
        user_dict['password'] = hashed_password
        
        result = await users_collection.insert_one(user_dict)
        user_dict['id'] = str(result.inserted_id)
        
        return user

    async def authenticate_user(self, username: str, password: str):
        user = await users_collection.find_one({"username": username})
        if not user or not self.verify_password(password, user.get('password')):
            return False
        return user

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    async def get_current_user(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
        except JWTError:
            return None
        
        user = await users_collection.find_one({"username": username})
        return user

    async def get_user_profile(self, user_id: str):
        user = await users_collection.find_one({"id": user_id})
        if user:
            return {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "wallet_address": user["wallet_address"],
                "qs_balance": user["qs_balance"],
                "created_at": user["created_at"]
            }
        return None