import React, { useEffect, useRef, useState } from 'react';
import { View, Vibration, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';

interface ScannerCameraProps {
  isActive: boolean;
  frameColor?: string;
  onScan: (code: string, isManual : boolean) => void | Promise<void>;
  resetTrigger?: any;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ isActive, frameColor = '#222', onScan, resetTrigger }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLock = useRef(false);
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);

  useEffect(() => {
    setScanned(false);
    scanLock.current = false;
  }, [resetTrigger]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

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
    await onScan(data, false);
    setTimeout(() => {
      setScanned(false);
      scanLock.current = false;
    }, 2000);
  };

  return (
    <View style={[styles.frame, { borderColor: scanned ? '#4caf50' : frameColor }]}> 
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'] }}
        onBarcodeScanned={scanned || !isActive ? undefined : handleBarCodeScanned}
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