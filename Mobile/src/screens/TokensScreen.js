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
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

import { useAuth } from '../contexts/AuthContext';
import { tokenAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { Colors, GradientColors } from '../constants/colors';

const TokensScreen = () => {
  const { user, refreshProfile } = useAuth();
  const [tokenData, setTokenData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [marketInfo, setMarketInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTokenData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }

      const [balance, transactionsData, market] = await Promise.all([
        tokenAPI.getBalance(),
        tokenAPI.getTransactions(),
        tokenAPI.getMarketInfo()
      ]);

      setTokenData(balance);
      setTransactions(transactionsData.transactions || []);
      setMarketInfo(market);
      
      // Refresh user profile to sync balance
      await refreshProfile();
    } catch (error) {
      console.error('Error loading token data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les données de tokens'
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
    loadTokenData(true);
  }, [loadTokenData]);

  const handleClaimDaily = async () => {
    try {
      const result = await tokenAPI.claimDaily();
      
      Toast.show({
        type: 'success',
        text1: 'Récompenses réclamées',
        text2: `+${result.amount} QS ajoutés à votre solde`
      });
      
      // Refresh data
      loadTokenData();
    } catch (error) {
      console.error('Error claiming daily rewards:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.response?.data?.detail || 'Impossible de réclamer les récompenses'
      });
    }
  };

  useEffect(() => {
    loadTokenData();
  }, [loadTokenData]);

  if (loading && !tokenData) {
    return <LoadingSpinner text="Chargement des tokens..." />;
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'reward':
        return 'gift';
      case 'device_registration':
        return 'hardware-chip';
      case 'daily_bonus':
        return 'calendar';
      case 'heartbeat':
        return 'heart';
      default:
        return 'arrow-forward';
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return Colors.success;
    if (amount < 0) return Colors.error;
    return Colors.quantum[600];
  };

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
      {/* Balance Card */}
      <LinearGradient colors={GradientColors.quantum} style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View style={styles.balanceIcon}>
            <Ionicons name="diamond" size={32} color={Colors.surface} />
          </View>
          <Text style={styles.balanceTitle}>Solde QS</Text>
        </View>
        
        <Text style={styles.balanceAmount}>
          {user?.qs_balance?.toFixed(2) || '0.00'}
        </Text>
        
        <Text style={styles.balanceSubtitle}>
          QuantumShield Tokens
        </Text>
        
        {tokenData?.next_daily_reward && (
          <Button
            title="Réclamer récompenses quotidiennes"
            onPress={handleClaimDaily}
            variant="secondary"
            style={styles.claimButton}
            textStyle={{ color: Colors.quantum[600] }}
          />
        )}
      </LinearGradient>

      {/* Market Info */}
      {marketInfo && (
        <View style={styles.marketSection}>
          <Text style={styles.sectionTitle}>Informations Marché</Text>
          
          <View style={styles.marketCard}>
            <View style={styles.marketGrid}>
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Valeur Actuelle</Text>
                <Text style={styles.marketValue}>
                  {marketInfo.current_value} {marketInfo.base_currency}
                </Text>
              </View>
              
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Total Circulant</Text>
                <Text style={styles.marketValue}>
                  {marketInfo.total_supply?.toLocaleString()} QS
                </Text>
              </View>
              
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Utilisateurs Actifs</Text>
                <Text style={styles.marketValue}>
                  {marketInfo.active_users?.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Dispositifs</Text>
                <Text style={styles.marketValue}>
                  {marketInfo.total_devices?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Earning Opportunities */}
      <View style={styles.earningSection}>
        <Text style={styles.sectionTitle}>Comment gagner des QS</Text>
        
        <View style={styles.earningList}>
          <View style={styles.earningItem}>
            <View style={styles.earningIcon}>
              <Ionicons name="person-add" size={20} color={Colors.success} />
            </View>
            <View style={styles.earningContent}>
              <Text style={styles.earningTitle}>Inscription</Text>
              <Text style={styles.earningDescription}>50 QS offerts à la création du compte</Text>
            </View>
            <Text style={styles.earningAmount}>+50 QS</Text>
          </View>

          <View style={styles.earningItem}>
            <View style={styles.earningIcon}>
              <Ionicons name="gift" size={20} color={Colors.warning} />
            </View>
            <View style={styles.earningContent}>
              <Text style={styles.earningTitle}>Bonus première connexion</Text>
              <Text style={styles.earningDescription}>Bonus unique lors de la première connexion</Text>
            </View>
            <Text style={styles.earningAmount}>+5 QS</Text>
          </View>

          <View style={styles.earningItem}>
            <View style={styles.earningIcon}>
              <Ionicons name="hardware-chip" size={20} color={Colors.quantum[600]} />
            </View>
            <View style={styles.earningContent}>
              <Text style={styles.earningTitle}>Enregistrement dispositif</Text>
              <Text style={styles.earningDescription}>Pour chaque dispositif IoT enregistré</Text>
            </View>
            <Text style={styles.earningAmount}>+10 QS</Text>
          </View>

          <View style={styles.earningItem}>
            <View style={styles.earningIcon}>
              <Ionicons name="heart" size={20} color={Colors.error} />
            </View>
            <View style={styles.earningContent}>
              <Text style={styles.earningTitle}>Heartbeat quotidien</Text>
              <Text style={styles.earningDescription}>Par dispositif actif et jour</Text>
            </View>
            <Text style={styles.earningAmount}>+1 QS</Text>
          </View>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.transactionSection}>
        <Text style={styles.sectionTitle}>Historique des Transactions</Text>
        
        {transactions.length > 0 ? (
          <View style={styles.transactionList}>
            {transactions.slice(0, 10).map((transaction, index) => (
              <View key={transaction.id || index} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={getTransactionIcon(transaction.type)} 
                    size={20} 
                    color={getTransactionColor(transaction.type, transaction.amount)} 
                  />
                </View>
                
                <View style={styles.transactionContent}>
                  <Text style={styles.transactionTitle}>
                    {transaction.description || transaction.type}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.timestamp).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                
                <Text style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type, transaction.amount) }
                ]}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} QS
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyTransactions}>
            <Ionicons name="receipt-outline" size={64} color={Colors.gray[300]} />
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptyText}>
              Vos transactions apparaîtront ici
            </Text>
          </View>
        )}
      </View>

      {/* Token Utility */}
      <View style={styles.utilitySection}>
        <Text style={styles.sectionTitle}>Utilité des Tokens QS</Text>
        
        <View style={styles.utilityCard}>
          <Text style={styles.utilityText}>
            Les tokens QuantumShield (QS) sont la monnaie native de l'écosystème QuantumShield. 
            Ils récompensent la participation au réseau et permettront dans les futures phases :
          </Text>
          
          <View style={styles.utilityList}>
            <View style={styles.utilityItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.utilityItemText}>Accès aux fonctionnalités premium</Text>
            </View>
            <View style={styles.utilityItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.utilityItemText}>Participation au staking</Text>
            </View>
            <View style={styles.utilityItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.utilityItemText}>Gouvernance décentralisée</Text>
            </View>
            <View style={styles.utilityItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.utilityItemText}>Marketplace de services IoT</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  balanceCard: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  balanceIcon: {
    marginRight: 8
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 8
  },
  balanceSubtitle: {
    fontSize: 14,
    color: Colors.quantum[100],
    marginBottom: 20
  },
  claimButton: {
    backgroundColor: Colors.surface,
    borderRadius: 8
  },
  marketSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16
  },
  marketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  marketItem: {
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  marketLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4
  },
  marketValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  earningSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  earningList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  earningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100]
  },
  earningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  earningContent: {
    flex: 1
  },
  earningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2
  },
  earningDescription: {
    fontSize: 12,
    color: Colors.textSecondary
  },
  earningAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success
  },
  transactionSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  transactionList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100]
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  transactionContent: {
    flex: 1
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textMuted
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center'
  },
  utilitySection: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  utilityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  utilityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16
  },
  utilityList: {
    gap: 8
  },
  utilityItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  utilityItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8
  }
});

export default TokensScreen;