import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors, GradientColors } from '../constants/colors';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Inscription réussie',
          text2: 'Bienvenue sur QuantumShield! 50 QS offerts!'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur d\'inscription',
          text2: result.error || 'Une erreur s\'est produite lors de l\'inscription'
        });
      }
    } catch (error) {
      console.error('Register error:', error);
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
            <Ionicons name="person-add" size={48} color={Colors.surface} />
            <Text style={styles.headerTitle}>Inscription</Text>
            <Text style={styles.headerSubtitle}>
              Créez votre compte QuantumShield gratuitement
            </Text>
          </LinearGradient>

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>🎉 Bonus d'inscription</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="diamond" size={20} color={Colors.warning} />
                <Text style={styles.benefitText}>50 QS offerts à l'inscription</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="gift" size={20} color={Colors.success} />
                <Text style={styles.benefitText}>5 QS bonus première connexion</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="add-circle" size={20} color={Colors.quantum[600]} />
                <Text style={styles.benefitText}>10 QS par dispositif enregistré</Text>
              </View>
            </View>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            <Input
              label="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder="Choisissez un nom d'utilisateur"
              icon="person-outline"
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="votre@email.com"
              icon="mail-outline"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Choisissez un mot de passe sécurisé"
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirmez votre mot de passe"
              icon="checkmark-circle-outline"
              secureTextEntry
              error={errors.confirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              title="Créer mon compte"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Déjà un compte ?{' '}
              </Text>
              <Button
                title="Se connecter"
                onPress={() => navigation.navigate('Login')}
                variant="ghost"
                size="small"
              />
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.securityContainer}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
              <Text style={styles.securityTitle}>Sécurité Garantie</Text>
            </View>
            <Text style={styles.securityText}>
              Vos données sont protégées par la cryptographie post-quantique NTRU++. 
              Résistance garantie contre les futurs ordinateurs quantiques.
            </Text>
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
    paddingBottom: 24,
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
  benefitsContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    marginTop: -12,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16
  },
  benefitsList: {
    gap: 12
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  securityContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200]
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8
  },
  securityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20
  }
});

export default RegisterScreen;