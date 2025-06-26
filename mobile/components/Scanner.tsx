import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Vibration, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import ScannerFooter from '@/components/ScannerFooter';
import { layout } from '@/styles/common';
import { Entypo } from '@expo/vector-icons';
import ScannerCamera from './ScannerCamera';
import ScannerManualInput from './ScannerManualInput';
import useManualInput from '@/hooks/useManualInput';
import { scannerContext } from '@/context/ScannerContext';

interface ScannerProps {
  message: string;
  messageColor?: string;
  frameColor?: string;
  onScan: (code: string, isManual : boolean) => void | Promise<void>;
  scanMode?: 'single' | 'multiple';
  scannedCount?: number;
  resetTrigger?: any;
  isActive: boolean;
  step: 'salle' | 'object';
  onGoBack: () => void;
  onContinue?: () => void;
  onAdd?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
  scanned: boolean;
  enableManualInput?: boolean;
}

const Scanner: React.FC<ScannerProps> = ({
  message,
  messageColor = '#222',
  frameColor = '#222',
  onScan,
  scanMode = 'single',
  scannedCount,
  resetTrigger,
  isActive,
  step,
  onGoBack,
  onContinue,
  onAdd,
  onFinish,
  isLoading = false,
  scanned,
  enableManualInput = false
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedState, setScanned] = useState(false);
  const scanLock = useRef(false);
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);

  const manualInput = useManualInput(async (code) => { await onScan(code, true); });
  const { manualError } = scannerContext();

  useEffect(() => {
    setScanned(false);
    scanLock.current = false;
  }, [resetTrigger]);

  useEffect(() => {
      if(!permission?.granted) {
        requestPermission();
      }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: messageColor }]}>{message}</Text>
      <View>
        <ScannerCamera
          isActive = {isActive && !manualInput.show}
          frameColor = {frameColor}
          onScan = {onScan}
          resetTrigger = {resetTrigger}
        />
        {enableManualInput && (
          <TouchableOpacity
            style = {styles.fab}
            onPress = {manualInput.open}
            activeOpacity = {0.7}
          >
            <Entypo name="pencil" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {step === 'object' && typeof scannedCount === 'number' && (
        <Text style={styles.counter}>Nombre d'objets scannés : {scannedCount}</Text>
      )}
      <View style={layout.footer}>
        <ScannerFooter
          scanned={scanned}
          scanMode={scanMode}
          onGoBack={onGoBack}
          onContinue={onContinue}
          onAdd={onAdd}
          onFinish={onFinish}
          isLoading={isLoading}
        />
      </View>
      <ScannerManualInput
        visible={enableManualInput && manualInput.show}
        code={manualInput.code}
        setCode={manualInput.setCode}
        loading={manualInput.loading}
        error={manualError ?? ''}
        onSubmit={manualInput.submit}
        onClose={manualInput.close}
        step = {step}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop : 10 },
  title: { fontSize: 27, fontWeight: 'bold', textAlign: 'center', width : 341 },
  frame: {
    width: 335,
    height: 339,
    borderWidth: 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginTop: 16,  
  },
  camera: { flex: 1 },
  counter: { fontSize: 16, fontWeight: '500', color: '#222' },
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#1976D2',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
});

export default Scanner;
