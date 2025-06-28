import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

interface ScannerManualInputProps {
  visible: boolean;
  code: string;
  setCode: (text: string) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
  onClose: () => void;
  step : 'salle' | 'object'
}

const ScannerManualInput: React.FC<ScannerManualInputProps> = ({
  visible,
  code,
  setCode,
  loading,
  error,
  onSubmit,
  onClose,
  step
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, textAlign : 'center' }}>Veuillez saisir le code barre de {step === 'object' ? 'l\'objet' : 'la salle'}</Text>
          {error && code === '' ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Entrer le code"
            style={styles.input}
            autoFocus
            editable={!loading}
          />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} disabled={loading}>
              <Text style={{ color: '#fff' }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit} style={code !== '' ? styles.okBtn : styles.okBtnDisabled} disabled={loading}>
            <Text style={{color : '#fff' }}>Confirmer</Text>
            </TouchableOpacity>
          </View>
          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    fontSize: 18,
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  okBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  okBtnDisabled: {
    backgroundColor : 'gray',
    padding: 12,
    borderRadius: 8,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 10,
  },
});

export default ScannerManualInput; 