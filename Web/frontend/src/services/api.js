import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================================
// AUTH API
// ================================

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// ================================
// CRYPTO API
// ================================

export const cryptoAPI = {
  generateKeys: async (keySize = 2048) => {
    const response = await api.post('/crypto/generate-keys', null, {
      params: { key_size: keySize }
    });
    return response.data;
  },

  encrypt: async (data, publicKey) => {
    const response = await api.post('/crypto/encrypt', {
      data,
      public_key: publicKey
    });
    return response.data;
  },

  decrypt: async (encryptedData, privateKey) => {
    const response = await api.post('/crypto/decrypt', {
      encrypted_data: encryptedData,
      private_key: privateKey
    });
    return response.data;
  },

  sign: async (data, privateKey) => {
    const response = await api.post('/crypto/sign', null, {
      params: { data, private_key: privateKey }
    });
    return response.data;
  },

  verify: async (data, signature, publicKey) => {
    const response = await api.post('/crypto/verify', null, {
      params: { data, signature, public_key: publicKey }
    });
    return response.data;
  },

  getPerformance: async () => {
    const response = await api.get('/crypto/performance');
    return response.data;
  }
};

// ================================
// DEVICES API
// ================================

export const devicesAPI = {
  register: async (deviceData) => {
    const response = await api.post('/devices/register', deviceData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/devices/');
    return response.data;
  },

  getById: async (deviceId) => {
    const response = await api.get(`/devices/${deviceId}`);
    return response.data;
  },

  sendHeartbeat: async (deviceId, heartbeatData) => {
    const response = await api.post(`/devices/${deviceId}/heartbeat`, heartbeatData);
    return response.data;
  },

  getMetrics: async (deviceId) => {
    const response = await api.get(`/devices/${deviceId}/metrics`);
    return response.data;
  },

  updateStatus: async (deviceId, newStatus) => {
    const response = await api.put(`/devices/${deviceId}/status`, { status: newStatus });
    return response.data;
  },

  getSupportedTypes: async () => {
    const response = await api.get('/devices/types/supported');
    return response.data;
  }
};

// ================================
// TOKENS API
// ================================

export const tokensAPI = {
  getBalance: async () => {
    const response = await api.get('/tokens/balance');
    return response.data;
  },

  getTransactions: async (limit = 50) => {
    const response = await api.get('/tokens/transactions', {
      params: { limit }
    });
    return response.data;
  },

  getInfo: async () => {
    const response = await api.get('/tokens/info');
    return response.data;
  },

  claimDaily: async () => {
    const response = await api.post('/tokens/claim-daily');
    return response.data;
  },

  getMarketInfo: async () => {
    const response = await api.get('/tokens/market');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tokens/stats');
    return response.data;
  }
};

// ================================
// DASHBOARD API
// ================================

export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get('/dashboard/');
    return response.data;
  },

  getQuickStats: async () => {
    const response = await api.get('/dashboard/quick-stats');
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await api.get('/dashboard/global');
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/dashboard/health');
    return response.data;
  }
};

// ================================
// HEALTH CHECK
// ================================

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;