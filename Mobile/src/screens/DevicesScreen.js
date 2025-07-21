import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { deviceAPI } from '../services/api';
import { APP_CONFIG } from '../constants/config';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors } from '../constants/colors';

const DevicesScreen = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [newDeviceForm, setNewDeviceForm] = useState({
    name: '',
    location: '',
    description: ''
  });

  const deviceTypes = [
    {
      key: 'SMART_SENSOR',
      name: APP_CONFIG.DEVICE_TYPES.SMART_SENSOR,
      icon: 'thermometer',
      description: 'Capteurs de température, humidité'
    },
    {
      key: 'SECURITY_CAMERA', 
      name: APP_CONFIG.DEVICE_TYPES.SECURITY_CAMERA,
      icon: 'videocam',
      description: 'Caméras de surveillance, détection mouvement'
    },
    {
      key: 'SMART_THERMOSTAT',
      name: APP_CONFIG.DEVICE_TYPES.SMART_THERMOSTAT,
      icon: 'home',
      description: 'Contrôle température, programmation'
    }
  ];

  const loadDevices = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      
      const data = await deviceAPI.getDevices();
      setDevices(data.devices || []);
    } catch (error) {
      console.error('Error loading devices:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les dispositifs'
      });
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDevices(true);
  }, [loadDevices]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleRegisterDevice = async () => {
    if (!selectedDeviceType || !newDeviceForm.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs requis'
      });
      return;
    }

    try {
      const deviceData = {
        device_type: selectedDeviceType,
        name: newDeviceForm.name.trim(),
        location: newDeviceForm.location.trim() || 'Non spécifiée',
        description: newDeviceForm.description.trim() || ''
      };

      const result = await deviceAPI.registerDevice(deviceData);
      
      Toast.show({
        type: 'success',
        text1: 'Dispositif enregistré',
        text2: `+10 QS gagnés ! Device ID: ${result.device.device_id.slice(0, 8)}...`
      });

      // Reset form and close modal
      setNewDeviceForm({ name: '', location: '', description: '' });
      setSelectedDeviceType('');
      setModalVisible(false);
      
      // Refresh devices list
      loadDevices();
    } catch (error) {
      console.error('Error registering device:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur d\'enregistrement',
        text2: error.response?.data?.detail || 'Impossible d\'enregistrer le dispositif'
      });
    }
  };

  const sendHeartbeat = async (deviceId) => {
    try {
      await deviceAPI.sendHeartbeat(deviceId, {
        status: 'online',
        timestamp: new Date().toISOString()
      });
      
      Toast.show({
        type: 'success',
        text1: 'Heartbeat envoyé',
        text2: 'Le dispositif est maintenant en ligne'
      });
      
      // Refresh devices to update status
      loadDevices();
    } catch (error) {
      console.error('Error sending heartbeat:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible d\'envoyer le heartbeat'
      });
    }
  };

  const getDeviceIcon = (deviceType) => {
    const type = deviceTypes.find(t => t.name === deviceType);
    return type ? type.icon : 'hardware-chip';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return Colors.success;
      case 'active':
        return Colors.quantum[600];
      case 'offline':
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  if (loading && devices.length === 0) {
    return <LoadingSpinner text="Chargement des dispositifs..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.quantum[600]]}
            tintColor={Colors.quantum[600]}
          />
        }
      >
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{devices.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {devices.filter(d => d.status === 'online').length}
            </Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {devices.filter(d => d.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
        </View>

        {/* Devices List */}
        <View style={styles.devicesSection}>
          <Text style={styles.sectionTitle}>Mes Dispositifs</Text>
          
          {devices.length > 0 ? (
            <View style={styles.devicesList}>
              {devices.map((device, index) => (
                <View key={device.device_id || index} style={styles.deviceCard}>
                  <View style={styles.deviceHeader}>
                    <View style={styles.deviceIcon}>
                      <Ionicons 
                        name={getDeviceIcon(device.device_type)} 
                        size={24} 
                        color={Colors.quantum[600]} 
                      />
                    </View>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceType}>{device.device_type}</Text>
                      <Text style={styles.deviceLocation}>📍 {device.location}</Text>
                    </View>
                    <View style={styles.deviceStatus}>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(device.status) }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(device.status) }
                      ]}>
                        {device.status || 'Inconnu'}
                      </Text>
                    </View>
                  </View>

                  {device.description && (
                    <Text style={styles.deviceDescription}>
                      {device.description}
                    </Text>
                  )}

                  <View style={styles.deviceFooter}>
                    <Text style={styles.deviceId}>
                      ID: {device.device_id.slice(0, 12)}...
                    </Text>
                    <View style={styles.deviceActions}>
                      <TouchableOpacity
                        style={styles.heartbeatButton}
                        onPress={() => sendHeartbeat(device.device_id)}
                      >
                        <Ionicons name="heart" size={16} color={Colors.error} />
                        <Text style={styles.heartbeatText}>Heartbeat</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="hardware-chip-outline" size={64} color={Colors.gray[300]} />
              <Text style={styles.emptyTitle}>Aucun dispositif</Text>
              <Text style={styles.emptyText}>
                Commencez par enregistrer votre premier dispositif IoT
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Device Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Register Device Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enregistrer un dispositif</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Device Type Selection */}
            <Text style={styles.modalSectionTitle}>Type de dispositif</Text>
            <View style={styles.deviceTypesList}>
              {deviceTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.deviceTypeCard,
                    selectedDeviceType === type.key && styles.selectedDeviceType
                  ]}
                  onPress={() => setSelectedDeviceType(type.key)}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={32} 
                    color={selectedDeviceType === type.key ? Colors.quantum[600] : Colors.gray[400]} 
                  />
                  <Text style={[
                    styles.deviceTypeName,
                    selectedDeviceType === type.key && styles.selectedDeviceTypeName
                  ]}>
                    {type.name}
                  </Text>
                  <Text style={styles.deviceTypeDescription}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Device Form */}
            <View style={styles.deviceForm}>
              <Input
                label="Nom du dispositif *"
                value={newDeviceForm.name}
                onChangeText={(value) => setNewDeviceForm(prev => ({ ...prev, name: value }))}
                placeholder="Ex: Capteur Salon"
                icon="hardware-chip-outline"
              />

              <Input
                label="Emplacement"
                value={newDeviceForm.location}
                onChangeText={(value) => setNewDeviceForm(prev => ({ ...prev, location: value }))}
                placeholder="Ex: Salon, Bureau, Chambre"
                icon="location-outline"
              />

              <Input
                label="Description"
                value={newDeviceForm.description}
                onChangeText={(value) => setNewDeviceForm(prev => ({ ...prev, description: value }))}
                placeholder="Description optionnelle"
                icon="document-text-outline"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Bonus Info */}
            <View style={styles.bonusInfo}>
              <Ionicons name="gift" size={24} color={Colors.warning} />
              <Text style={styles.bonusText}>
                🎉 Bonus: +10 QS pour chaque dispositif enregistré
              </Text>
            </View>

            <Button
              title="Enregistrer le dispositif"
              onPress={handleRegisterDevice}
              disabled={!selectedDeviceType || !newDeviceForm.name.trim()}
              style={styles.registerButton}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollView: {
    flex: 1
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.quantum[600],
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary
  },
  devicesSection: {
    paddingHorizontal: 16,
    paddingBottom: 80
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16
  },
  devicesList: {
    gap: 12
  },
  deviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  deviceIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.quantum[100],
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  deviceInfo: {
    flex: 1
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2
  },
  deviceType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  deviceLocation: {
    fontSize: 12,
    color: Colors.textMuted
  },
  deviceStatus: {
    alignItems: 'center'
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  deviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200]
  },
  deviceId: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace'
  },
  deviceActions: {
    flexDirection: 'row'
  },
  heartbeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error + '20',
    borderRadius: 16
  },
  heartbeatText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 4,
    fontWeight: '600'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.quantum[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200]
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  closeButton: {
    padding: 4
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16
  },
  deviceTypesList: {
    gap: 12,
    marginBottom: 32
  },
  deviceTypeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray[200]
  },
  selectedDeviceType: {
    borderColor: Colors.quantum[600],
    backgroundColor: Colors.quantum[50]
  },
  deviceTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 4
  },
  selectedDeviceTypeName: {
    color: Colors.quantum[600]
  },
  deviceTypeDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center'
  },
  deviceForm: {
    marginBottom: 24
  },
  bonusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24
  },
  bonusText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1
  },
  registerButton: {
    marginBottom: 20
  }
});

export default DevicesScreen;