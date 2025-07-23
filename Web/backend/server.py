from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from token_service import TokenService

# Initialiser les services
token_service = TokenService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Starting QuantumShield Phase 1 MVP...")
    await token_service.initialize_token_system()
    yield
    # Shutdown
    logging.info("Shutting down QuantumShield Phase 1...")

# Create the main app
app = FastAPI(
    title="QuantumShield Phase 1 MVP",
    description="Cryptographie post-quantique pour l'IoT - Version MVP Minimale",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Import and include routers
from routes import (
    auth_router, crypto_router, device_router, 
    token_router, dashboard_router
)

# Include all routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(crypto_router, prefix="/api")
app.include_router(device_router, prefix="/api")
app.include_router(token_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "phase": "Phase 1 MVP",
        "version": "1.0.0",
        "services": {
            "auth": True,
            "crypto": True,
            "devices": True,
            "tokens": True,
            "dashboard": True,
            "database": True
        }
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "QuantumShield Phase 1 MVP API",
        "version": "1.0.0",
        "phase": "Phase 1 - MVP Minimal",
        "features": [
            "Authentification JWT",
            "Cryptographie NTRU++",
            "Gestion dispositifs IoT (3 types)",
            "Système tokens QS",
            "Dashboard basique"
        ],
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)