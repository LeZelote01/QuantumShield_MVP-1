import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { Colors } from '../constants/colors';

const DashboardScreen = () => {
  const { user, refreshProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
      
      // Refresh user profile to get latest balance
      await refreshProfile();
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger le dashboard'
      });
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, [refreshProfile]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard(true);
  }, [loadDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading && !dashboardData) {
    return <LoadingSpinner text="Chargement du dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorText}>
          Impossible de charger les données du dashboard
        </Text>
        <Button
          title="Réessayer"
          onPress={() => loadDashboard()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const { stats, user_info, device_stats, token_info, performance_metrics } = dashboardData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[Colors.quantum[600]]}
          tintColor={Colors.quantum[600]}
        />
      }
    >
      {/* Welcome Header */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeIconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.quantum[600]} />
          </View>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Bienvenue, {user_info.username}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Dashboard QuantumShield Phase 1
            </Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.memberSince}>
            Membre depuis le {new Date(user_info.member_since).toLocaleDateString('fr-FR')}
          </Text>
          <Text style={styles.walletAddress}>
            Wallet: {user_info.wallet_address.slice(0, 12)}...
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Solde QS"
            value={`${user_info.qs_balance.toFixed(2)}`}
            subtitle="QuantumShield Tokens"
            icon="diamond"
            color="quantum"
            style={styles.statCard}
          />
          
          <StatCard
            title="Mes Dispositifs"
            value={device_stats.total_devices}
            subtitle={`${device_stats.active_devices} actifs`}
            icon="hardware-chip"
            color="quantum"
            style={styles.statCard}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="En Ligne"
            value={device_stats.online_devices}
            subtitle={`${performance_metrics.average_uptime}% uptime`}
            icon="checkmark-circle"
            color="quantum"
            style={styles.statCard}
          />
          
          <StatCard
            title="Activité Hebdo"
            value={performance_metrics.weekly_transactions}
            subtitle={`+${performance_metrics.weekly_earnings} QS gagnés`}
            icon="trending-up"
            color="quantum"
            style={styles.statCard}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité Récente</Text>
        
        <View style={styles.activityCard}>
          {stats.recent_activity && stats.recent_activity.length > 0 ? (
            <View style={styles.activityList}>
              {stats.recent_activity.slice(0, 5).map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.timestamp).toLocaleString('fr-FR')}
                    </Text>
                  </View>
                  {activity.amount && (
                    <Text style={styles.activityAmount}>
                      {activity.amount}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="time-outline" size={48} color={Colors.gray[300]} />
              <Text style={styles.emptyActivityTitle}>Aucune activité récente</Text>
              <Text style={styles.emptyActivityText}>
                Commencez par enregistrer un dispositif IoT
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Réseau</Text>
        
        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Statut:</Text>
            <Text style={[
              styles.performanceValue,
              { color: getStatusColor(performance_metrics.network_status) }
            ]}>
              {performance_metrics.network_status}
            </Text>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Uptime Moyen:</Text>
            <Text style={styles.performanceValue}>
              {performance_metrics.average_uptime}%
            </Text>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Devices Online:</Text>
            <Text style={styles.performanceValue}>
              {performance_metrics.online_devices}/{performance_metrics.total_devices}
            </Text>
          </View>
        </View>
      </View>

      {/* Device Types */}
      {device_stats.devices_by_type && Object.keys(device_stats.devices_by_type).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de Dispositifs</Text>
          
          <View style={styles.deviceTypesCard}>
            {Object.entries(device_stats.devices_by_type).map(([type, count]) => (
              <View key={type} style={styles.deviceTypeItem}>
                <Text style={styles.deviceTypeName}>{type}</Text>
                <View style={styles.deviceTypeCount}>
                  <Text style={styles.deviceTypeCountText}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Token Rewards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Récompenses Disponibles</Text>
        
        <View style={styles.rewardsCard}>
          {token_info.potential_rewards && Object.entries(token_info.potential_rewards).map(([key, reward]) => (
            <View key={key} style={styles.rewardItem}>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
                <Text style={styles.rewardAmount}>+{reward.amount} QS</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Excellent':
      return Colors.success;
    case 'Good':
      return Colors.quantum[600];
    default:
      return Colors.warning;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  welcomeCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  welcomeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.quantum[100],
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  welcomeContent: {
    flex: 1
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2
  },
  userInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200]
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4
  },
  walletAddress: {
    fontSize: 12,
    color: Colors.quantum[600],
    fontWeight: '500'
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  statCard: {
    flex: 1
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  activityList: {
    padding: 16
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100]
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 32,
    textAlign: 'center'
  },
  activityContent: {
    flex: 1
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textMuted
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success
  },
  emptyActivity: {
    alignItems: 'center',
    padding: 40
  },
  emptyActivityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4
  },
  emptyActivityText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center'
  },
  performanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  performanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  deviceTypesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  deviceTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  deviceTypeName: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  deviceTypeCount: {
    backgroundColor: Colors.quantum[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  deviceTypeCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.quantum[700]
  },
  rewardsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  rewardItem: {
    paddingVertical: 8
  },
  rewardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rewardDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1
  },
  rewardAmount: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  retryButton: {
    minWidth: 120
  }
});

export default DashboardScreen;