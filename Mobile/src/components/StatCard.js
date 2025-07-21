import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GradientColors } from '../constants/colors';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'quantum', 
  onPress, 
  style = {} 
}) => {
  const gradientColors = GradientColors[color] || GradientColors.quantum;
  const iconColor = Colors[color] ? Colors[color][600] : Colors.quantum[600];

  const CardContent = (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={[Colors.surface, Colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[color]?.[100] || Colors.quantum[100] }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: Colors.surface,
    overflow: 'hidden'
  },
  gradient: {
    padding: 16,
    minHeight: 120
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted
  }
});

export default StatCard;