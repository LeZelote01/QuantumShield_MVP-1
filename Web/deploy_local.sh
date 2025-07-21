#!/bin/bash

# QuantumShield Phase 1 MVP - Script de déploiement local

echo "🛡️ QuantumShield Phase 1 MVP - Déploiement Local"
echo "================================================="

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 non trouvé. Veuillez l'installer."
    exit 1
fi
echo "✅ Python 3 détecté"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Veuillez l'installer."
    exit 1
fi
echo "✅ Node.js détecté"

# Vérifier MongoDB (optionnel pour test local)
if ! command -v mongod &> /dev/null; then
    echo "⚠️ MongoDB local non trouvé. Utilisez MongoDB Atlas pour la production."
fi

echo ""
echo "🚀 Démarrage des services..."

# Démarrer le backend
echo "📡 Démarrage du backend..."
cd backend
pip install -r requirements.txt > /dev/null 2>&1
python server.py > /tmp/backend_phase1.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Vérifier que le backend est démarré
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend démarré sur http://localhost:8001"
else
    echo "❌ Erreur démarrage backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Démarrer le frontend
echo "🖥️ Démarrage du frontend..."
cd ../frontend
yarn install > /dev/null 2>&1
PORT=3001 yarn start > /tmp/frontend_phase1.log 2>&1 &
FRONTEND_PID=$!
sleep 15

# Vérifier que le frontend est démarré
if curl -s -I http://localhost:3001 > /dev/null; then
    echo "✅ Frontend démarré sur http://localhost:3001"
else
    echo "❌ Erreur démarrage frontend"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 QuantumShield Phase 1 MVP démarré avec succès!"
echo "================================================="
echo "🌐 Frontend: http://localhost:3001"
echo "📡 Backend:  http://localhost:8001" 
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "📊 État des services:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🔧 Logs en temps réel:"
echo "   Backend:  tail -f /tmp/backend_phase1.log"
echo "   Frontend: tail -f /tmp/frontend_phase1.log"
echo ""
echo "⏹️ Pour arrêter:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🚀 Bon test de QuantumShield Phase 1!"

# Garder le script actif
echo "Appuyez sur Ctrl+C pour arrêter tous les services..."
trap "echo ''; echo '⏹️ Arrêt des services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '👋 QuantumShield Phase 1 arrêté.'; exit 0" INT

# Attendre indéfiniment
while true; do
    sleep 1
done
