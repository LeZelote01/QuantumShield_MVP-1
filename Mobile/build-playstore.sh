#!/bin/bash
# 🏪 Script Build QuantumShield pour Google Play Store
# Usage: ./build-playstore.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Functions
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
echo "   QUANTUMSHIELD - BUILD GOOGLE PLAY STORE"
echo "=================================================="
echo "   📱 Création APK natif + AAB pour Play Store"
echo "=================================================="
echo "${NC}"

# Vérifications préalables
log_step "Vérification de l'environnement..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "package.json non trouvé. Assurez-vous d'être dans le dossier /app/mobile/"
    exit 1
fi

# Check if app.json exists
if [ ! -f "app.json" ]; then
    log_error "app.json non trouvé. Projet Expo requis."
    exit 1
fi

log_success "Dossier de projet valide"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    log_warning "Node.js 18+ recommandé. Version actuelle: $(node --version)"
fi

# Check/Install EAS CLI
log_step "Vérification EAS CLI..."
if ! command -v eas &> /dev/null; then
    log_warning "EAS CLI non trouvé. Installation..."
    npm install -g @expo/eas-cli@latest
    log_success "EAS CLI installé"
else
    log_info "EAS CLI trouvé: $(eas --version)"
fi

# Check EAS login
log_step "Vérification authentification Expo..."
if ! eas whoami &> /dev/null; then
    log_warning "Non connecté à Expo. Connexion nécessaire..."
    echo "Veuillez vous connecter avec votre compte Expo:"
    eas login
fi

USER=$(eas whoami)
log_success "Connecté en tant que: $USER"

# Verify/Create EAS configuration
log_step "Configuration EAS Build..."

if [ ! -f "eas.json" ]; then
    log_info "Création configuration EAS optimisée..."
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "withoutCredentials": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      }
    },
    "store": {
      "distribution": "store",
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      }
    }
  }
}
EOF
    log_success "eas.json créé avec profils Play Store"
else
    log_info "eas.json existant trouvé"
fi

# Optimize app.json for Play Store
log_step "Optimisation app.json pour Play Store..."

# Backup original app.json
cp app.json app.json.backup

# Update app.json with Play Store optimizations
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('app.json', 'utf8'));

// Ensure Android configuration for Play Store
if (!config.expo.android) config.expo.android = {};

// Required for Play Store
config.expo.android.package = 'com.quantumshield.mobile';
config.expo.android.versionCode = config.expo.android.versionCode || 1;

// Optimize for Play Store
config.expo.android.compileSdkVersion = 34;
config.expo.android.targetSdkVersion = 34;
config.expo.android.buildToolsVersion = '34.0.0';

// Permissions needed
config.expo.android.permissions = [
  'INTERNET',
  'ACCESS_NETWORK_STATE',
  'CAMERA',
  'VIBRATE'
];

// Adaptive icon for Play Store
config.expo.android.adaptiveIcon = {
  foregroundImage: './assets/adaptive-icon.png',
  backgroundColor: '#0284C7'
};

// Remove problematic plugins for native build
if (config.expo.plugins) {
  config.expo.plugins = config.expo.plugins.filter(plugin => 
    plugin !== 'expo-router'
  );
}

// Ensure orientation is set
config.expo.orientation = 'portrait';

// Add Play Store URL placeholder
config.expo.android.playStoreUrl = 'https://play.google.com/store/apps/details?id=com.quantumshield.mobile';

fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
console.log('✅ app.json optimisé pour Play Store');
"

log_success "Configuration app.json optimisée"

# Clean environment
log_step "Nettoyage de l'environnement de build..."

# Clear caches
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf ~/.expo 2>/dev/null || true
expo r -c 2>/dev/null || true

log_info "Cache nettoyé"

# Install/Update dependencies
log_step "Mise à jour des dépendances..."
npm install

# Check for critical dependencies
CRITICAL_DEPS=("expo" "react" "react-native")
for dep in "${CRITICAL_DEPS[@]}"; do
    if ! npm list "$dep" >/dev/null 2>&1; then
        log_warning "Dépendance manquante: $dep"
        npm install "$dep"
    fi
done

log_success "Dépendances vérifiées"

# Set production environment
export NODE_ENV=production
export EXPO_NO_TELEMETRY=1

# Check assets
log_step "Vérification des assets..."

REQUIRED_ASSETS=("assets/icon.png" "assets/adaptive-icon.png" "assets/splash-icon.png")
for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ ! -f "$asset" ]; then
        log_warning "Asset manquant: $asset"
    else
        log_info "✓ $asset"
    fi
done

# Pre-build validation
log_step "Validation pré-build..."

# Check if project has EAS project ID
if ! grep -q "projectId" app.json; then
    log_info "Configuration projet EAS..."
    eas build:configure
fi

# Verify credentials
log_info "Vérification des credentials..."
if ! eas credentials -p android --list >/dev/null 2>&1; then
    log_warning "Credentials Android non configurés"
    echo "Voulez-vous configurer les credentials maintenant? (y/N)"
    read -r configure_creds
    if [[ $configure_creds =~ ^[Yy]$ ]]; then
        eas credentials
    else
        log_info "Vous pourrez configurer les credentials pendant le build"
    fi
fi

# Build selection menu
echo -e "${PURPLE}"
echo "🏪 Sélectionner le type de build:"
echo "1. APK (pour tests et distribution directe)"
echo "2. AAB (pour Google Play Store) - RECOMMANDÉ"
echo "3. Les deux (APK + AAB)"
echo -e "${NC}"

read -p "Votre choix (1/2/3) [2]: " BUILD_CHOICE
BUILD_CHOICE=${BUILD_CHOICE:-2}

case $BUILD_CHOICE in
    1)
        log_step "🔨 Lancement build APK..."
        eas build -p android --profile preview --non-interactive
        ;;
    2)
        log_step "🔨 Lancement build AAB pour Play Store..."
        eas build -p android --profile production --non-interactive
        ;;
    3)
        log_step "🔨 Lancement build APK + AAB..."
        log_info "Build APK d'abord..."
        eas build -p android --profile preview --non-interactive --no-wait
        
        echo "Attente 30 secondes avant le second build..."
        sleep 30
        
        log_info "Build AAB ensuite..."
        eas build -p android --profile production --non-interactive --no-wait
        ;;
    *)
        log_error "Choix invalide"
        exit 1
        ;;
esac

# Show build status
echo ""
log_step "📊 Statut des builds:"
eas build:list --limit=5

# Get project info
PROJECT_INFO=$(eas project:info 2>/dev/null || echo "Project info not available")
echo ""
log_info "Informations du projet:"
echo "$PROJECT_INFO"

# Restore original app.json
log_step "Restauration configuration originale..."
if [ -f "app.json.backup" ]; then
    mv app.json.backup app.json
    log_info "app.json restauré"
fi

# Final instructions
echo ""
echo -e "${GREEN}🎉 =================================================="
echo "   BUILD QUANTUMSHIELD LANCÉ AVEC SUCCÈS!"
echo "==================================================${NC}"
echo ""

log_success "Builds lancés sur les serveurs Expo"
log_info "⏱️ Durée estimée: 10-15 minutes"
log_info "📧 Notification par email quand terminé"
echo ""

echo -e "${BLUE}📱 Une fois le build terminé:${NC}"
echo "   1. Vous recevrez un email de confirmation"
echo "   2. Téléchargez les fichiers depuis Expo Dashboard"
echo "   3. APK: Pour tests et distribution directe"
echo "   4. AAB: Pour publication sur Google Play Store"
echo ""

echo -e "${YELLOW}🏪 Pour publier sur Google Play Store:${NC}"
echo "   1. Créer compte Google Play Developer (25$)"
echo "   2. Créer nouvelle application"
echo "   3. Upload le fichier AAB (Android App Bundle)"
echo "   4. Compléter store listing (description, screenshots)"
echo "   5. Submit for review (1-3 jours)"
echo ""

echo -e "${PURPLE}📊 Suivi des builds:${NC}"
echo "   • Dashboard: https://expo.dev/accounts/$USER/projects"
echo "   • Commande: eas build:list"
echo "   • Logs: eas build:view [BUILD_ID]"
echo ""

echo -e "${GREEN}🔗 URLs importantes:${NC}"
echo "   • Expo Dashboard: https://expo.dev"
echo "   • Play Console: https://play.google.com/console"
echo "   • Build Logs: eas build:list"
echo ""

log_success "Build QuantumShield pour Play Store lancé! 🚀"
echo "Vérifiez votre email pour les notifications de build terminé."