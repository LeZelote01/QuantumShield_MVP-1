#!/bin/bash
# 🏪 Script de Préparation Google Play Store
# Usage: ./prepare-playstore.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🏪 $1${NC}"
}

# Header
echo -e "${BLUE}"
echo "🏪 =================================================="
echo "   QUANTUMSHIELD - PRÉPARATION PLAY STORE"
echo "=================================================="
echo "   📋 Génération assets et configuration"
echo "=================================================="
echo "${NC}"

# Vérifications
log_step "Vérification de l'environnement..."

if [ ! -f "package.json" ]; then
    log_error "package.json non trouvé. Exécuter depuis /app/mobile/"
    exit 1
fi

if [ ! -f "app.json" ]; then
    log_error "app.json non trouvé. Projet Expo requis."
    exit 1
fi

log_success "Environnement valide"

# Créer structure de dossiers
log_step "Création de la structure d'assets..."

mkdir -p playstore-assets/{screenshots,graphics,descriptions,metadata}
mkdir -p playstore-assets/graphics/{feature-graphic,screenshots-framed,app-icon}

log_success "Structure de dossiers créée"

# Générer app.json optimisé pour Play Store
log_step "Génération app.json optimisé..."

# Backup original
cp app.json app-original.json

cat > app-playstore.json << 'EOF'
{
  "expo": {
    "name": "QuantumShield",
    "slug": "quantumshield-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0284C7"
    },
    "assetBundlePatterns": ["**/*"],
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.quantumshield.mobile",
      "versionCode": 1,
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "buildToolsVersion": "34.0.0",
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA",
        "VIBRATE",
        "ACCESS_WIFI_STATE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0284C7"
      },
      "playStoreUrl": "https://play.google.com/store/apps/details?id=com.quantumshield.mobile",
      "googleServicesFile": "./google-services.json"
    },
    "extra": {
      "eas": {
        "projectId": ""
      }
    }
  }
}
EOF

log_success "Configuration app.json optimisée créée"

# Générer description Play Store complète
log_step "Génération des descriptions Play Store..."

cat > playstore-assets/descriptions/store-listing-short.txt << 'EOF'
Sécurité post-quantique pour dispositifs IoT. Cryptographie NTRU++ résistante quantique.
EOF

cat > playstore-assets/descriptions/store-listing-full.txt << 'EOF'
🛡️ QuantumShield - Sécurité Post-Quantique pour l'IoT

Protégez vos dispositifs IoT avec la cryptographie résistante aux ordinateurs quantiques. QuantumShield utilise la technologie NTRU++ de pointe pour sécuriser votre maison connectée.

✨ FONCTIONNALITÉS PRINCIPALES

🔐 Cryptographie Post-Quantique
• Algorithme NTRU++ résistant aux attaques quantiques
• Clés de chiffrement 2048-bit optimisées pour l'IoT
• Protection contre les futures menaces quantiques

📱 Gestion Dispositifs IoT
• Support capteurs intelligents (température, humidité)
• Gestion caméras de sécurité connectées
• Contrôle thermostats intelligents
• Interface tactile intuitive

📊 Dashboard Temps Réel
• Monitoring en temps réel de vos dispositifs
• Métriques de performance détaillées
• Alertes de sécurité instantanées
• Statistiques d'utilisation

💎 Système de Récompenses QS
• 50 tokens QS gratuits à l'inscription
• Récompenses quotidiennes automatiques
• Bonus pour chaque dispositif enregistré
• Programme de fidélité intégré

🚀 AVANTAGES QUANTUMSHIELD

🔒 Sécurité Maximale
• Résistance prouvée aux attaques quantiques
• Authentification multi-niveaux
• Chiffrement bout-en-bout

⚡ Performance Optimisée
• Interface native Android fluide
• Synchronisation temps réel
• Optimisé pour faible consommation

🎯 Simplicité d'Usage
• Configuration en quelques minutes
• Interface utilisateur intuitive
• Support technique réactif

🌟 VERSION GRATUITE

Cette version Phase 1 MVP est entièrement gratuite et inclut :
• Toutes les fonctionnalités principales
• Support de 3 types de dispositifs IoT
• Système de récompenses complet
• Dashboard complet avec métriques

📲 COMMENCER MAINTENANT

1. Téléchargez QuantumShield
2. Créez votre compte (50 QS offerts)
3. Enregistrez vos dispositifs IoT
4. Profitez de la sécurité post-quantique

🔮 L'AVENIR EST QUANTIQUE

Les ordinateurs quantiques représentent une menace croissante pour la sécurité traditionnelle. QuantumShield vous protège dès aujourd'hui contre les cyberattaques de demain.

Rejoignez la révolution de la sécurité IoT. Téléchargez QuantumShield maintenant !

🏷️ Mots-clés : IoT, Sécurité, Cryptographie, Post-Quantique, NTRU, Dispositifs Connectés, Domotique
EOF

# Release notes template
cat > playstore-assets/descriptions/release-notes-v1.txt << 'EOF'
🚀 Première version de QuantumShield Mobile !

✨ NOUVEAU dans cette version :
• Interface mobile native Android optimisée
• Cryptographie post-quantique NTRU++ complète
• Gestion sécurisée de dispositifs IoT
• Dashboard temps réel avec métriques détaillées
• Système de tokens QS avec récompenses automatiques

🔐 SÉCURITÉ AVANCÉE :
• Chiffrement résistant aux ordinateurs quantiques
• Authentification sécurisée avec session JWT
• Monitoring temps réel des dispositifs
• Alertes de sécurité instantanées

📱 FONCTIONNALITÉS MOBILES :
• Interface tactile optimisée
• Pull-to-refresh sur toutes les listes
• Notifications push pour alertes
• Mode hors-ligne basique

💎 RÉCOMPENSES DE LANCEMENT :
• 50 QS tokens gratuits à l'inscription
• 5 QS bonus première connexion
• 10 QS par dispositif enregistré
• 1 QS par heartbeat quotidien

🎯 Version entièrement gratuite - Aucun achat intégré
📱 Compatible Android 6.0+ (API 23+)
🔒 Données stockées de manière sécurisée

Protégez votre IoT contre les menaces quantiques !
Téléchargez QuantumShield maintenant.

Support: https://quantumshield.com/support
EOF

log_success "Descriptions Play Store générées"

# Générer métadonnées pour Play Console
log_step "Génération des métadonnées Play Console..."

cat > playstore-assets/metadata/app-details.json << 'EOF'
{
  "packageName": "com.quantumshield.mobile",
  "title": "QuantumShield",
  "shortDescription": "Sécurité post-quantique pour dispositifs IoT. Cryptographie NTRU++ résistante quantique.",
  "fullDescription": "Voir store-listing-full.txt",
  "defaultLanguage": "fr-FR",
  "contactEmail": "support@quantumshield.com",
  "contactWebsite": "https://quantumshield.com",
  "privacyPolicyUrl": "https://quantumshield.com/privacy",
  "category": "TOOLS",
  "contentRating": "EVERYONE",
  "targetAudience": "18+",
  "inAppProducts": false,
  "containsAds": false,
  "accessesLocation": false,
  "version": "1.0.0",
  "versionCode": 1,
  "minimumSdk": 23,
  "targetSdk": 34
}
EOF

# Générer Privacy Policy
log_step "Génération Privacy Policy..."

cat > playstore-assets/descriptions/privacy-policy.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Politique de Confidentialité - QuantumShield</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2 { color: #0284C7; }
        .last-updated { background: #f0f9ff; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🛡️ Politique de Confidentialité - QuantumShield</h1>
    
    <div class="last-updated">
        <strong>Dernière mise à jour :</strong> [DATE_ACTUELLE]<br>
        <strong>Version :</strong> 1.0
    </div>

    <h2>1. Informations que nous collectons</h2>
    <p>QuantumShield collecte les informations suivantes pour fournir ses services :</p>
    <ul>
        <li><strong>Informations de compte :</strong> Nom d'utilisateur, adresse email lors de l'inscription</li>
        <li><strong>Données des dispositifs IoT :</strong> Nom, type, localisation, métriques de performance</li>
        <li><strong>Tokens QS :</strong> Solde, historique des transactions, récompenses</li>
        <li><strong>Données d'utilisation :</strong> Logs d'activité pour améliorer l'application</li>
        <li><strong>Données techniques :</strong> Version Android, modèle d'appareil (pour compatibilité)</li>
    </ul>

    <h2>2. Comment nous utilisons vos informations</h2>
    <p>Nous utilisons vos données uniquement pour :</p>
    <ul>
        <li>Fournir les services de sécurité IoT</li>
        <li>Gérer votre compte et l'authentification</li>
        <li>Envoyer des notifications de sécurité importantes</li>
        <li>Améliorer l'application et corriger les bugs</li>
        <li>Calculer et distribuer les récompenses QS</li>
    </ul>

    <h2>3. Partage des données</h2>
    <p><strong>Nous ne vendons, n'échangeons ou ne transférons JAMAIS vos données personnelles à des tiers.</strong></p>
    <p>Vos données restent privées et sécurisées sur nos serveurs.</p>

    <h2>4. Sécurité des données</h2>
    <p>QuantumShield utilise :</p>
    <ul>
        <li><strong>Cryptographie post-quantique NTRU++</strong> pour protéger vos données</li>
        <li><strong>Chiffrement en transit</strong> via HTTPS/TLS</li>
        <li><strong>Stockage sécurisé</strong> avec MongoDB Atlas (certificat SOC 2)</li>
        <li><strong>Authentification JWT</strong> pour les sessions</li>
    </ul>

    <h2>5. Rétention des données</h2>
    <p>Nous conservons vos données :</p>
    <ul>
        <li><strong>Compte actif :</strong> Tant que vous utilisez l'application</li>
        <li><strong>Après suppression :</strong> 30 jours maximum pour backups</li>
        <li><strong>Logs techniques :</strong> 90 jours maximum</li>
    </ul>

    <h2>6. Vos droits</h2>
    <p>Vous avez le droit de :</p>
    <ul>
        <li><strong>Accéder</strong> à toutes vos données stockées</li>
        <li><strong>Modifier</strong> vos informations de profil</li>
        <li><strong>Supprimer</strong> votre compte et toutes vos données</li>
        <li><strong>Exporter</strong> vos données personnelles</li>
    </ul>

    <h2>7. Cookies et tracking</h2>
    <p>QuantumShield mobile <strong>n'utilise PAS</strong> :</p>
    <ul>
        <li>Cookies de tracking publicitaire</li>
        <li>Analytics tiers (Google Analytics, Facebook, etc.)</li>
        <li>Réseaux sociaux intégrés</li>
        <li>Publicités ciblées</li>
    </ul>

    <h2>8. Données des mineurs</h2>
    <p>QuantumShield est destiné aux utilisateurs de <strong>18 ans et plus</strong>. Nous ne collectons pas knowingly d'informations d'enfants de moins de 18 ans.</p>

    <h2>9. Modifications de cette politique</h2>
    <p>Nous vous notifierons de tout changement important via :</p>
    <ul>
        <li>Notification in-app</li>
        <li>Email (si fourni)</li>
        <li>Mise à jour de cette page</li>
    </ul>

    <h2>10. Contact</h2>
    <p>Pour toute question concernant cette politique de confidentialité :</p>
    <ul>
        <li><strong>Email :</strong> privacy@quantumshield.com</li>
        <li><strong>Support :</strong> https://quantumshield.com/support</li>
        <li><strong>Adresse :</strong> [VOTRE_ADRESSE_LÉGALE]</li>
    </ul>

    <hr>
    <p><em>Cette politique de confidentialité est effective à partir du [DATE_ACTUELLE] pour l'application QuantumShield Mobile version 1.0.</em></p>
</body>
</html>
EOF

# Générer guide de screenshots
log_step "Génération du guide de screenshots..."

cat > playstore-assets/screenshots/screenshot-guide.md << 'EOF'
# 📸 Guide de Screenshots pour Google Play Store

## Screenshots requis (2-8 minimum)

### 1. Welcome Screen (Écran d'accueil)
- **Contenu**: Logo QuantumShield + fonctionnalités principales
- **Focus**: Sécurité post-quantique, IoT, tokens QS
- **Nom fichier**: `01-welcome-screen.png`

### 2. Login Screen (Connexion) 
- **Contenu**: Interface de connexion avec sécurité mise en avant
- **Focus**: Authentification sécurisée
- **Nom fichier**: `02-login-screen.png`

### 3. Dashboard (Tableau de bord)
- **Contenu**: Métriques temps réel, solde QS, dispositifs
- **Focus**: Interface moderne, données temps réel
- **Nom fichier**: `03-dashboard-screen.png`

### 4. Devices (Dispositifs)
- **Contenu**: Liste des dispositifs IoT avec statuts
- **Focus**: Gestion simple des dispositifs
- **Nom fichier**: `04-devices-screen.png`

### 5. Crypto (Cryptographie)
- **Contenu**: Interface NTRU++, génération clés
- **Focus**: Sécurité avancée, post-quantique
- **Nom fichier**: `05-crypto-screen.png`

### 6. Tokens (Récompenses)
- **Contenu**: Solde QS, historique, récompenses
- **Focus**: Système de récompenses attractif
- **Nom fichier**: `06-tokens-screen.png`

## Spécifications techniques
- **Format**: PNG (recommandé)
- **Résolution**: 1080x1920 ou 1080x2340 (16:9 ou 19.5:9)
- **Taille max**: 8MB par image
- **DPI**: 320-640 DPI

## Conseils pour de bons screenshots
1. **Données réelles**: Utiliser de vraies données, pas du lorem ipsum
2. **Status bar propre**: Batterie pleine, signal fort, heure cohérente
3. **État cohérent**: Même utilisateur/données dans tous les screenshots
4. **Mise en valeur**: Highlights/annotations sur fonctionnalités clés
5. **Qualité**: Images nettes, couleurs vives

## Script de génération automatique
Utiliser `generate-screenshots.sh` pour automatiser la capture.
EOF

# Créer script de génération de screenshots
log_step "Création du script de screenshots..."

cat > playstore-assets/screenshots/generate-screenshots.sh << 'EOF'
#!/bin/bash
# 📸 Génération automatique de screenshots Play Store

echo "📸 Génération screenshots QuantumShield Play Store..."

# Créer dossier de sortie
mkdir -p screenshots/raw screenshots/final

# Vérifier si ADB est disponible
if ! command -v adb &> /dev/null; then
    echo "❌ ADB non trouvé. Installez Android SDK Platform Tools."
    echo "Ou utilisez la capture manuelle sur votre device."
    exit 1
fi

# Vérifier si un device est connecté
if [ $(adb devices | wc -l) -lt 3 ]; then
    echo "❌ Aucun device Android connecté."
    echo "Connectez votre phone/émulateur avec USB debugging."
    exit 1
fi

echo "✅ Device Android détecté"

# Fonction de screenshot avec délai
take_screenshot() {
    local name=$1
    local delay=${2:-2}
    
    echo "📸 Capture: $name (attente ${delay}s...)"
    sleep $delay
    adb shell screencap -p /sdcard/screenshot_temp.png
    adb pull /sdcard/screenshot_temp.png "screenshots/raw/${name}.png"
    adb shell rm /sdcard/screenshot_temp.png
    echo "✅ ${name}.png sauvegardé"
}

echo "🚀 Lancement de l'app QuantumShield..."
adb shell monkey -p com.quantumshield.mobile 1

echo "⏱️ Attente du démarrage de l'app..."
sleep 10

# Screenshot 1: Welcome/Home screen
take_screenshot "01-welcome-screen" 3

# Navigation vers login
echo "🔐 Navigation vers login..."
adb shell input tap 500 1600  # Bouton "Se connecter" 
take_screenshot "02-login-screen" 2

# Login avec données test
echo "👤 Saisie données de connexion..."
adb shell input tap 500 800   # Champ username
adb shell input text "demo_user"
adb shell input tap 500 900   # Champ password  
adb shell input text "demo123"
adb shell input tap 500 1000  # Bouton login
take_screenshot "02-login-filled" 2

# Attendre redirection dashboard
echo "📊 Attente dashboard..."
sleep 5
take_screenshot "03-dashboard-screen" 2

# Navigation vers devices
echo "📱 Navigation vers dispositifs..."
adb shell input tap 300 2100  # Tab devices
sleep 3
take_screenshot "04-devices-screen" 2

# Navigation vers crypto
echo "🔐 Navigation vers crypto..."
adb shell input tap 500 2100  # Tab crypto
sleep 3
take_screenshot "05-crypto-screen" 2

# Navigation vers tokens
echo "💎 Navigation vers tokens..."
adb shell input tap 700 2100  # Tab tokens
sleep 3
take_screenshot "06-tokens-screen" 2

echo "✅ Screenshots générés dans screenshots/raw/"
echo "📝 Vérifiez et optimisez les images avant upload Play Store"
echo "🎨 Utilisez un éditeur pour ajouter des highlights si nécessaire"
EOF

chmod +x playstore-assets/screenshots/generate-screenshots.sh

# Créer template d'asset checklist
cat > playstore-assets/CHECKLIST.md << 'EOF'
# ✅ Checklist Assets Google Play Store

## 📱 Screenshots (REQUIS)
- [ ] 01-welcome-screen.png (1080x1920 ou 1080x2340)
- [ ] 02-login-screen.png
- [ ] 03-dashboard-screen.png
- [ ] 04-devices-screen.png
- [ ] 05-crypto-screen.png
- [ ] 06-tokens-screen.png
- [ ] Screenshots optimisés (couleurs vives, données réelles)
- [ ] Format PNG, max 8MB chaque

## 🎨 Graphics (REQUIS)
- [ ] Feature Graphic (1024x500 PNG/JPG)
- [ ] App Icon Hi-res (512x512 PNG)
- [ ] App Icon adaptatif Android (généré automatiquement)

## 📝 Descriptions (REQUIS)  
- [ ] Titre court (30 caractères max)
- [ ] Description courte (80 caractères max)
- [ ] Description longue (4000 caractères max)
- [ ] Release notes (500 caractères max)

## 📋 Métadonnées (REQUIS)
- [ ] Catégorie: TOOLS
- [ ] Content Rating: EVERYONE  
- [ ] Target Audience: 18+
- [ ] Contact Email configuré
- [ ] Privacy Policy URL active

## 🔧 Technical (REQUIS)
- [ ] Package name: com.quantumshield.mobile
- [ ] Version code: 1
- [ ] Version name: 1.0.0
- [ ] AAB file uploadé
- [ ] Signing key configuré

## 🎯 Optional mais Recommandé
- [ ] Video promo (30s-2min)
- [ ] Screenshots avec frames/highlights
- [ ] Traductions EN/ES/DE
- [ ] Beta testing avec utilisateurs réels
EOF

log_success "Assets et documentation générés"

# Instructions finales
echo ""
echo -e "${GREEN}🎉 =================================================="
echo "   PRÉPARATION PLAY STORE TERMINÉE!"
echo "=================================================="
echo "${NC}"

log_success "Assets créés dans playstore-assets/"
log_info "📁 Structure générée:"
echo "   playstore-assets/"
echo "   ├── descriptions/     # Textes pour Play Store"
echo "   ├── screenshots/      # Guide + script de capture"  
echo "   ├── graphics/         # Dossiers pour images"
echo "   ├── metadata/         # Informations techniques"
echo "   └── CHECKLIST.md      # Liste de vérification"

echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "   1. Générer keystore: keytool -genkeypair..."
echo "   2. Capturer screenshots: cd playstore-assets/screenshots && ./generate-screenshots.sh"
echo "   3. Créer feature graphic (1024x500) avec Canva/Figma"
echo "   4. Build AAB: ./build-playstore.sh"
echo "   5. Créer compte Google Play Developer (25$)"
echo "   6. Upload AAB dans Play Console"
echo "   7. Compléter store listing avec assets générés"

echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   • Sauvegarder le keystore précieusement (requis pour updates)"
echo "   • Utiliser app-playstore.json pour le build final"
echo "   • Héberger privacy-policy.html sur votre domaine"
echo "   • Tester l'APK sur plusieurs devices Android"

echo ""
log_success "Préparation Google Play Store terminée! 🏪"