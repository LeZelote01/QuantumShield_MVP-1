#!/bin/bash

# Script de préparation et d'exécution des tests QuantumShield
# Usage: ./run_tests.sh [complete|screenshots]

set -e

echo "🚀 Préparation des tests QuantumShield"
echo "======================================"

# Install Python dependencies
echo "📦 Installation des dépendances Python..."
pip install playwright

# Install Playwright browsers
echo "🌐 Installation des navigateurs Playwright..."
python -m playwright install chromium

# Check if services are running
echo "🔍 Vérification des services..."

# Check backend
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend running on port 8001"
else
    echo "❌ Backend not running! Please start the backend first."
    echo "💡 Run: cd /app/Web/backend && python server.py"
    exit 1
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend running on port 3000"
else
    echo "❌ Frontend not running! Please start the frontend first."
    echo "💡 Run: cd /app/Web/frontend && yarn start"
    exit 1
fi

echo ""
echo "🎯 Services are ready!"
echo ""

# Determine which script to run
case "${1:-complete}" in
    "complete")
        echo "🎬 Lancement du test complet avec vidéo..."
        cd /app && python complete_test_script.py
        ;;
    "screenshots")
        echo "📸 Lancement de la capture d'écran simple..."
        cd /app && python screenshot_script.py
        ;;
    *)
        echo "Usage: $0 [complete|screenshots]"
        echo "  complete    - Test complet avec vidéo (défaut)"
        echo "  screenshots - Captures d'écran uniquement"
        exit 1
        ;;
esac

echo ""
echo "✅ Tests terminés!"
echo "📁 Vérifiez les dossiers screenshots_* et videos_* pour les résultats"