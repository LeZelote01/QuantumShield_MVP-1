import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token by fetching profile
          const profile = await authAPI.getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      const { access_token, user: userData } = response;
      
      // Store token and user data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      
      toast.success(`Bienvenue, ${userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      toast.success('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur d\'inscription';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('Déconnexion réussie');
  };

  const updateUserBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, qs_balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshProfile = async () => {
    try {
      if (token) {
        const profile = await authAPI.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
        return profile;
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserBalance,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};