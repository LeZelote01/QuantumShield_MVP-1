#!/bin/bash

# 🚀 Script de préparation automatique pour le déploiement QuantumShield
# Ce script prépare automatiquement votre code pour le déploiement

set -e

echo "🚀 Préparation du déploiement QuantumShield"
echo "============================================="

# Configuration
BACKEND_REPO_NAME="quantumshield-backend"
FRONTEND_REPO_NAME="quantumshield-frontend"
GITHUB_USERNAME=""

# Demander le nom d'utilisateur GitHub
read -p "📝 Entrez votre nom d'utilisateur GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Nom d'utilisateur GitHub requis"
    exit 1
fi

echo "👤 Utilisateur GitHub: $GITHUB_USERNAME"

# Créer les dossiers de déploiement
echo "📁 Création des dossiers de déploiement..."
mkdir -p /app/deployment/{backend,frontend}

# =====================================
# PRÉPARATION DU BACKEND
# =====================================
echo ""
echo "🔧 Préparation du backend..."

# Copier les fichiers backend
cp -r /app/Web/backend/* /app/deployment/backend/
cd /app/deployment/backend

# Créer railway.json
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "HEROKU_BUILDER"
  },
  "deploy": {
    "startCommand": "python server.py"
  }
}
EOF

# Créer Procfile
cat > Procfile << 'EOF'
web: python server.py
EOF

# Mettre à jour server.py pour Railway
cat > server_railway.py << 'EOF'
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os
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

# Add CORS middleware avec configuration pour production
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://*.vercel.app",
        "http://localhost:3000",
        "https://localhost:3000"
    ],
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
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
EOF

# Remplacer server.py
mv server_railway.py server.py

# Créer .env d'exemple
cat > .env.example << 'EOF'
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=quantumshield_production

# Security
SECRET_KEY=your_super_secret_key_change_in_production
NTRU_KEY_SIZE=2048

# API Configuration  
API_VERSION=1.0.0
DEBUG=False
PORT=8001
EOF

# Initialiser git pour le backend
git init
git add .
git commit -m "Initial backend commit for Railway deployment"

echo "✅ Backend préparé pour Railway"
echo "📝 Repository à créer: https://github.com/$GITHUB_USERNAME/$BACKEND_REPO_NAME"

# =====================================
# PRÉPARATION DU FRONTEND
# =====================================
echo ""
echo "🎨 Préparation du frontend..."

# Copier les fichiers frontend
cp -r /app/Web/frontend/* /app/deployment/frontend/
cd /app/deployment/frontend

# Créer vercel.json
cat > vercel.json << 'EOF'
{
  "framework": "create-react-app",
  "buildCommand": "yarn build",
  "outputDirectory": "build",
  "installCommand": "yarn install",
  "functions": {},
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
EOF

# Créer .env d'exemple pour production
cat > .env.production << 'EOF'
REACT_APP_BACKEND_URL=https://your-app.railway.app
REACT_APP_APP_NAME=QuantumShield Production
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
EOF

# Créer .env.example
cat > .env.example << 'EOF'
REACT_APP_BACKEND_URL=https://your-app.railway.app
REACT_APP_APP_NAME=QuantumShield
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
EOF

# Mettre à jour package.json avec des scripts de build optimisés
npm pkg set scripts.build="react-scripts build"
npm pkg set scripts.start="react-scripts start"
npm pkg set scripts.deploy="yarn build"

# Initialiser git pour le frontend
git init
git add .
git commit -m "Initial frontend commit for Vercel deployment"

echo "✅ Frontend préparé pour Vercel"
echo "📝 Repository à créer: https://github.com/$GITHUB_USERNAME/$FRONTEND_REPO_NAME"

# =====================================
# INSTRUCTIONS FINALES
# =====================================
echo ""
echo "🎯 ÉTAPES SUIVANTES:"
echo "==================="
echo ""
echo "1️⃣  CRÉEZ LES REPOSITORIES GITHUB:"
echo "   Backend:  https://github.com/new (nom: $BACKEND_REPO_NAME)"
echo "   Frontend: https://github.com/new (nom: $FRONTEND_REPO_NAME)"
echo ""
echo "2️⃣  POUSSEZ LE CODE:"
echo "   # Backend"
echo "   cd /app/deployment/backend"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$BACKEND_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "   # Frontend"  
echo "   cd /app/deployment/frontend"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$FRONTEND_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  SUIVEZ LE GUIDE DE DÉPLOIEMENT:"
echo "   📖 Consultez /app/DEPLOYMENT_GUIDE.md"
echo ""
echo "✅ Préparation terminée!"
echo "📁 Fichiers prêts dans: /app/deployment/"