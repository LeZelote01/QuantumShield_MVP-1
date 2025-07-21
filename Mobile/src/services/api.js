import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, APP_CONFIG } from '../constants/config';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: APP_CONFIG.TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage
      await AsyncStorage.multiRemove([
        APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN,
        APP_CONFIG.STORAGE_KEYS.USER_DATA
      ]);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  }
};

// Crypto API
export const cryptoAPI = {
  generateKeys: async (keyData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.GENERATE_KEYS, keyData);
    return response.data;
  },
  
  encrypt: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.ENCRYPT, data);
    return response.data;
  },
  
  decrypt: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.DECRYPT, data);
    return response.data;
  },
  
  sign: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.SIGN, data);
    return response.data;
  },
  
  verify: async (data) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.VERIFY, data);
    return response.data;
  }
};

// Device API  
export const deviceAPI = {
  getDevices: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.DEVICES);
    return response.data;
  },
  
  registerDevice: async (deviceData) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER_DEVICE, deviceData);
    return response.data;
  },
  
  sendHeartbeat: async (deviceId, data) => {
    const url = API_CONFIG.ENDPOINTS.DEVICE_HEARTBEAT.replace('{id}', deviceId);
    const response = await api.post(url, data);
    return response.data;
  },
  
  getDeviceMetrics: async (deviceId) => {
    const url = API_CONFIG.ENDPOINTS.DEVICE_METRICS.replace('{id}', deviceId);
    const response = await api.get(url);
    return response.data;
  }
};

// Token API
export const tokenAPI = {
  getBalance: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TOKEN_BALANCE);
    return response.data;
  },
  
  getTransactions: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TOKEN_TRANSACTIONS);
    return response.data;
  },
  
  claimDaily: async () => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CLAIM_DAILY);
    return response.data;
  },
  
  getMarketInfo: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TOKEN_MARKET);
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.DASHBOARD);
    return response.data;
  },
  
  getQuickStats: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.QUICK_STATS);
    return response.data;
  },
  
  getHealth: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  }
};

export default api;