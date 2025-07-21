import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { cryptoAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors } from '../constants/colors';

const CryptoScreen = () => {
  const [activeTab, setActiveTab] = useState('generate'); // generate, encrypt, decrypt, sign, verify
  const [loading, setLoading] = useState(false);
  
  // Generation state
  const [keySize, setKeySize] = useState('2048');
  const [generatedKeys, setGeneratedKeys] = useState(null);
  
  // Encryption/Decryption state
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  
  // Signature state
  const [signMessage, setSignMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const tabs = [
    { id: 'generate', title: 'Génération', icon: 'key' },
    { id: 'encrypt', title: 'Chiffrement', icon: 'lock-closed' },
    { id: 'decrypt', title: 'Déchiffrement', icon: 'lock-open' },
    { id: 'sign', title: 'Signature', icon: 'create' },
    { id: 'verify', title: 'Vérification', icon: 'checkmark-circle' }
  ];

  const handleGenerateKeys = async () => {
    setLoading(true);
    try {
      const result = await cryptoAPI.generateKeys({
        key_size: parseInt(keySize),
        algorithm: 'NTRU++'
      });
      
      setGeneratedKeys(result);
      setPublicKey(result.public_key);
      setPrivateKey(result.private_key);
      
      Toast.show({
        type: 'success',
        text1: 'Clés générées',
        text2: `Paire de clés NTRU++ ${keySize}-bit créée`
      });
    } catch (error) {
      console.error('Key generation error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de génération',
        text2: error.response?.data?.detail || 'Impossible de générer les clés'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!publicKey.trim() || !message.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Champs manquants',
        text2: 'Veuillez fournir une clé publique et un message'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.encrypt({
        public_key: publicKey.trim(),
        message: message.trim()
      });
      
      setEncryptedMessage(result.encrypted_message);
      
      Toast.show({
        type: 'success',
        text1: 'Message chiffré',
        text2: 'Le message a été chiffré avec succès'
      });
    } catch (error) {
      console.error('Encryption error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de chiffrement',
        text2: error.response?.data?.detail || 'Impossible de chiffrer le message'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!privateKey.trim() || !encryptedMessage.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Champs manquants',
        text2: 'Veuillez fournir une clé privée et un message chiffré'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.decrypt({
        private_key: privateKey.trim(),
        encrypted_message: encryptedMessage.trim()
      });
      
      setDecryptedMessage(result.decrypted_message);
      
      Toast.show({
        type: 'success',
        text1: 'Message déchiffré',
        text2: 'Le message a été déchiffré avec succès'
      });
    } catch (error) {
      console.error('Decryption error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de déchiffrement',
        text2: error.response?.data?.detail || 'Impossible de déchiffrer le message'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!privateKey.trim() || !signMessage.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Champs manquants',
        text2: 'Veuillez fournir une clé privée et un message'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.sign({
        private_key: privateKey.trim(),
        message: signMessage.trim()
      });
      
      setSignature(result.signature);
      
      Toast.show({
        type: 'success',
        text1: 'Message signé',
        text2: 'La signature numérique a été créée'
      });
    } catch (error) {
      console.error('Signing error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de signature',
        text2: error.response?.data?.detail || 'Impossible de signer le message'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!publicKey.trim() || !verifyMessage.trim() || !verifySignature.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Champs manquants',
        text2: 'Veuillez fournir tous les champs requis'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.verify({
        public_key: publicKey.trim(),
        message: verifyMessage.trim(),
        signature: verifySignature.trim()
      });
      
      setVerifyResult(result.valid);
      
      Toast.show({
        type: result.valid ? 'success' : 'error',
        text1: result.valid ? 'Signature valide' : 'Signature invalide',
        text2: result.valid ? 'La signature a été vérifiée' : 'La signature n\'est pas valide'
      });
    } catch (error) {
      console.error('Verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de vérification',
        text2: error.response?.data?.detail || 'Impossible de vérifier la signature'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabDescription}>
              Générez une nouvelle paire de clés NTRU++ résistante aux attaques quantiques.
            </Text>
            
            <View style={styles.keySizeContainer}>
              <Text style={styles.sectionTitle}>Taille de clé</Text>
              <View style={styles.keySizeButtons}>
                {['1024', '2048', '4096'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.keySizeButton,
                      keySize === size && styles.selectedKeySize
                    ]}
                    onPress={() => setKeySize(size)}
                  >
                    <Text style={[
                      styles.keySizeText,
                      keySize === size && styles.selectedKeySizeText
                    ]}>
                      {size} bit
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Générer les clés"
              onPress={handleGenerateKeys}
              loading={loading}
              disabled={loading}
              icon="key"
            />

            {generatedKeys && (
              <View style={styles.generatedKeys}>
                <Text style={styles.sectionTitle}>Clés générées</Text>
                
                <View style={styles.keySection}>
                  <Text style={styles.keyLabel}>Clé publique:</Text>
                  <View style={styles.keyContainer}>
                    <Text style={styles.keyText} numberOfLines={3}>
                      {generatedKeys.public_key}
                    </Text>
                  </View>
                </View>

                <View style={styles.keySection}>
                  <Text style={styles.keyLabel}>Clé privée:</Text>
                  <View style={styles.keyContainer}>
                    <Text style={styles.keyText} numberOfLines={3}>
                      {generatedKeys.private_key}
                    </Text>
                  </View>
                </View>

                {generatedKeys.metrics && (
                  <View style={styles.metricsContainer}>
                    <Text style={styles.metricsTitle}>Métriques de performance</Text>
                    <Text style={styles.metricsText}>
                      Temps de génération: {generatedKeys.metrics.generation_time_ms}ms
                    </Text>
                    <Text style={styles.metricsText}>
                      Taille: {generatedKeys.metrics.key_size_bits} bits
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );

      case 'encrypt':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabDescription}>
              Chiffrez un message avec la clé publique NTRU++.
            </Text>
            
            <Input
              label="Clé publique"
              value={publicKey}
              onChangeText={setPublicKey}
              placeholder="Collez votre clé publique ici"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Message à chiffrer"
              value={message}
              onChangeText={setMessage}
              placeholder="Entrez votre message secret"
              multiline
              numberOfLines={4}
            />

            <Button
              title="Chiffrer le message"
              onPress={handleEncrypt}
              loading={loading}
              disabled={loading}
              icon="lock-closed"
            />

            {encryptedMessage && (
              <View style={styles.resultContainer}>
                <Text style={styles.sectionTitle}>Message chiffré</Text>
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>
                    {encryptedMessage}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );

      case 'decrypt':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabDescription}>
              Déchiffrez un message avec votre clé privée NTRU++.
            </Text>
            
            <Input
              label="Clé privée"
              value={privateKey}
              onChangeText={setPrivateKey}
              placeholder="Collez votre clé privée ici"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Message chiffré"
              value={encryptedMessage}
              onChangeText={setEncryptedMessage}
              placeholder="Collez le message chiffré"
              multiline
              numberOfLines={4}
            />

            <Button
              title="Déchiffrer le message"
              onPress={handleDecrypt}
              loading={loading}
              disabled={loading}
              icon="lock-open"
            />

            {decryptedMessage && (
              <View style={styles.resultContainer}>
                <Text style={styles.sectionTitle}>Message déchiffré</Text>
                <View style={[styles.resultBox, { backgroundColor: Colors.success + '20' }]}>
                  <Text style={styles.resultText}>
                    {decryptedMessage}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );

      case 'sign':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabDescription}>
              Signez numériquement un message avec votre clé privée.
            </Text>
            
            <Input
              label="Clé privée"
              value={privateKey}
              onChangeText={setPrivateKey}
              placeholder="Collez votre clé privée ici"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Message à signer"
              value={signMessage}
              onChangeText={setSignMessage}
              placeholder="Entrez le message à signer"
              multiline
              numberOfLines={4}
            />

            <Button
              title="Signer le message"
              onPress={handleSign}
              loading={loading}
              disabled={loading}
              icon="create"
            />

            {signature && (
              <View style={styles.resultContainer}>
                <Text style={styles.sectionTitle}>Signature numérique</Text>
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>
                    {signature}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );

      case 'verify':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabDescription}>
              Vérifiez l'authenticité d'une signature numérique.
            </Text>
            
            <Input
              label="Clé publique"
              value={publicKey}
              onChangeText={setPublicKey}
              placeholder="Collez la clé publique ici"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Message original"
              value={verifyMessage}
              onChangeText={setVerifyMessage}
              placeholder="Entrez le message original"
              multiline
              numberOfLines={4}
            />

            <Input
              label="Signature"
              value={verifySignature}
              onChangeText={setVerifySignature}
              placeholder="Collez la signature à vérifier"
              multiline
              numberOfLines={3}
            />

            <Button
              title="Vérifier la signature"
              onPress={handleVerify}
              loading={loading}
              disabled={loading}
              icon="checkmark-circle"
            />

            {verifyResult !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.sectionTitle}>Résultat de la vérification</Text>
                <View style={[
                  styles.resultBox,
                  { backgroundColor: verifyResult ? Colors.success + '20' : Colors.error + '20' }
                ]}>
                  <View style={styles.verifyResult}>
                    <Ionicons 
                      name={verifyResult ? 'checkmark-circle' : 'close-circle'} 
                      size={32} 
                      color={verifyResult ? Colors.success : Colors.error} 
                    />
                    <Text style={[
                      styles.verifyResultText,
                      { color: verifyResult ? Colors.success : Colors.error }
                    ]}>
                      {verifyResult ? 'Signature VALIDE' : 'Signature INVALIDE'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? Colors.quantum[600] : Colors.gray[400]} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  tabsContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingHorizontal: 16
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray[100]
  },
  activeTab: {
    backgroundColor: Colors.quantum[100]
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[600],
    marginLeft: 6
  },
  activeTabText: {
    color: Colors.quantum[600]
  },
  content: {
    flex: 1
  },
  tabContent: {
    padding: 20
  },
  tabDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12
  },
  keySizeContainer: {
    marginBottom: 24
  },
  keySizeButtons: {
    flexDirection: 'row',
    gap: 12
  },
  keySizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray[200]
  },
  selectedKeySize: {
    backgroundColor: Colors.quantum[100],
    borderColor: Colors.quantum[600]
  },
  keySizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary
  },
  selectedKeySizeText: {
    color: Colors.quantum[600]
  },
  generatedKeys: {
    marginTop: 24
  },
  keySection: {
    marginBottom: 16
  },
  keyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8
  },
  keyContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200]
  },
  keyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace'
  },
  metricsContainer: {
    backgroundColor: Colors.quantum[50],
    borderRadius: 8,
    padding: 16,
    marginTop: 16
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.quantum[700],
    marginBottom: 8
  },
  metricsText: {
    fontSize: 12,
    color: Colors.quantum[600],
    marginBottom: 4
  },
  resultContainer: {
    marginTop: 24
  },
  resultBox: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200]
  },
  resultText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: 20
  },
  verifyResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  verifyResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12
  }
});

export default CryptoScreen;