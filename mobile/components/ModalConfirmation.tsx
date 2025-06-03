import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useScanner } from '@/context/ScannerContext';

interface ModalConfirmationProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setIsScannerActive: (active: boolean) => void;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({ modalVisible, setModalVisible, setIsScannerActive }) => {
  const { scannedCodes, restartScan, handleSendInventory } = useScanner();
  const router = useRouter();

  const handleModalClosed = (confirmed: boolean) => {
    setModalVisible(false);
    setIsScannerActive(!confirmed);
    if (confirmed) {
      handleSendInventory();
      router.push('/');
    }
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Avez-vous terminé l'inventaire de la salle ?</Text>
          <Text style={styles.text}>Nombre d'objets scannés : {scannedCodes.length}</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.noButton} onPress={() => handleModalClosed(false)}>
              <Text style={styles.noText}>Non</Text>
            </Pressable>
            <Pressable style={styles.yesButton} onPress={() => handleModalClosed(true)}>
              <Text style={styles.yesText}>Oui</Text>
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
    width: 300,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
