#!/bin/bash

# QuantumShield VM Setup Script
# Ce script installe tous les prérequis pour QuantumShield Phase 1 MVP

echo "🛡️  QUANTUMSHIELD VM SETUP - DÉBUT DE L'INSTALLATION"
echo "=================================================="

# Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation des outils de base
echo "🔧 Installation des outils de base..."
sudo apt install -y curl wget git vim nano htop tree unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Installation de Node.js 18 (via NodeSource)
echo "📱 Installation de Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de Yarn
echo "🧶 Installation de Yarn..."
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y yarn

# Installation de Python 3 et pip
echo "🐍 Installation de Python 3..."
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Installation de MongoDB
echo "🍃 Installation de MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Démarrage et activation de MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérification des versions installées
echo ""
echo "✅ VÉRIFICATION DES INSTALLATIONS"
echo "================================="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Yarn version: $(yarn --version)"
echo "Python version: $(python3 --version)"
echo "pip version: $(pip3 --version)"
echo "MongoDB version: $(mongod --version | head -1)"

# Création du répertoire de travail
echo ""
echo "📁 Création du répertoire de travail..."
mkdir -p /home/$USER/quantumshield
cd /home/$USER/quantumshield

# Clonage du repository
echo "📥 Clonage du repository QuantumShield..."
git clone https://github.com/LeZelote01/QuantumShield_MVP-1.git .

# Préparation de la structure
echo "🏗️  Préparation de la structure du projet..."
mv Web/backend ./
mv Web/frontend ./
rm -rf Web Mobile

# Installation des dépendances backend
echo "⚙️  Installation des dépendances backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# Installation des dépendances frontend
echo "🎨 Installation des dépendances frontend..."
cd frontend
yarn install
cd ..

# Configuration des fichiers d'environnement
echo "🔐 Configuration des variables d'environnement..."

# Backend .env
cat > backend/.env << 'EOF'
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=quantumshield_phase1

# Security
SECRET_KEY=quantum_shield_phase1_secret_key_change_in_production
NTRU_KEY_SIZE=2048

# API Configuration
API_VERSION=1.0.0
DEBUG=True
EOF

# Frontend .env
cat > frontend/.env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_APP_NAME=QuantumShield Phase 1
REACT_APP_VERSION=1.0.0
EOF

# Création du script de démarrage
echo "🚀 Création du script de démarrage..."
cat > start-quantumshield.sh << 'EOF'
#!/bin/bash

echo "🛡️  DÉMARRAGE DE QUANTUMSHIELD"
echo "============================="

# Vérification de MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "🍃 Démarrage de MongoDB..."
    sudo systemctl start mongod
    sleep 3
fi

# Démarrage du backend
echo "⚙️  Démarrage du backend (port 8001)..."
cd /home/$USER/quantumshield/backend
source venv/bin/activate
python server.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Attendre que le backend soit prêt
echo "⏳ Attente du backend..."
sleep 5

# Démarrage du frontend
echo "🎨 Démarrage du frontend (port 3000)..."
cd /home/$USER/quantumshield/frontend
BROWSER=none yarn start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ QUANTUMSHIELD DÉMARRÉ AVEC SUCCÈS !"
echo "======================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8001"
echo "📊 API Documentation: http://localhost:8001/docs"
echo ""
echo "Pour arrêter les services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Attendre l'arrêt des processus
wait
EOF

chmod +x start-quantumshield.sh

# Création du script d'arrêt
cat > stop-quantumshield.sh << 'EOF'
#!/bin/bash

echo "🛑 ARRÊT DE QUANTUMSHIELD"
echo "========================"

# Arrêt des processus Node.js (frontend)
echo "🎨 Arrêt du frontend..."
pkill -f "react-scripts start" || true
pkill -f "webpack" || true

# Arrêt des processus Python (backend)
echo "⚙️  Arrêt du backend..."
pkill -f "server.py" || true
pkill -f "uvicorn" || true

echo "✅ Services arrêtés avec succès !"
EOF

chmod +x stop-quantumshield.sh

# Création du script de test
cat > test-quantumshield.sh << 'EOF'
#!/bin/bash

echo "🧪 TESTS DE QUANTUMSHIELD"
echo "========================="

echo "🔍 Vérification de MongoDB..."
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB est actif"
else
    echo "❌ MongoDB n'est pas actif"
    exit 1
fi

echo "🔍 Test de l'API backend..."
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend API répond"
    curl -s http://localhost:8001/api/health | python3 -m json.tool
else
    echo "❌ Backend API ne répond pas"
fi

echo "🔍 Test du frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend répond"
else
    echo "❌ Frontend ne répond pas"
fi

echo ""
echo "🌐 URLs d'accès:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
EOF

chmod +x test-quantumshield.sh

# Permissions finales
sudo chown -R $USER:$USER /home/$USER/quantumshield

echo ""
echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "======================================"
echo ""
echo "📁 Projet installé dans: /home/$USER/quantumshield"
echo ""
echo "🚀 Pour démarrer QuantumShield:"
echo "   cd /home/$USER/quantumshield"
echo "   ./start-quantumshield.sh"
echo ""
echo "🧪 Pour tester l'installation:"
echo "   ./test-quantumshield.sh"
echo ""
echo "🛑 Pour arrêter les services:"
echo "   ./stop-quantumshield.sh"
echo ""
echo "🌐 URLs une fois démarré:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"