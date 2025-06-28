import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { scannerContext } from '@/context/ScannerContext';
import useScanner from '@/hooks/useScanner';

interface ModalConfirmationProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  title: string;
  message: string;
  isImportant : boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  modalVisible,
  setModalVisible,
  title,
  message,
  isImportant,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
}) => {
  const handleModalClosed = (confirmed: boolean) => {
    setModalVisible(false);
    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <Modal visible={modalVisible} transparent  onRequestClose={() => setModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.subtitle, isImportant && styles.subtitleImportant]}>{message}</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.noButton} onPress={() => handleModalClosed(false)}>
              <Text style={styles.noText}>{cancelText}</Text>
            </Pressable>
            <Pressable style={styles.yesButton} onPress={() => handleModalClosed(true)}>
              <Text style={styles.yesText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 350,
    maxHeight: 500,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  subtitleImportant : {
    color : 'red'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 10,
    padding: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    padding: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  noText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  yesText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ModalConfirmation;
