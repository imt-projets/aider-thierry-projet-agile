import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';


interface ScannerProps {
  message: string;
  messageColor?: string;
  frameColor?: string;
  onScan: (code: string) => void;
  scanMode?: 'single' | 'multiple';
  scannedCount?: number;
  resetTrigger?: any;
  isActive: boolean;
  step: 'salle' | 'object';
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
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLock = useRef(false); // Ajout du verrou
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);

  useEffect(() => {
    setScanned(false);
    scanLock.current = false; // Réinitialise le verrou lors du reset
  }, [resetTrigger]);

  useEffect(() => {
      if(!permission?.granted) {
          requestPermission();
      }
  }, [])

 const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanLock.current) return; // Bloque immédiatement les scans suivants
    scanLock.current = true;
    setScanned(true);
    Vibration.vibrate(200);

    try {
      // Avant chaque play, on replace la tête au début
      await player.seekTo(0);
      player.play();
    } catch (e) {
      console.warn("Impossible de (re)jouer le son :", e);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onScan(data);

    if (scanMode === 'multiple') {
      setTimeout(() => {
        setScanned(false);
        scanLock.current = false; // Déverrouille après le délai
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: messageColor }]}>{message}</Text>
      <View style={[styles.frame, { borderColor: scanned ? '#4caf50' : frameColor }]}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'] }}
          onBarcodeScanned={scanned || !isActive ? undefined : handleBarCodeScanned}
        />
      </View>
      {step === 'object' && typeof scannedCount === 'number' && (
        <Text style={styles.counter}>Nombre d'objets scannés : {scannedCount}</Text>
      )}
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
});

export default Scanner;
