import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Chargement du dashboard..." />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des données</p>
          <button 
            onClick={loadDashboard}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const { stats, user_info, device_stats, token_info, performance_metrics } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-quantum-100 p-3 rounded-lg">
            <ShieldCheckIcon className="h-8 w-8 text-quantum-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenue, {user_info.username}!
            </h1>
            <p className="text-gray-600">
              Votre dashboard QuantumShield Phase 1 MVP
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">
              Membre depuis le {new Date(user_info.member_since).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-sm text-quantum-600 font-medium">
              Wallet: {user_info.wallet_address.slice(0, 10)}...
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Solde QS"
          value={`${user_info.qs_balance.toFixed(2)}`}
          subtitle="QuantumShield Tokens"
          icon={CurrencyDollarIcon}
          color="quantum"
        />
        <StatCard
          title="Mes Dispositifs"
          value={device_stats.total_devices}
          subtitle={`${device_stats.active_devices} actifs`}
          icon={DevicePhoneMobileIcon}
          color="blue"
        />
        <StatCard
          title="Dispositifs En Ligne"
          value={device_stats.online_devices}
          subtitle={`${performance_metrics.average_uptime}% uptime moyen`}
          icon={ChartBarIcon}
          color="green"
        />
        <StatCard
          title="Activité Hebdo"
          value={performance_metrics.weekly_transactions}
          subtitle={`+${performance_metrics.weekly_earnings} QS gagnés`}
          icon={ClockIcon}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activité Récente
            </h3>
            {stats.recent_activity && stats.recent_activity.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_activity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="text-sm font-medium text-green-600">
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez par enregistrer un dispositif IoT</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Réseau
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Statut:</span>
                <span className={`text-sm font-medium ${
                  performance_metrics.network_status === 'Excellent' ? 'text-green-600' :
                  performance_metrics.network_status === 'Good' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {performance_metrics.network_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime Moyen:</span>
                <span className="text-sm font-medium">{performance_metrics.average_uptime}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Devices Online:</span>
                <span className="text-sm font-medium">
                  {performance_metrics.online_devices}/{performance_metrics.total_devices}
                </span>
              </div>
            </div>
          </div>

          {/* Device Types */}
          {device_stats.devices_by_type && Object.keys(device_stats.devices_by_type).length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Types de Dispositifs
              </h3>
              <div className="space-y-2">
                {Object.entries(device_stats.devices_by_type).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type}</span>
                    <span className="text-sm font-medium bg-quantum-100 text-quantum-700 px-2 py-1 rounded">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Récompenses Disponibles
            </h3>
            <div className="space-y-3">
              {token_info.potential_rewards && Object.entries(token_info.potential_rewards).map(([key, reward]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reward.description}</p>
                    <p className="text-xs text-gray-500">+{reward.amount} QS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;