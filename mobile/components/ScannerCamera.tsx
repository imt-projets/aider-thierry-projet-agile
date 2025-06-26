import React, { useEffect, useRef, useState } from 'react';
import { View, Vibration, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [scannedError, setScannedError] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const scanLock = useRef(false);
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);
  const { setError } = scannerContext();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setScannedError(false);
    setScannedSuccess(false);
    scanLock.current = false;
  }, [resetTrigger]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const getBorderColor = () => {
    if (scannedError) return '#f44336';
    if (scannedSuccess) return '#4caf50';
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
    setScannedSuccess(false);
    setScannedError(true);
    setTimeout(() => {
      setScannedError(false);
      scanLock.current = false;
    }, 4000);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    Vibration.vibrate(200);
    
    try {
      await player.seekTo(0);
      player.play();
    } catch (e) {
      console.warn('Impossible de (re)jouer le son :', e);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setIsProcessing(true);
    try {
      await onScan(data, false);
      setScannedSuccess(true);
      setTimeout(() => {
        setScannedSuccess(false);
        scanLock.current = false;
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.frame, { borderColor: getBorderColor() }]}> 
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'] }}
        onBarcodeScanned={scannedError || scannedSuccess || !isActive ? undefined : handleBarCodeScanned}
      />
      {isProcessing && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      )}
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
    spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default ScannerCamera; 