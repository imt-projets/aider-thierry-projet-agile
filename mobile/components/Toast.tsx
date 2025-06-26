import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ToastProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  duration?: number; // en ms
  actionLabel?: string;
  onAction?: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ visible, message, onClose, duration = 4000, actionLabel, onAction, type = 'error' }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const containerStyle = [
    styles.toastContainer,
    type === 'success' ? styles.toastSuccess : styles.toastError
  ];
  const actionTextStyle = [
    styles.actionText,
    type === 'success' ? { color: '#388e3c' } : { color: '#F44336' }
  ];

  return (
    <View style={containerStyle}>
      <Text style={styles.toastText}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
          <Text style={actionTextStyle}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Entypo name="cross" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 70,
  },
  toastText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  closeBtn: {
    marginLeft: 16,
    padding: 4,
  },
  actionBtn: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 15,
  },
  toastSuccess: {
    backgroundColor: '#4CAF50',
  },
  toastError: {
    backgroundColor: '#F44336',
  },
});

export default Toast; 