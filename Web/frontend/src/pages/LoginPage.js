import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            to="/" 
            className="flex items-center justify-center space-x-2 text-quantum-600 mb-6"
          >
            <ShieldCheckIcon className="h-12 w-12" />
            <div>
              <div className="text-2xl font-bold">QuantumShield</div>
              <div className="text-sm text-gray-500">Phase 1 MVP</div>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre dashboard sécurisé
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Entrez votre nom d'utilisateur"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Entrez votre mot de passe"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-quantum-600 hover:text-quantum-700 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-quantum-50 rounded-lg border border-quantum-200">
          <h3 className="text-sm font-medium text-quantum-800 mb-2">
            🚀 Phase 1 MVP - Fonctionnalités disponibles :
          </h3>
          <ul className="text-xs text-quantum-700 space-y-1">
            <li>• Authentification sécurisée JWT</li>
            <li>• Cryptographie NTRU++ (simulation RSA)</li>
            <li>• Gestion de 3 types de dispositifs IoT</li>
            <li>• Système de tokens QS avec récompenses</li>
            <li>• Dashboard temps réel</li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-quantum-600 transition-colors duration-200"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;