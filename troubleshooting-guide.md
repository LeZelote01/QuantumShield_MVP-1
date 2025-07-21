# GUIDE DE DÉPANNAGE QUANTUMSHIELD

## 🚨 PROBLÈMES COURANTS

### 1. MongoDB ne démarre pas
```bash
# Vérifier le statut
sudo systemctl status mongod

# Redémarrer
sudo systemctl restart mongod

# Voir les logs
sudo journalctl -u mongod -f
```

### 2. Backend ne répond pas (port 8001)
```bash
# Vérifier si le port est occupé
sudo netstat -tlnp | grep :8001

# Tuer le processus si nécessaire
sudo pkill -f "server.py"

# Redémarrer
cd /home/$USER/quantumshield/backend
source venv/bin/activate
python server.py
```

### 3. Frontend ne se lance pas (port 3000)
```bash
# Vérifier Node.js
node --version
npm --version

# Nettoyer et réinstaller
cd /home/$USER/quantumshield/frontend
rm -rf node_modules
yarn install

# Vérifier les dépendances
yarn list --depth=0
```

### 4. Problèmes de permissions
```bash
# Corriger les permissions
sudo chown -R $USER:$USER /home/$USER/quantumshield
chmod +x *.sh
```

### 5. Erreur de connexion à la base de données
```bash
# Vérifier MongoDB
mongo --eval 'db.runCommand({ connectionStatus: 1 })'

# Créer la base manuellement
mongo
> use quantumshield_phase1
> db.createCollection("users")
> exit
```

### 6. Port 3000 ou 8001 déjà utilisé
```bash
# Trouver le processus
sudo lsof -i :3000
sudo lsof -i :8001

# Tuer le processus
sudo kill -9 [PID]
```

### 7. Problèmes de réseau VM
```bash
# Vérifier la configuration réseau
ip addr show
ping google.com

# Dans VMware: VM → Settings → Network Adapter
# Changer de NAT vers Bridged ou vice versa
```

### 8. Erreurs Python/pip
```bash
# Réinstaller l'environnement virtuel
cd /home/$USER/quantumshield/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 9. Erreurs Yarn/npm
```bash
# Nettoyer le cache
yarn cache clean
npm cache clean --force

# Utiliser npm au lieu de yarn si problème
rm yarn.lock
npm install
```

### 10. Interface non accessible depuis l'hôte
```bash
# VM en mode Bridged
# Obtenir l'IP de la VM
ip addr show | grep inet

# Modifier le frontend .env
echo "REACT_APP_BACKEND_URL=http://[IP_VM]:8001" > frontend/.env

# Redémarrer les services
```

## 🔧 COMMANDES DE DIAGNOSTIC

### Vérification complète du système
```bash
#!/bin/bash
echo "🔍 DIAGNOSTIC QUANTUMSHIELD"
echo "=========================="

echo "📦 Versions des outils:"
node --version
python3 --version
mongo --version

echo "🌐 Ports en écoute:"
sudo netstat -tlnp | grep -E ':3000|:8001|:27017'

echo "🔄 Services actifs:"
systemctl is-active mongod
pgrep -f "server.py"
pgrep -f "react-scripts"

echo "💾 Espace disque:"
df -h | head -2

echo "🧠 Mémoire:"
free -h

echo "🌐 Connectivité:"
curl -s http://localhost:8001/api/health || echo "Backend inaccessible"
curl -s http://localhost:3000 > /dev/null && echo "Frontend accessible" || echo "Frontend inaccessible"
```