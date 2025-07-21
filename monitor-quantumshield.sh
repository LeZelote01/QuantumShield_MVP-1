#!/bin/bash

# Script de surveillance QuantumShield
while true; do
    clear
    echo "🛡️  QUANTUMSHIELD - MONITORING EN TEMPS RÉEL"
    echo "============================================"
    echo "$(date)"
    echo ""
    
    # Vérification des services
    echo "📊 STATUT DES SERVICES:"
    echo "----------------------"
    
    # MongoDB
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB: ACTIF"
    else
        echo "❌ MongoDB: INACTIF"
    fi
    
    # Backend
    if pgrep -f "server.py" > /dev/null; then
        echo "✅ Backend: ACTIF (PID: $(pgrep -f server.py))"
        # Test API
        if curl -s http://localhost:8001/api/health > /dev/null; then
            echo "   🌐 API: RÉPOND"
        else
            echo "   ❌ API: NE RÉPOND PAS"
        fi
    else
        echo "❌ Backend: INACTIF"
    fi
    
    # Frontend
    if pgrep -f "react-scripts" > /dev/null; then
        echo "✅ Frontend: ACTIF (PID: $(pgrep -f react-scripts))"
    else
        echo "❌ Frontend: INACTIF"
    fi
    
    echo ""
    echo "💻 RESSOURCES SYSTÈME:"
    echo "---------------------"
    echo "RAM: $(free -h | awk 'NR==2{printf "%.1fG/%.1fG (%.0f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')"
    echo "Disque: $(df -h / | awk 'NR==2 {print $5}')"
    
    echo ""
    echo "🌐 PORTS RÉSEAU:"
    echo "---------------"
    sudo netstat -tlnp | grep -E ':3000|:8001|:27017' | while read line; do
        echo "   $line"
    done
    
    echo ""
    echo "Actualisation dans 10 secondes... (Ctrl+C pour arrêter)"
    sleep 10
done