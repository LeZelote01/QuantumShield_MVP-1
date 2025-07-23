import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
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
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez la révolution de la sécurité IoT
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
                placeholder="Choisissez un nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                placeholder="votre.email@example.com"
                value={formData.email}
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
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
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
                  Création en cours...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="text-quantum-600 hover:text-quantum-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            ✨ En vous inscrivant, vous obtenez :
          </h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• 50 QS gratuits pour démarrer</li>
            <li>• Accès à la cryptographie NTRU++</li>
            <li>• Dashboard personnalisé</li>
            <li>• Enregistrement illimité d'appareils IoT</li>
            <li>• Récompenses pour l'activité réseau</li>
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

export default RegisterPage;