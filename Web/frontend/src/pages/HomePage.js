import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  DevicePhoneMobileIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: LockClosedIcon,
      title: 'Cryptographie NTRU++',
      description: 'Résistant aux ordinateurs quantiques avec des clés 2048-bit optimisées pour l\'IoT.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Gestion IoT Sécurisée',
      description: 'Enregistrement et monitoring de dispositifs IoT avec chiffrement post-quantique.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Système de Tokens QS',
      description: 'Récompenses pour la participation au réseau et la sécurité collaborative.'
    },
    {
      icon: ChartBarIcon,
      title: 'Dashboard Temps Réel',
      description: 'Monitoring et analytics de vos dispositifs et transactions.'
    }
  ];

  const stats = [
    { label: 'Types d\'appareils', value: '3' },
    { label: 'Algorithmes crypto', value: '1' },
    { label: 'Sécurité', value: '100%' },
    { label: 'Coût MVP', value: '0€' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="quantum-gradient text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16 mr-4" />
              <div>
                <h1 className="text-5xl font-bold mb-2">QuantumShield</h1>
                <p className="text-xl text-quantum-100">Phase 1 - MVP Minimal</p>
              </div>
            </div>
            
            <p className="text-xl mb-8 text-quantum-100 leading-relaxed">
              Sécurisez vos dispositifs IoT avec la cryptographie post-quantique. 
              Protégez-vous contre les futurs ordinateurs quantiques dès aujourd'hui.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-quantum-600 font-semibold py-3 px-8 rounded-lg hover:bg-quantum-50 transition-colors duration-200"
                >
                  Commencer Gratuitement
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-quantum-600 transition-colors duration-200"
                >
                  Se Connecter
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-white text-quantum-600 font-semibold py-3 px-8 rounded-lg hover:bg-quantum-50 transition-colors duration-200"
              >
                Accéder au Dashboard
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-quantum-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Phase 1
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un MVP fonctionnel avec les fonctionnalités core de QuantumShield, 
              déployable gratuitement pour commencer votre voyage dans la sécurité post-quantique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="text-center">
                  <div className="bg-quantum-100 p-3 rounded-lg inline-block mb-4">
                    <feature.icon className="h-8 w-8 text-quantum-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi QuantumShield ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-lg inline-block mb-4">
                  <ShieldCheckIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Sécurité Quantique</h3>
                <p className="text-gray-600">
                  Résistance prouvée contre les attaques des ordinateurs quantiques actuels et futurs.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg inline-block mb-4">
                  <CpuChipIcon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Performance Optimisée</h3>
                <p className="text-gray-600">
                  Algorithmes optimisés pour les dispositifs IoT avec faible consommation énergétique.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-lg inline-block mb-4">
                  <GlobeAltIcon className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Économie Décentralisée</h3>
                <p className="text-gray-600">
                  Récompenses en tokens QS pour encourager la participation et la sécurité du réseau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="quantum-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Sécuriser votre IoT ?
            </h2>
            <p className="text-xl mb-8 text-quantum-100">
              Rejoignez QuantumShield dès maintenant et protégez vos dispositifs gratuitement.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-quantum-600 font-semibold py-3 px-8 rounded-lg hover:bg-quantum-50 transition-colors duration-200"
            >
              Démarrer Maintenant
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 mr-2" />
            <span className="font-semibold">QuantumShield Phase 1 MVP</span>
          </div>
          <p className="text-gray-400">
            © 2024 QuantumShield. Sécurité post-quantique pour l'IoT.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Budget: 0€ | Stack: React + FastAPI + MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;