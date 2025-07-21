import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GradientColors } from '../constants/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left', // left, right
  color = 'quantum',
  style = {},
  textStyle = {}
}) => {
  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    } else {
      switch (variant) {
        case 'secondary':
          baseStyle.push([styles.secondaryButton, { backgroundColor: Colors.gray[100] }]);
          break;
        case 'outline':
          baseStyle.push([styles.outlineButton, { 
            borderColor: Colors[color] ? Colors[color][600] : Colors.quantum[600] 
          }]);
          break;
        case 'ghost':
          baseStyle.push(styles.ghostButton);
          break;
        default:
          // Primary will use gradient
          break;
      }
    }
    
    return [...baseStyle, style];
  };

  const getTextStyles = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    } else {
      switch (variant) {
        case 'secondary':
          baseStyle.push({ color: Colors.textPrimary });
          break;
        case 'outline':
          baseStyle.push({ color: Colors[color] ? Colors[color][600] : Colors.quantum[600] });
          break;
        case 'ghost':
          baseStyle.push({ color: Colors[color] ? Colors[color][600] : Colors.quantum[600] });
          break;
        default:
          baseStyle.push({ color: Colors.surface });
          break;
      }
    }
    
    return [...baseStyle, textStyle];
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Colors.surface : Colors.quantum[600]} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={getTextStyles()[0].color}
              style={styles.leftIcon} 
            />
          )}
          <Text style={getTextStyles()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={getTextStyles()[0].color}
              style={styles.rightIcon} 
            />
          )}
        </>
      )}
    </View>
  );

  if (variant === 'primary' && !disabled && !loading) {
    const gradientColors = GradientColors[color] || GradientColors.quantum;
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient colors={gradientColors} style={getButtonStyles()}>
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={getButtonStyles()} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Size variants
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44
  },
  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
    fontWeight: '600'
  },
  mediumText: {
    fontSize: 16,
    fontWeight: '600'
  },
  largeText: {
    fontSize: 18,
    fontWeight: '600'
  },
  
  // Variant styles
  secondaryButton: {
    backgroundColor: Colors.gray[100]
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1
  },
  ghostButton: {
    backgroundColor: 'transparent'
  },
  
  // State styles
  disabledButton: {
    backgroundColor: Colors.gray[200],
    borderColor: Colors.gray[200]
  },
  disabledText: {
    color: Colors.gray[400]
  },
  
  // Icon styles
  leftIcon: {
    marginRight: 8
  },
  rightIcon: {
    marginLeft: 8
  },
  
  text: {
    textAlign: 'center'
  }
});

export default Button;