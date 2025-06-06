import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { StyleSheet, Text, View, Vibration, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { useScanner } from '@/context/ScannerContext';

const useCameraAccess = () => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert(
          "Accès caméra refusé",
          "Vous avez refusé l'accès à la caméra. Veuillez l'autoriser manuellement dans les paramètres de l'application.",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Ouvrir les paramètres", onPress: () => Linking.openSettings() },
          ]
        );
      }
    }
  }, [permission]);

  return permission?.granted ?? false;
};



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
  const hasPermission = useCameraAccess();
  const scanLock = useRef(false);
  const scannerSound = require('../assets/scanner-sound.mp3');
  const player = useAudioPlayer(scannerSound);
  const {mode,scanned, setScanned} = useScanner();

  useEffect(() => {
    setScanned(false);
    scanLock.current = false;
  }, [resetTrigger]);

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (scanLock.current) return;

    scanLock.current = true;
    setScanned(true);
    Vibration.vibrate(200);

    try {
      await player.seekTo(0);
      player.play();
    } catch (e) {
      console.warn("Erreur de lecture audio :", e);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onScan(data);

    if (scanMode === 'multiple') {
      setTimeout(() => {
        setScanned(false);
        scanLock.current = false;
      }, 2000);
    }
  }, [onScan, player, scanMode]);
  

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vous devez autoriser l'accès à la caméra pour continuer</Text>
      </View>
    );
  }

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

      {step === 'object' && mode === 'inventoryRoom' && typeof scannedCount === 'number' && (
        <Text style={styles.counter}>Nombre d'objets scannés : {scannedCount}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 10 },
  title: { fontSize: 27, fontWeight: 'bold', textAlign: 'center', width: 341 },
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
