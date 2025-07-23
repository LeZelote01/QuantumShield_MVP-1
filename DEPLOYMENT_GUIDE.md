# 🚀 Guide Complet de Déploiement Gratuit - QuantumShield

Ce guide vous permet de déployer QuantumShield gratuitement en utilisant :
- **Frontend :** Vercel (gratuit)
- **Backend :** Railway (gratuit) 
- **Base de données :** MongoDB Atlas (gratuit)

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Configuration MongoDB Atlas](#1-mongodb-atlas)
3. [Déploiement Backend sur Railway](#2-railway-backend)
4. [Déploiement Frontend sur Vercel](#3-vercel-frontend)
5. [Configuration des Variables d'Environnement](#4-variables-denvironnement)
6. [Tests et Validation](#5-tests-et-validation)
7. [Maintenance et Monitoring](#6-maintenance)
8. [Dépannage](#7-dépannage)

---

## 🔧 Prérequis

### Comptes à créer (gratuits) :
- [ ] [GitHub](https://github.com) - Pour le code source
- [ ] [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Base de données
- [ ] [Railway](https://railway.app) - Backend API
- [ ] [Vercel](https://vercel.com) - Frontend web

### Outils nécessaires :
- [ ] Git installé
- [ ] Node.js 18+ installé
- [ ] Python 3.11+ installé

---

## 1. 📊 MongoDB Atlas (Base de Données)

### Étape 1.1 : Création du cluster
1. **Inscrivez-vous sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Créez un nouveau projet :**
   - Nom : `QuantumShield`
   - Sélectionnez "Build a cluster"

3. **Configuration du cluster gratuit :**
   ```
   ☑️ Shared Clusters (FREE)
   ☑️ AWS / Google Cloud / Azure (au choix)
   ☑️ Région la plus proche de vos utilisateurs
   ☑️ Cluster Tier: M0 Sandbox (512 MB storage - FREE)
   ☑️ Nom du cluster: quantumshield-cluster
   ```

### Étape 1.2 : Configuration de sécurité
1. **Créez un utilisateur de base de données :**
   ```
   Username: quantumshield_user
   Password: [Générez un mot de passe sécurisé]
   ⚠️ SAUVEGARDEZ CES INFORMATIONS !
   ```

2. **Configurez l'accès réseau :**
   ```
   ☑️ Add IP Address
   ☑️ Allow access from anywhere (0.0.0.0/0)
   ```

### Étape 1.3 : Récupération de l'URL de connexion
1. **Cliquez sur "Connect" → "Connect your application"**
2. **Copiez l'URL de connexion :**
   ```
   mongodb+srv://quantumshield_user:<password>@quantumshield-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **Remplacez `<password>` par votre mot de passe**

---

## 2. 🚂 Railway (Backend)

### Étape 2.1 : Préparation du code backend
1. **Créez un repository GitHub pour le backend :**
   ```bash
   # Créez un nouveau repo sur GitHub : quantumshield-backend
   
   cd /app/Web/backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/quantumshield-backend.git
   git push -u origin main
   ```

### Étape 2.2 : Préparation pour Railway
1. **Créez un fichier `railway.json` :**
   ```json
   {
     "build": {
       "builder": "HEROKU_BUILDER"
     },
     "deploy": {
       "startCommand": "python server.py"
     }
   }
   ```

2. **Créez un fichier `Procfile` :**
   ```
   web: python server.py
   ```

3. **Mettez à jour `requirements.txt` :**
   ```txt
   fastapi==0.110.1
   uvicorn[standard]==0.25.0
   motor==3.3.1
   pymongo==4.5.0
   python-dotenv>=1.0.1
   pydantic>=2.6.4
   cryptography>=42.0.8
   pycryptodome>=3.20.0
   python-jose>=3.3.0
   passlib>=1.7.4
   python-multipart>=0.0.9
   bcrypt>=4.1.0
   starlette[cors]
   ```

4. **Modifiez `server.py` pour Railway :**
   ```python
   import os
   
   if __name__ == "__main__":
       import uvicorn
       port = int(os.environ.get("PORT", 8001))
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

### Étape 2.3 : Déploiement sur Railway
1. **Inscrivez-vous sur [Railway](https://railway.app)**
2. **Connectez votre compte GitHub**
3. **Créez un nouveau projet :**
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionnez votre repo `quantumshield-backend`

4. **Configuration des variables d'environnement :**
   ```bash
   # Dans Railway Dashboard → Variables
   MONGO_URL=mongodb+srv://quantumshield_user:VOTRE_MOT_DE_PASSE@quantumshield-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=quantumshield_production
   SECRET_KEY=votre_cle_secrete_super_securisee_changez_moi
   NTRU_KEY_SIZE=2048
   API_VERSION=1.0.0
   DEBUG=False
   PORT=8001
   ```

5. **Récupérez l'URL de votre API Railway :**
   ```
   https://votre-app.railway.app
   ```

---

## 3. ▲ Vercel (Frontend)

### Étape 3.1 : Préparation du code frontend
1. **Créez un repository GitHub pour le frontend :**
   ```bash
   # Créez un nouveau repo sur GitHub : quantumshield-frontend
   
   cd /app/Web/frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/quantumshield-frontend.git
   git push -u origin main
   ```

### Étape 3.2 : Configuration pour Vercel
1. **Créez un fichier `vercel.json` :**
   ```json
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
     ]
   }
   ```

2. **Mettez à jour le fichier `.env` :**
   ```bash
   REACT_APP_BACKEND_URL=https://votre-app.railway.app
   REACT_APP_APP_NAME=QuantumShield
   REACT_APP_VERSION=1.0.0
   ```

### Étape 3.3 : Déploiement sur Vercel
1. **Inscrivez-vous sur [Vercel](https://vercel.com)**
2. **Connectez votre compte GitHub**
3. **Importez votre projet :**
   - "Add New Project"
   - Sélectionnez votre repo `quantumshield-frontend`

4. **Configuration du build :**
   ```
   Build Command: yarn build
   Output Directory: build
   Install Command: yarn install
   ```

5. **Variables d'environnement :**
   ```bash
   REACT_APP_BACKEND_URL=https://votre-app.railway.app
   REACT_APP_APP_NAME=QuantumShield
   REACT_APP_VERSION=1.0.0
   ```

---

## 4. 🔐 Variables d'Environnement

### 4.1 : Variables Backend (Railway)
```bash
# Base de données
MONGO_URL=mongodb+srv://quantumshield_user:PASSWORD@quantumshield-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=quantumshield_production

# Sécurité
SECRET_KEY=votre_cle_secrete_ultra_securisee_256_caracteres_minimum
NTRU_KEY_SIZE=2048

# Configuration API
API_VERSION=1.0.0
DEBUG=False
PORT=8001

# CORS (ajoutez votre domaine Vercel)
ALLOWED_ORIGINS=["https://votre-app.vercel.app", "http://localhost:3000"]
```

### 4.2 : Variables Frontend (Vercel)
```bash
REACT_APP_BACKEND_URL=https://votre-app.railway.app
REACT_APP_APP_NAME=QuantumShield Production
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

---

## 5. ✅ Tests et Validation

### 5.1 : Script de test de déploiement
```bash
#!/bin/bash
# test_deployment.sh

echo "🧪 Test de déploiement QuantumShield"

# Test Backend
echo "🔍 Test du backend..."
BACKEND_URL="https://votre-app.railway.app"
curl -f "$BACKEND_URL/api/health" || echo "❌ Backend inaccessible"

# Test Frontend
echo "🔍 Test du frontend..."
FRONTEND_URL="https://votre-app.vercel.app"
curl -f "$FRONTEND_URL" || echo "❌ Frontend inaccessible"

echo "✅ Tests terminés"
```

### 5.2 : Tests fonctionnels
1. **Testez l'inscription :** Créez un compte
2. **Testez la connexion :** Connectez-vous
3. **Testez les dispositifs :** Ajoutez un dispositif IoT
4. **Testez la cryptographie :** Générez des clés
5. **Testez les tokens :** Vérifiez le solde

---

## 6. 📊 Maintenance et Monitoring

### 6.1 : Monitoring automatique
```python
# monitoring.py - Script de surveillance
import requests
import time

def check_services():
    services = {
        "backend": "https://votre-app.railway.app/api/health",
        "frontend": "https://votre-app.vercel.app"
    }
    
    for name, url in services.items():
        try:
            response = requests.get(url, timeout=10)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"{status} {name}: {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: {e}")

if __name__ == "__main__":
    check_services()
```

### 6.2 : Limites des services gratuits
```yaml
MongoDB Atlas (M0):
  - Stockage: 512 MB
  - Connexions: 500 max
  - Pas de sauvegarde automatique

Railway:
  - 512 MB RAM
  - 1 GB stockage
  - 500 heures/mois
  - $5 gratuits/mois

Vercel:
  - 100 GB bande passante
  - 100 déploiements/jour
  - Domaines personnalisés
```

---

## 7. 🔧 Dépannage

### 7.1 : Problèmes courants

#### Backend ne démarre pas sur Railway
```bash
# Vérifiez les logs dans Railway Dashboard
# Solutions communes:
1. Vérifiez MONGO_URL
2. Vérifiez requirements.txt
3. Vérifiez que PORT est défini
4. Vérifiez le Procfile
```

#### Frontend ne se connecte pas au backend
```bash
# Vérifiez:
1. REACT_APP_BACKEND_URL correct
2. CORS configuré sur le backend
3. Backend accessible depuis l'externe
```

#### Erreurs de base de données
```bash
# Solutions:
1. Vérifiez l'IP whitelist sur MongoDB Atlas
2. Vérifiez les credentials
3. Vérifiez l'URL de connexion
```

### 7.2 : Scripts de diagnostic
```python
# diagnosis.py
import os
import requests

def diagnose():
    print("🔍 Diagnostic QuantumShield")
    
    # Variables d'environnement
    backend_url = os.getenv('REACT_APP_BACKEND_URL')
    mongo_url = os.getenv('MONGO_URL')
    
    print(f"Backend URL: {backend_url}")
    print(f"MongoDB URL: {'✅ Configuré' if mongo_url else '❌ Manquant'}")
    
    # Test de connexion
    try:
        response = requests.get(f"{backend_url}/api/health")
        print(f"Backend Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur backend: {e}")

if __name__ == "__main__":
    diagnose()
```

---

## 8. 🚀 Optimisations Post-Déploiement

### 8.1 : Performance
```python
# backend optimizations
# server.py additions

from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["votre-app.railway.app", "*.vercel.app"]
)
```

### 8.2 : Sécurité
```python
# Ajouts de sécurité
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

# Force HTTPS en production
if not DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)
```

### 8.3 : Domaine personnalisé
```bash
# Pour Vercel:
1. Achetez un domaine (Namecheap, Google Domains)
2. Dans Vercel Dashboard → Settings → Domains
3. Ajoutez votre domaine
4. Configurez les DNS

# Pour Railway:
1. Dans Railway Dashboard → Settings → Domains
2. Ajoutez votre sous-domaine (ex: api.votre-domaine.com)
```

---

## 9. 📋 Checklist de Déploiement

### Avant le déploiement :
- [ ] Code testé localement
- [ ] Variables d'environnement définies
- [ ] Repositories GitHub créés
- [ ] Comptes services cloud créés

### MongoDB Atlas :
- [ ] Cluster créé
- [ ] Utilisateur configuré
- [ ] IP whitelist configuré
- [ ] URL de connexion récupérée

### Railway (Backend) :
- [ ] Repository connecté
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] API accessible

### Vercel (Frontend) :
- [ ] Repository connecté
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Site accessible

### Tests finaux :
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] API backend répond
- [ ] Base de données connectée
- [ ] Toutes les fonctionnalités testées

---

## 🎯 URLs Finales

Après déploiement, vous aurez :
```
Frontend (Vercel):     https://votre-app.vercel.app
Backend API (Railway): https://votre-app.railway.app
Base de données:       MongoDB Atlas (géré)
```

---

## 📞 Support

En cas de problème :
1. **Consultez les logs** de chaque service
2. **Vérifiez les variables d'environnement**
3. **Testez les connexions** une par une
4. **Consultez la documentation** des services
5. **Utilisez les scripts de diagnostic** fournis

---

**🎉 Félicitations ! Votre application QuantumShield est maintenant déployée gratuitement en production !**