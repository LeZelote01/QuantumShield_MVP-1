import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DevicesScreen from '../screens/DevicesScreen';
import CryptoScreen from '../screens/CryptoScreen';
import TokensScreen from '../screens/TokensScreen';
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack - for non-authenticated users
const AuthStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.quantum[600],
        },
        headerTintColor: Colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Connexion' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Inscription' }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator - for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Devices':
              iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
              break;
            case 'Crypto':
              iconName = focused ? 'lock-closed' : 'lock-closed-outline';
              break;
            case 'Tokens':
              iconName = focused ? 'diamond' : 'diamond-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.quantum[600],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.gray[200],
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: Colors.gray[900],
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4
        },
        headerStyle: {
          backgroundColor: Colors.surface,
          elevation: 2,
          shadowColor: Colors.gray[900],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18
        }
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Tableau de Bord' }}
      />
      <Tab.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{ title: 'Dispositifs' }}
      />
      <Tab.Screen 
        name="Crypto" 
        component={CryptoScreen}
        options={{ title: 'Cryptographie' }}
      />
      <Tab.Screen 
        name="Tokens" 
        component={TokensScreen}
        options={{ title: 'Tokens QS' }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Chargement de QuantumShield..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;