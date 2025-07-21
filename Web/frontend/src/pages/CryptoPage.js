import React, { useState } from 'react';
import { cryptoAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  KeyIcon,
  LockClosedIcon,
  LockOpenIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CryptoPage = () => {
  const [activeTab, setActiveTab] = useState('keygen');
  const [loading, setLoading] = useState(false);
  
  // Key Generation
  const [keyPair, setKeyPair] = useState(null);
  
  // Encryption/Decryption
  const [encData, setEncData] = useState({
    message: '',
    publicKey: '',
    encrypted: '',
    privateKey: '',
    decrypted: ''
  });
  
  // Signature/Verification
  const [sigData, setSigData] = useState({
    message: '',
    privateKey: '',
    signature: '',
    publicKey: '',
    verificationResult: null
  });

  // Performance metrics
  const [performance, setPerformance] = useState(null);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const newKeyPair = await cryptoAPI.generateKeys(2048);
      setKeyPair(newKeyPair);
      toast.success('Paire de clés générée avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la génération des clés');
    } finally {
      setLoading(false);
    }
  };

  const encryptMessage = async () => {
    if (!encData.message || !encData.publicKey) {
      toast.error('Veuillez saisir un message et une clé publique');
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.encrypt(encData.message, encData.publicKey);
      setEncData(prev => ({ ...prev, encrypted: result.encrypted_data }));
      toast.success('Message chiffré avec succès!');
    } catch (error) {
      toast.error('Erreur lors du chiffrement');
    } finally {
      setLoading(false);
    }
  };

  const decryptMessage = async () => {
    if (!encData.encrypted || !encData.privateKey) {
      toast.error('Veuillez saisir des données chiffrées et une clé privée');
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.decrypt(encData.encrypted, encData.privateKey);
      setEncData(prev => ({ ...prev, decrypted: result.decrypted_data }));
      
      if (result.verification_status) {
        toast.success('Message déchiffré avec succès!');
      } else {
        toast.error('Échec du déchiffrement - clé incorrecte?');
      }
    } catch (error) {
      toast.error('Erreur lors du déchiffrement');
    } finally {
      setLoading(false);
    }
  };

  const signMessage = async () => {
    if (!sigData.message || !sigData.privateKey) {
      toast.error('Veuillez saisir un message et une clé privée');
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.sign(sigData.message, sigData.privateKey);
      setSigData(prev => ({ ...prev, signature: result.signature }));
      toast.success('Message signé avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la signature');
    } finally {
      setLoading(false);
    }
  };

  const verifySignature = async () => {
    if (!sigData.message || !sigData.signature || !sigData.publicKey) {
      toast.error('Veuillez saisir le message, la signature et la clé publique');
      return;
    }

    setLoading(true);
    try {
      const result = await cryptoAPI.verify(sigData.message, sigData.signature, sigData.publicKey);
      setSigData(prev => ({ ...prev, verificationResult: result.valid }));
      
      if (result.valid) {
        toast.success('Signature valide!');
      } else {
        toast.error('Signature invalide!');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async () => {
    try {
      const perf = await cryptoAPI.getPerformance();
      setPerformance(perf);
    } catch (error) {
      toast.error('Erreur lors du chargement des métriques');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers!');
  };

  const tabs = [
    { id: 'keygen', label: 'Génération de clés', icon: KeyIcon },
    { id: 'encrypt', label: 'Chiffrement', icon: LockClosedIcon },
    { id: 'sign', label: 'Signature', icon: DocumentTextIcon },
    { id: 'performance', label: 'Performance', icon: CheckCircleIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cryptographie NTRU++</h1>
        <p className="text-gray-600">Interface de test pour la cryptographie post-quantique</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'performance') loadPerformance();
              }}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-quantum-500 text-quantum-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Key Generation Tab */}
        {activeTab === 'keygen' && (
          <div className="space-y-6">
            <div className="text-center">
              <KeyIcon className="h-16 w-16 text-quantum-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Génération de Paires de Clés NTRU++
              </h3>
              <p className="text-gray-600 mb-6">
                Générez des clés publiques et privées résistantes aux ordinateurs quantiques
              </p>
              
              <button
                onClick={generateKeys}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Génération...
                  </>
                ) : (
                  'Générer une nouvelle paire de clés'
                )}
              </button>
            </div>

            {keyPair && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Clé Publique</h4>
                    <button
                      onClick={() => copyToClipboard(keyPair.public_key)}
                      className="text-sm text-quantum-600 hover:text-quantum-700"
                    >
                      Copier
                    </button>
                  </div>
                  <div className="crypto-display">
                    {keyPair.public_key}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Clé Privée</h4>
                    <button
                      onClick={() => copyToClipboard(keyPair.private_key)}
                      className="text-sm text-quantum-600 hover:text-quantum-700"
                    >
                      Copier
                    </button>
                  </div>
                  <div className="crypto-display">
                    {keyPair.private_key}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Important:</strong> Conservez votre clé privée en sécurité. 
                    Elle ne peut pas être récupérée si elle est perdue.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Encryption/Decryption Tab */}
        {activeTab === 'encrypt' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Encryption */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  Chiffrement
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message à chiffrer
                    </label>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Tapez votre message secret ici..."
                      value={encData.message}
                      onChange={(e) => setEncData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clé publique
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="4"
                      placeholder="Collez la clé publique ici..."
                      value={encData.publicKey}
                      onChange={(e) => setEncData(prev => ({ ...prev, publicKey: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={encryptMessage}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Chiffrer le message'}
                  </button>

                  {encData.encrypted && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Message chiffré
                        </label>
                        <button
                          onClick={() => copyToClipboard(encData.encrypted)}
                          className="text-sm text-quantum-600"
                        >
                          Copier
                        </button>
                      </div>
                      <div className="crypto-display">
                        {encData.encrypted}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decryption */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LockOpenIcon className="h-5 w-5 mr-2" />
                  Déchiffrement
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données chiffrées
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="4"
                      placeholder="Collez les données chiffrées ici..."
                      value={encData.encrypted}
                      onChange={(e) => setEncData(prev => ({ ...prev, encrypted: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clé privée
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="4"
                      placeholder="Collez la clé privée ici..."
                      value={encData.privateKey}
                      onChange={(e) => setEncData(prev => ({ ...prev, privateKey: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={decryptMessage}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Déchiffrer le message'}
                  </button>

                  {encData.decrypted && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message déchiffré
                      </label>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800">{encData.decrypted}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signature Tab */}
        {activeTab === 'sign' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Signing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Signature Numérique
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message à signer
                    </label>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Tapez le message à signer..."
                      value={sigData.message}
                      onChange={(e) => setSigData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clé privée
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="4"
                      placeholder="Collez la clé privée ici..."
                      value={sigData.privateKey}
                      onChange={(e) => setSigData(prev => ({ ...prev, privateKey: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={signMessage}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Signer le message'}
                  </button>

                  {sigData.signature && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Signature
                        </label>
                        <button
                          onClick={() => copyToClipboard(sigData.signature)}
                          className="text-sm text-quantum-600"
                        >
                          Copier
                        </button>
                      </div>
                      <div className="crypto-display">
                        {sigData.signature}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Vérification de Signature
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message original
                    </label>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Tapez le message original..."
                      value={sigData.message}
                      onChange={(e) => setSigData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Signature à vérifier
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="3"
                      placeholder="Collez la signature ici..."
                      value={sigData.signature}
                      onChange={(e) => setSigData(prev => ({ ...prev, signature: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clé publique
                    </label>
                    <textarea
                      className="input-field font-mono text-xs"
                      rows="3"
                      placeholder="Collez la clé publique ici..."
                      value={sigData.publicKey}
                      onChange={(e) => setSigData(prev => ({ ...prev, publicKey: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={verifySignature}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Vérifier la signature'}
                  </button>

                  {sigData.verificationResult !== null && (
                    <div className={`p-4 rounded-lg border ${
                      sigData.verificationResult 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center">
                        {sigData.verificationResult ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-medium">Signature valide ✓</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-red-800 font-medium">Signature invalide ✗</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Métriques de Performance NTRU++
            </h3>
            
            {performance ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-quantum-50 p-4 rounded-lg">
                  <div className="text-sm text-quantum-600 mb-1">Algorithme</div>
                  <div className="text-lg font-semibold">{performance.algorithm}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Taille de clé</div>
                  <div className="text-lg font-semibold">{performance.key_size} bits</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Vitesse chiffrement</div>
                  <div className="text-lg font-semibold">{performance.encryption_speed}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 mb-1">Vitesse déchiffrement</div>
                  <div className="text-lg font-semibold">{performance.decryption_speed}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">Vitesse signature</div>
                  <div className="text-lg font-semibold">{performance.signature_speed}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 mb-1">Résistance quantique</div>
                  <div className="text-lg font-semibold">{performance.quantum_resistance}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <LoadingSpinner size="lg" text="Chargement des métriques..." />
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">À propos de NTRU++</h4>
              <p className="text-sm text-blue-800">
                NTRU++ est un algorithme de cryptographie post-quantique basé sur les réseaux euclidiens. 
                Il offre une sécurité prouvée contre les attaques d'ordinateurs quantiques tout en 
                maintenant des performances élevées pour les applications IoT.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoPage;