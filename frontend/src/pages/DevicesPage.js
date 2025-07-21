import React, { useState, useEffect } from 'react';
import { devicesAPI, tokensAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  DevicePhoneMobileIcon,
  PlusIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DevicesPage = () => {
  const { updateUserBalance } = useAuth();
  const [devices, setDevices] = useState([]);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    device_id: '',
    device_name: '',
    device_type: ''
  });

  useEffect(() => {
    loadDevices();
    loadSupportedTypes();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await devicesAPI.getAll();
      setDevices(response.devices);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Erreur lors du chargement des dispositifs');
    }
  };

  const loadSupportedTypes = async () => {
    try {
      const response = await devicesAPI.getSupportedTypes();
      setSupportedTypes(response.device_types);
    } catch (error) {
      console.error('Error loading device types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await devicesAPI.register(newDevice);
      
      toast.success(response.message);
      if (response.reward) {
        toast.success(`Récompense: ${response.reward}`);
        // Update user balance (refresh profile would be more accurate)
        setTimeout(async () => {
          const balance = await tokensAPI.getBalance();
          updateUserBalance(balance.balance);
        }, 1000);
      }

      setNewDevice({ device_id: '', device_name: '', device_type: '' });
      setShowAddModal(false);
      await loadDevices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceAction = async (device, action) => {
    try {
      switch (action) {
        case 'heartbeat':
          const heartbeat = {
            device_id: device.device_id,
            status: device.status,
            sensor_data: {
              timestamp: new Date().toISOString(),
              temperature: Math.round(Math.random() * 30 + 15),
              humidity: Math.round(Math.random() * 40 + 30)
            }
          };
          const heartbeatResponse = await devicesAPI.sendHeartbeat(device.device_id, heartbeat);
          toast.success('Heartbeat envoyé avec succès');
          if (heartbeatResponse.reward) {
            toast.success(heartbeatResponse.reward);
          }
          break;
        case 'activate':
          await devicesAPI.updateStatus(device.device_id, 'active');
          toast.success('Dispositif activé');
          break;
        case 'deactivate':
          await devicesAPI.updateStatus(device.device_id, 'inactive');
          toast.success('Dispositif désactivé');
          break;
        case 'maintenance':
          await devicesAPI.updateStatus(device.device_id, 'maintenance');
          toast.success('Dispositif en maintenance');
          break;
        default:
          break;
      }
      await loadDevices();
    } catch (error) {
      toast.error('Erreur lors de l\'action sur le dispositif');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '⚫';
      case 'maintenance': return '🟡';
      default: return '⚫';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Smart Sensor': return '🌡️';
      case 'Security Camera': return '📹';
      case 'Smart Thermostat': return '🏠';
      default: return '📱';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Chargement des dispositifs..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Dispositifs IoT</h1>
          <p className="text-gray-600">Gérez vos dispositifs connectés sécurisés par QuantumShield</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter un dispositif</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-quantum-600">{devices.length}</div>
          <div className="text-sm text-gray-600">Total dispositifs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {devices.filter(d => d.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Actifs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">
            {devices.filter(d => d.status === 'maintenance').length}
          </div>
          <div className="text-sm text-gray-600">En maintenance</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-600">
            {devices.filter(d => d.status === 'inactive').length}
          </div>
          <div className="text-sm text-gray-600">Inactifs</div>
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-lg shadow-md p-6 border device-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getDeviceIcon(device.device_type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{device.device_name}</h3>
                    <p className="text-sm text-gray-600">{device.device_type}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                  {getStatusIcon(device.status)} {device.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono">{device.device_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Créé le:</span>
                  <span>{new Date(device.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dernier heartbeat:</span>
                  <span>{new Date(device.last_heartbeat).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeviceAction(device, 'heartbeat')}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-1"
                  title="Envoyer heartbeat"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Heartbeat</span>
                </button>
                <button
                  onClick={() => setSelectedDevice(device)}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-1"
                  title="Voir détails"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Détails</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 mt-2">
                {device.status !== 'active' && (
                  <button
                    onClick={() => handleDeviceAction(device, 'activate')}
                    className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded"
                  >
                    Activer
                  </button>
                )}
                {device.status === 'active' && (
                  <button
                    onClick={() => handleDeviceAction(device, 'deactivate')}
                    className="text-xs text-gray-600 hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    Désactiver
                  </button>
                )}
                <button
                  onClick={() => handleDeviceAction(device, 'maintenance')}
                  className="text-xs text-orange-600 hover:bg-orange-50 px-2 py-1 rounded"
                >
                  Maintenance
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <DevicePhoneMobileIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun dispositif</h3>
          <p className="text-gray-600 mb-6">Commencez par ajouter votre premier dispositif IoT</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Ajouter un dispositif
          </button>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter un nouveau dispositif
            </h3>
            
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID du dispositif
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="ex: SENSOR_001"
                  value={newDevice.device_id}
                  onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du dispositif
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="ex: Capteur Salon"
                  value={newDevice.device_name}
                  onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de dispositif
                </label>
                <select
                  required
                  className="input-field"
                  value={newDevice.device_type}
                  onChange={(e) => setNewDevice({...newDevice, device_type: e.target.value})}
                >
                  <option value="">Sélectionner un type</option>
                  {supportedTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Ajout...' : 'Ajouter (+10 QS)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du dispositif
              </h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Nom</div>
                <div className="font-medium">{selectedDevice.device_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">ID</div>
                <div className="font-mono text-sm">{selectedDevice.device_id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Type</div>
                <div>{selectedDevice.device_type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Statut</div>
                <div className={`inline-block px-2 py-1 rounded text-sm ${getStatusColor(selectedDevice.status)}`}>
                  {selectedDevice.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Clé publique (tronquée)</div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  {selectedDevice.public_key.substring(0, 100)}...
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Créé le</div>
                <div>{new Date(selectedDevice.created_at).toLocaleString('fr-FR')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Dernier heartbeat</div>
                <div>{new Date(selectedDevice.last_heartbeat).toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;