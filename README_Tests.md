# 🎬 Scripts de Test et Capture QuantumShield

Ce dossier contient des scripts automatisés pour tester et capturer toutes les fonctionnalités de l'application Web QuantumShield.

## 📋 Prérequis

1. **Services en cours d'exécution :**
   - Backend sur http://localhost:8001
   - Frontend sur http://localhost:3000
   - MongoDB en cours d'exécution

2. **Dépendances Python :**
   - `playwright` (installé automatiquement par le script)

## 🚀 Scripts Disponibles

### 1. Test Complet avec Vidéo (`complete_test_script.py`)

**Fonctionnalités :**
- ✅ Test de TOUTES les fonctionnalités de l'application
- 🎥 Enregistrement vidéo complet de la session
- 📸 Captures d'écran détaillées de chaque étape
- 🐌 Exécution ralentie pour la démonstration

**Tests inclus :**
1. Page d'accueil
2. Inscription utilisateur
3. Connexion
4. Dashboard avec statistiques
5. Gestion des dispositifs IoT (ajout, heartbeat, changement de statut)
6. Cryptographie NTRU++ (génération de clés, chiffrement, signatures)
7. Système de tokens QS (solde, transactions, récompenses)
8. Navigation et responsive design
9. Déconnexion
10. Vue d'ensemble finale

### 2. Capture d'Écran Simple (`screenshot_script.py`)

**Fonctionnalités :**
- 📸 Captures d'écran rapides de toutes les interfaces
- 🏃‍♂️ Exécution rapide sans vidéo
- 📱 Inclut les vues mobiles responsive
- 🔍 Mode headless pour performance

## 🎯 Utilisation

### Option 1 : Script automatique (Recommandé)
```bash
# Test complet avec vidéo
./run_tests.sh complete

# Captures d'écran uniquement
./run_tests.sh screenshots
```

### Option 2 : Exécution manuelle

```bash
# 1. Installer les dépendances
pip install playwright
python -m playwright install chromium

# 2. Lancer le test complet
python complete_test_script.py

# OU lancer les captures d'écran
python screenshot_script.py
```

## 📁 Fichiers Générés

### Screenshots
- **Dossier :** `screenshots_YYYYMMDD_HHMMSS/`
- **Format :** PNG haute qualité (95%)
- **Contenu :** Une capture pour chaque interface et étape

### Vidéos (Test Complet)
- **Dossier :** `videos_YYYYMMDD_HHMMSS/`
- **Format :** WebM
- **Résolution :** 1920x1080
- **Contenu :** Enregistrement complet de la session

## 🎮 Fonctionnalités Testées

### 🏠 Interface Utilisateur
- [x] Page d'accueil responsive
- [x] Formulaires d'inscription/connexion
- [x] Navigation principale
- [x] Menu utilisateur
- [x] Design mobile

### 📊 Dashboard
- [x] Statistiques en temps réel
- [x] Solde QS
- [x] Activité récente
- [x] Métriques de performance

### 🔌 Dispositifs IoT
- [x] Ajout de dispositifs
- [x] Gestion des statuts (actif/inactif/maintenance)
- [x] Envoi de heartbeat
- [x] Détails des dispositifs
- [x] Statistiques temps réel

### 🔐 Cryptographie NTRU++
- [x] Génération de clés 2048-bit
- [x] Chiffrement/Déchiffrement
- [x] Signatures numériques
- [x] Vérification de signatures
- [x] Métriques de performance

### 🪙 Système de Tokens QS
- [x] Affichage du solde
- [x] Historique des transactions
- [x] Système de récompenses
- [x] Informations marché
- [x] Réclamation de récompenses

## 🐛 Résolution de Problèmes

### Services non démarrés
```bash
# Démarrer le backend
cd /app/Web/backend && python server.py

# Démarrer le frontend
cd /app/Web/frontend && yarn start
```

### Erreurs de dépendances
```bash
pip install --upgrade playwright
python -m playwright install --with-deps chromium
```

### Permissions
```bash
chmod +x run_tests.sh
```

## 📝 Personnalisation

### Modifier les données de test
Éditez les variables dans la classe `QuantumShieldTester` :
```python
self.test_user = {
    "username": "votre_utilisateur",
    "email": "votre@email.com",
    "password": "VotreMotDePasse123!"
}
```

### Ajouter de nouveaux tests
Créez de nouvelles méthodes `async def test_XX_nom_test(self):` dans la classe.

### Modifier la qualité vidéo/screenshot
Ajustez les paramètres dans les méthodes `screenshot()` et `new_context()`.

## 🎬 Exemple de Sortie

```
🚀 Démarrage du test complet de QuantumShield Web App
============================================================

🏠 TEST 1: Page d'accueil
📸 01_homepage.png - Page d'accueil principale
📸 01_homepage_hover_login.png - Survol du bouton Connexion

📝 TEST 2: Inscription utilisateur
📸 02_register_page.png - Page d'inscription
📸 02_register_email_filled.png - Email rempli
...

✅ TEST COMPLET TERMINÉ AVEC SUCCÈS!
📁 Screenshots sauvegardées dans: screenshots_20250723_143022
🎥 Vidéo disponible dans: videos_20250723_143022
```

## 🚀 Utilisation pour Démonstration

Ces scripts sont parfaits pour :
- 📺 Créer des vidéos de démonstration
- 📋 Documentation technique
- 🧪 Tests de régression
- 🎯 Validation des fonctionnalités
- 📱 Tests responsive
- 🔍 Audit d'interface utilisateur