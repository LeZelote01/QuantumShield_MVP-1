import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors, GradientColors } from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Connexion réussie',
          text2: 'Bienvenue sur QuantumShield!'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur de connexion',
          text2: result.error || 'Identifiants incorrects'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Une erreur inattendue s\'est produite'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <LinearGradient colors={GradientColors.quantum} style={styles.header}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.surface} />
            <Text style={styles.headerTitle}>Connexion</Text>
            <Text style={styles.headerSubtitle}>
              Accédez à votre compte QuantumShield
            </Text>
          </LinearGradient>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Input
              label="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder="Entrez votre nom d'utilisateur"
              icon="person-outline"
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Entrez votre mot de passe"
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              title="Se Connecter"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Pas encore de compte ?{' '}
              </Text>
              <Button
                title="Créer un compte"
                onPress={() => navigation.navigate('Register')}
                variant="ghost"
                size="small"
              />
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Pourquoi QuantumShield ?</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
                <Text style={styles.featureText}>
                  Sécurité post-quantique
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="hardware-chip" size={24} color={Colors.quantum[600]} />
                <Text style={styles.featureText}>
                  Gestion IoT simplifiée
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="diamond" size={24} color={Colors.warning} />
                <Text style={styles.featureText}>
                  Récompenses en tokens QS
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  keyboardContainer: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.surface,
    marginTop: 16,
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.quantum[100],
    textAlign: 'center'
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerText: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  featuresContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200]
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20
  },
  featuresList: {
    gap: 16
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  featureText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 12
  }
});

export default LoginScreen;