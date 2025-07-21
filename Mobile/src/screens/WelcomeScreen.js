import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import { Colors, GradientColors } from '../constants/colors';
import { APP_CONFIG } from '../constants/config';

const WelcomeScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Cryptographie NTRU++',
      description: 'Résistant aux ordinateurs quantiques avec des clés 2048-bit optimisées.'
    },
    {
      icon: 'hardware-chip',
      title: 'Gestion IoT Sécurisée', 
      description: 'Enregistrement et monitoring de dispositifs avec chiffrement post-quantique.'
    },
    {
      icon: 'diamond',
      title: 'Système de Tokens QS',
      description: 'Récompenses pour la participation au réseau et la sécurité collaborative.'
    },
    {
      icon: 'stats-chart',
      title: 'Dashboard Temps Réel',
      description: 'Monitoring et analytics de vos dispositifs et transactions.'
    }
  ];

  const stats = [
    { label: 'Types d\'appareils', value: '3' },
    { label: 'Algorithmes crypto', value: '1' },
    { label: 'Sécurité', value: '100%' },
    { label: 'Coût MVP', value: '0€' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.quantum[600]} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={GradientColors.quantum} style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={64} color={Colors.surface} />
            <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
            <Text style={styles.appPhase}>{APP_CONFIG.PHASE}</Text>
          </View>
          
          <Text style={styles.heroDescription}>
            Sécurisez vos dispositifs IoT avec la cryptographie post-quantique. 
            Protégez-vous contre les futurs ordinateurs quantiques dès aujourd'hui.
          </Text>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Fonctionnalités Phase 1</Text>
          <Text style={styles.sectionDescription}>
            Un MVP fonctionnel avec les fonctionnalités core de QuantumShield, 
            déployable gratuitement pour commencer votre voyage dans la sécurité post-quantique.
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons 
                    name={feature.icon} 
                    size={32} 
                    color={Colors.quantum[600]} 
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Prêt à Sécuriser votre IoT ?
          </Text>
          <Text style={styles.ctaDescription}>
            Rejoignez QuantumShield dès maintenant et protégez vos dispositifs gratuitement.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Commencer Gratuitement"
              onPress={() => navigation.navigate('Register')}
              size="large"
              style={styles.primaryButton}
            />
            <Button
              title="Se Connecter"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
              size="large"
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
    marginTop: 16
  },
  appPhase: {
    fontSize: 16,
    color: Colors.quantum[100],
    marginTop: 4
  },
  heroDescription: {
    fontSize: 18,
    color: Colors.quantum[100],
    textAlign: 'center',
    lineHeight: 24
  },
  statsSection: {
    backgroundColor: Colors.surface,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200]
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24
  },
  statItem: {
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
    color: Colors.textSecondary,
    textAlign: 'center'
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12
  },
  sectionDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32
  },
  featuresGrid: {
    gap: 20
  },
  featureCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.quantum[100],
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20
  },
  ctaSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200]
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12
  },
  ctaDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32
  },
  buttonContainer: {
    width: '100%',
    gap: 16
  },
  primaryButton: {
    width: '100%'
  },
  secondaryButton: {
    width: '100%'
  }
});

export default WelcomeScreen;