import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  style = {},
  inputStyle = {},
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = error && error.length > 0;
  const showPasswordToggle = secureTextEntry;
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  const getBorderColor = () => {
    if (hasError) return Colors.error;
    if (isFocused) return Colors.quantum[600];
    return Colors.gray[300];
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label,
          hasError && styles.errorLabel,
          disabled && styles.disabledLabel
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { borderColor: getBorderColor() },
        disabled && styles.disabledContainer
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={hasError ? Colors.error : Colors.gray[400]}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            disabled && styles.disabledInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray[400]}
          secureTextEntry={actualSecureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.rightIconContainer}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color={Colors.gray[400]}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={hasError ? Colors.error : Colors.gray[400]}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6
  },
  errorLabel: {
    color: Colors.error
  },
  disabledLabel: {
    color: Colors.gray[400]
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    minHeight: 48
  },
  disabledContainer: {
    backgroundColor: Colors.gray[50],
    borderColor: Colors.gray[200]
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary
  },
  inputWithLeftIcon: {
    paddingLeft: 0
  },
  inputWithRightIcon: {
    paddingRight: 0
  },
  multilineInput: {
    paddingTop: 12,
    textAlignVertical: 'top'
  },
  disabledInput: {
    color: Colors.gray[400]
  },
  leftIcon: {
    marginLeft: 12,
    marginRight: 8
  },
  rightIconContainer: {
    padding: 12
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4
  }
});

export default Input;