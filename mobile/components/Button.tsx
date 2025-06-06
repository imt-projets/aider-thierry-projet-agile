import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'danger' | 'outline' | 'success';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, type = 'primary', style, textStyle, icon }) => {
  const baseStyle = [styles.button, styles[type], style];
  const textBaseStyle = [styles.text, styles[`${type}Text`], textStyle];

  return (
    <TouchableOpacity style={baseStyle} onPress={onPress}>
      {icon && (
        <View style={{ marginRight: 12, marginLeft: 15, justifyContent: 'center' }}>
          {icon}
        </View>
      )}
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={textBaseStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display : 'flex',
    flexDirection : 'row',
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom : 20,
    height : 83,
    width : 318,
    marginTop : 0,
    marginRight : 'auto',
    marginLeft : 'auto',
    justifyContent : 'center',
    // Ombre iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Ombre Android
    elevation: 6,
  },
  primary: { backgroundColor: '#1976D2' },
  danger: { backgroundColor: '#F44336' },
  success : {
    backgroundColor: '#009B12',
  },
  outline: {
    backgroundColor: '#fff',
    borderColor: '#222',
  },
  text: { fontSize: 22, fontWeight: 'bold' },
  primaryText: { color: '#fff' },
  dangerText: { color: '#fff' },
  outlineText: { color: '#222' },
  successText : {
    color : 'white'
  }
});

export default Button;
