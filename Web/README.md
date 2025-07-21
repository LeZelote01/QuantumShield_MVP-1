# 🛡️ QuantumShield Phase 1 - MVP Minimal

## 🎯 Vue d'ensemble

QuantumShield Phase 1 est un MVP minimal de cryptographie post-quantique pour l'IoT, conçu pour être déployé **gratuitement** avec un budget de 0€.

### ✨ Fonctionnalités

- **🔐 Authentification JWT sécurisée** 
- **🔑 Cryptographie NTRU++** (simulation RSA pour démonstration)
- **📱 Gestion de 3 types de dispositifs IoT** (Capteurs, Caméras, Thermostats)
- **💰 Système de tokens QS** avec récompenses
- **📊 Dashboard temps réel** avec métriques

## 🚀 Déploiement Gratuit (0€)

### Hébergement recommandé

1. **Frontend**: Vercel (gratuit)
2. **Backend**: Railway ou Render (gratuit)
3. **Database**: MongoDB Atlas (500MB gratuit)

### 🛠️ Installation Locale

#### Prérequis
- Python 3.9+
- Node.js 18+
- MongoDB (local ou Atlas)

#### Backend
```bash
cd phase1_mvp/backend

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement  
cp .env .env.local
# Éditer .env.local avec vos paramètres

# Démarrer le serveur
python server.py
```

#### Frontend
```bash
cd phase1_mvp/frontend

# Installer les dépendances
yarn install

# Configurer l'environnement
cp .env .env.local
# Éditer .env.local avec l'URL du backend

# Démarrer le serveur
yarn start
```

### 📍 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🔧 Configuration

### Variables Backend (.env)
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=quantumshield_phase1
SECRET_KEY=your-secret-key
NTRU_KEY_SIZE=2048
```

### Variables Frontend (.env)
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_APP_NAME=QuantumShield Phase 1
```

## 💰 Système de Récompenses QS

### Gains automatiques
- **Inscription**: +50 QS (initial)  
- **Bonus première connexion**: +5 QS
- **Enregistrement dispositif**: +10 QS
- **Heartbeat quotidien**: +1 QS par dispositif

### Utilisation
1. Créer un compte (50 QS gratuits)
2. Enregistrer des dispositifs IoT (+10 QS chacun)
3. Envoyer des heartbeats quotidiens (+1 QS/jour/dispositif)

## 🔐 Cryptographie NTRU++

### Interface de test
- Génération de paires de clés 2048-bit
- Chiffrement/déchiffrement de messages
- Signature numérique et vérification
- Métriques de performance

### Note technique
La Phase 1 utilise RSA comme simulation de NTRU++ pour démonstration. Les vraies implémentations NTRU seront disponibles dans les phases ultérieures.

## 📱 Dispositifs IoT Supportés

1. **Smart Sensor** 🌡️
   - Capteurs de température, humidité
   - Monitoring environnemental

2. **Security Camera** 📹  
   - Caméras de surveillance
   - Détection de mouvement

3. **Smart Thermostat** 🏠
   - Contrôle température
   - Programmation intelligente

## 📊 Dashboard

### Métriques disponibles
- Solde tokens QS
- Nombre de dispositifs (total, actifs, en ligne)
- Activité récente
- Performance réseau
- Statistiques par type de dispositif

### Fonctionnalités
- Vue d'ensemble en temps réel
- Historique des transactions
- Gestion des récompenses
- Monitoring des dispositifs

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion  
- `GET /api/auth/profile` - Profil utilisateur

### Cryptographie
- `POST /api/crypto/generate-keys` - Génération clés
- `POST /api/crypto/encrypt` - Chiffrement
- `POST /api/crypto/decrypt` - Déchiffrement
- `POST /api/crypto/sign` - Signature
- `POST /api/crypto/verify` - Vérification

### Dispositifs
- `POST /api/devices/register` - Enregistrer dispositif
- `GET /api/devices/` - Liste dispositifs
- `POST /api/devices/{id}/heartbeat` - Heartbeat
- `GET /api/devices/{id}/metrics` - Métriques

### Tokens
- `GET /api/tokens/balance` - Solde
- `GET /api/tokens/transactions` - Historique
- `POST /api/tokens/claim-daily` - Récompenses quotidiennes
- `GET /api/tokens/market` - Info marché

### Dashboard  
- `GET /api/dashboard/` - Dashboard utilisateur
- `GET /api/dashboard/quick-stats` - Stats rapides
- `GET /api/dashboard/health` - Santé système

## 🧪 Tests

### Test du Backend
```bash
curl http://localhost:8001/api/health
```

### Test des fonctionnalités
1. S'inscrire via l'interface web
2. Se connecter au dashboard  
3. Enregistrer un dispositif IoT
4. Tester la cryptographie NTRU++
5. Vérifier les récompenses QS

## 📈 Évolution vers Phase 2

### Fonctionnalités prévues Phase 2 (~15€/mois)
- Blockchain privée avec Proof of Work
- Mining distribué avec récompenses
- 5 types de dispositifs IoT supplémentaires  
- Détection d'anomalies ML
- Domaine personnalisé

### Migration
Les données Phase 1 seront compatibles avec Phase 2. Migration automatique prévue.

## 🛠️ Architecture Technique

### Stack
- **Backend**: FastAPI + Python 3.9+
- **Frontend**: React 19 + Tailwind CSS
- **Database**: MongoDB
- **Auth**: JWT tokens
- **Crypto**: RSA (simulation NTRU++)

### Structure
```
phase1_mvp/
├── backend/
│   ├── server.py           # Serveur principal
│   ├── routes.py           # Toutes les routes API
│   ├── models.py           # Modèles Pydantic
│   ├── auth_service.py     # Service authentification
│   ├── ntru_service.py     # Service cryptographie
│   ├── device_service.py   # Service dispositifs
│   ├── token_service.py    # Service tokens QS
│   └── dashboard_service.py # Service dashboard
└── frontend/
    ├── src/
    │   ├── pages/          # Pages principales
    │   ├── components/     # Composants réutilisables
    │   ├── services/       # Appels API
    │   └── contexts/       # Contextes React
    └── public/
```

## 🚨 Limitations Phase 1

- Maximum 500MB base de données (MongoDB Atlas gratuit)
- Pas de blockchain intégrée
- NTRU++ simulé avec RSA
- 3 types de dispositifs seulement
- Pas de mining distribué
- Pas d'intégrations externes

## 📞 Support

### Issues fréquents
1. **Frontend ne démarre pas**: Vérifier que `react-scripts` est installé
2. **Backend erreur 500**: Vérifier la connexion MongoDB
3. **Tokens non crédités**: Vérifier les logs backend

### Debug
```bash
# Logs backend
tail -f /tmp/phase1_backend.log

# Logs frontend  
tail -f /tmp/phase1_frontend.log
```

## 🎯 Objectifs Phase 1

- ✅ Démonstration concept QuantumShield
- ✅ Interface utilisateur fonctionnelle
- ✅ Cryptographie post-quantique de base
- ✅ Gestion IoT simplifiée  
- ✅ Économie tokens QS
- ✅ Déploiement 0€ possible

---

**© 2024 QuantumShield Phase 1 MVP - Sécurité Post-Quantique Accessible** 🛡️