import React, { useState, useEffect } from 'react';
import { tokensAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  GiftIcon,
  ClockIcon,
  TrophyIcon,
  ArrowUpRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TokensPage = () => {
  const { user, updateUserBalance } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [marketInfo, setMarketInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingRewards, setClaimingRewards] = useState(false);

  useEffect(() => {
    loadTokenData();
  }, []);

  const loadTokenData = async () => {
    try {
      const [tokenData, transactionData, market] = await Promise.all([
        tokensAPI.getInfo(),
        tokensAPI.getTransactions(20),
        tokensAPI.getMarketInfo()
      ]);
      
      setTokenInfo(tokenData);
      setTransactions(transactionData.transactions);
      setMarketInfo(market);
    } catch (error) {
      console.error('Error loading token data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const claimDailyRewards = async () => {
    setClaimingRewards(true);
    try {
      const result = await tokensAPI.claimDaily();
      
      if (result.success) {
        toast.success(`Récompenses réclamées! +${result.reward_amount} QS`);
        // Refresh balance
        const newBalance = await tokensAPI.getBalance();
        updateUserBalance(newBalance.balance);
        // Reload token data
        await loadTokenData();
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la réclamation';
      toast.error(message);
    } finally {
      setClaimingRewards(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'device_registration': return '📱';
      case 'daily_heartbeat': return '💓';
      case 'first_login': return '🎁';
      default: return '💰';
    }
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case 'device_registration': return 'Enregistrement dispositif';
      case 'daily_heartbeat': return 'Heartbeat quotidien';
      case 'first_login': return 'Bonus inscription';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Chargement des tokens..." />
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des données</p>
          <button onClick={loadTokenData} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Tokens QS</h1>
          <p className="text-gray-600">Gérez vos QuantumShield Tokens et récompenses</p>
        </div>
        <button
          onClick={claimDailyRewards}
          disabled={claimingRewards}
          className="btn-primary flex items-center space-x-2"
        >
          <GiftIcon className="h-5 w-5" />
          <span>
            {claimingRewards ? 'Réclamation...' : 'Réclamer Récompenses'}
          </span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Solde Actuel"
          value={`${tokenInfo.balance.toFixed(2)}`}
          subtitle="QS Tokens"
          icon={CurrencyDollarIcon}
          color="quantum"
        />
        <StatCard
          title="Total Gagné"
          value={`${tokenInfo.total_earned.toFixed(2)}`}
          subtitle="Tous les temps"
          icon={TrophyIcon}
          color="green"
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          subtitle="Dans l'historique"
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          title="Valeur USD"
          value={`$${(tokenInfo.balance * (marketInfo?.current_price || 0.10)).toFixed(2)}`}
          subtitle={`@ $${marketInfo?.current_price || '0.10'} / QS`}
          icon={ArrowUpRightIcon}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Historique des Transactions
            </h3>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatTransactionType(transaction.transaction_type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString('fr-FR')}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-gray-600">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        +{transaction.amount.toFixed(2)} QS
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Aucune transaction</p>
                <p className="text-sm text-gray-400">
                  Commencez par enregistrer un dispositif IoT
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Potential Rewards */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Récompenses Disponibles
            </h3>
            <div className="space-y-3">
              {tokenInfo.potential_rewards && Object.entries(tokenInfo.potential_rewards).map(([key, reward]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-quantum-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reward.description}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      +{reward.amount} QS
                    </p>
                  </div>
                  <div className="text-2xl">
                    {key === 'device_registration' ? '📱' : '💓'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Info */}
          {marketInfo && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations Marché
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nom:</span>
                  <span className="text-sm font-medium">{marketInfo.token_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Symbole:</span>
                  <span className="text-sm font-medium">{marketInfo.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prix actuel:</span>
                  <span className="text-sm font-medium text-green-600">
                    ${marketInfo.current_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supply max:</span>
                  <span className="text-sm font-medium">
                    {marketInfo.initial_supply.toLocaleString()} QS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phase:</span>
                  <span className="text-sm font-medium text-quantum-600">
                    {marketInfo.market_phase}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations Wallet
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Adresse Wallet:</span>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                  {tokenInfo.wallet_address}
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tokenInfo.wallet_address);
                  toast.success('Adresse copiée!');
                }}
                className="w-full btn-secondary text-sm"
              >
                Copier l'adresse
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  💡 Comment gagner des QS ?
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Enregistrer un nouveau dispositif: +10 QS</li>
                  <li>• Heartbeat quotidien par dispositif: +1 QS</li>
                  <li>• Maintenir vos dispositifs actifs</li>
                  <li>• Plus de récompenses dans les prochaines phases!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokensPage;