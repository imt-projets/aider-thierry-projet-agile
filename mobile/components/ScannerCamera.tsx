import React, { useEffect, useRef, useState } from 'react';
import { View, Vibration, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from '@/interfaces/Item/ApiErrors';
import { ROOM_NOT_FOUND_MESSAGE, ITEM_NOT_FOUND_MESSAGE } from '@/constants/Messages/Errors/ScanErrors';
import { scannerContext } from '@/context/ScannerContext';

interface ScannerCameraProps {
  isActive: boolean;
  frameColor?: string;
  onScan: (code: string, isManual : boolean) => void | Promise<void>;
  resetTrigger?: any;
  step: 'object' | 'salle';
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ isActive, frameColor = '#222', onScan, resetTrigger, step }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedError, setScannedError] = useState(false);
  const scanLock = useRef(false);
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);
  const { setError } = scannerContext();

  useEffect(() => {
    setScanned(false);
    setScannedError(false);
    scanLock.current = false;
  }, [resetTrigger]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const getBorderColor = () => {
    if (scannedError) return '#f44336';
    if (scanned) return '#4caf50';
    return frameColor;
  };

  const handleError = (error: any) => {
    let errorMessage = '';
    if (error instanceof ApiNotFoundError) {
      errorMessage = step === 'object' ? ITEM_NOT_FOUND_MESSAGE : ROOM_NOT_FOUND_MESSAGE;
    } else if (error instanceof ApiServerError || error instanceof ApiTimeoutError) {
      errorMessage = error.message;
    }
    setError(errorMessage);
    setScanned(false);
    setScannedError(true);
    setTimeout(() => {
      setScannedError(false);
      scanLock.current = false;
    }, 1000);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanned(true);
    Vibration.vibrate(200);
    
    try {
      await player.seekTo(0);
      player.play();
    } catch (e) {
      console.warn('Impossible de (re)jouer le son :', e);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await onScan(data, false);
      setTimeout(() => {
        setScanned(false);
        scanLock.current = false;
      }, 1000);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={[styles.frame, { borderColor: getBorderColor() }]}> 
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'] }}
        onBarcodeScanned={scanned || scannedError || !isActive ? undefined : handleBarCodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ScannerCamera; 