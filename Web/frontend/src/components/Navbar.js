import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheckIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => `
    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive(path) 
      ? 'bg-quantum-600 text-white' 
      : 'text-gray-700 hover:bg-quantum-100 hover:text-quantum-700'
    }
  `;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-quantum-600 font-bold text-xl"
          >
            <ShieldCheckIcon className="h-8 w-8" />
            <span>QuantumShield</span>
            <span className="text-sm bg-quantum-100 text-quantum-700 px-2 py-1 rounded-full">
              Phase 1
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link to="/devices" className={navLinkClass('/devices')}>
                  <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                  Dispositifs
                </Link>
                <Link to="/crypto" className={navLinkClass('/crypto')}>
                  <CpuChipIcon className="h-4 w-4 mr-1" />
                  Cryptographie
                </Link>
                <Link to="/tokens" className={navLinkClass('/tokens')}>
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  Tokens QS
                </Link>
              </>
            ) : (
              <Link to="/" className={navLinkClass('/')}>
                <HomeIcon className="h-4 w-4 mr-1" />
                Accueil
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Balance */}
                <div className="hidden md:flex items-center space-x-2 bg-quantum-50 px-3 py-2 rounded-lg">
                  <CurrencyDollarIcon className="h-4 w-4 text-quantum-600" />
                  <span className="text-sm font-medium text-quantum-700">
                    {user?.qs_balance?.toFixed(2) || '0.00'} QS
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                  <span className="hidden md:block text-sm text-gray-700">
                    {user?.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  title="Déconnexion"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:block text-sm">Déconnexion</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-quantum-600 hover:text-quantum-700 font-medium text-sm"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="flex space-x-4">
              <Link to="/dashboard" className={`${navLinkClass('/dashboard')} text-xs`}>
                <ChartBarIcon className="h-4 w-4" />
              </Link>
              <Link to="/devices" className={`${navLinkClass('/devices')} text-xs`}>
                <DevicePhoneMobileIcon className="h-4 w-4" />
              </Link>
              <Link to="/crypto" className={`${navLinkClass('/crypto')} text-xs`}>
                <CpuChipIcon className="h-4 w-4" />
              </Link>
              <Link to="/tokens" className={`${navLinkClass('/tokens')} text-xs`}>
                <CurrencyDollarIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;