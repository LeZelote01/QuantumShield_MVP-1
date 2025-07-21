// Configuration constants
export const API_CONFIG = {
  // Backend URL - Configuration automatique selon l'environnement
  BASE_URL: (() => {
    // En développement
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8001';
    }
    
    // En production sur Vercel
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
      return 'https://quantumshield-backend.railway.app'; // MODIFIER avec votre URL backend
    }
    
    // Fallback développement
    return __DEV__ 
      ? 'http://localhost:8001' 
      : 'https://quantumshield-backend.railway.app'; // MODIFIER avec votre URL backend
  })(),
  
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    
    // Crypto endpoints  
    GENERATE_KEYS: '/api/crypto/generate-keys',
    ENCRYPT: '/api/crypto/encrypt',
    DECRYPT: '/api/crypto/decrypt',
    SIGN: '/api/crypto/sign',
    VERIFY: '/api/crypto/verify',
    
    // Device endpoints
    DEVICES: '/api/devices',
    REGISTER_DEVICE: '/api/devices/register',
    DEVICE_HEARTBEAT: '/api/devices/{id}/heartbeat',
    DEVICE_METRICS: '/api/devices/{id}/metrics',
    
    // Token endpoints
    TOKEN_BALANCE: '/api/tokens/balance',
    TOKEN_TRANSACTIONS: '/api/tokens/transactions',
    CLAIM_DAILY: '/api/tokens/claim-daily',
    TOKEN_MARKET: '/api/tokens/market',
    
    // Dashboard endpoints
    DASHBOARD: '/api/dashboard',
    QUICK_STATS: '/api/dashboard/quick-stats',
    HEALTH: '/api/dashboard/health'
  }
};

export const APP_CONFIG = {
  APP_NAME: 'QuantumShield Mobile',
  VERSION: '1.0.0',
  PHASE: 'Phase 1 MVP',
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: '@QuantumShield:auth_token',
    USER_DATA: '@QuantumShield:user_data',
    SETTINGS: '@QuantumShield:settings'
  },
  
  // Device types
  DEVICE_TYPES: {
    SMART_SENSOR: 'Smart Sensor',
    SECURITY_CAMERA: 'Security Camera', 
    SMART_THERMOSTAT: 'Smart Thermostat'
  },
  
  // Timeouts
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 seconds
    HEARTBEAT: 30000 // 30 seconds
  }
};