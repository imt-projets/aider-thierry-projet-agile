import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

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

  useEffect(() => {
    setScanned(false);
    if (!permission?.granted) {
        requestPermission();
      }
  }, [resetTrigger]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      Vibration.vibrate(200);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onScan(data);

      if (scanMode === 'multiple') {
        setTimeout(() => setScanned(false), 1000);
      }
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
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginTop: 16,  
  },
  camera: { flex: 1 },
  counter: { fontSize: 16, fontWeight: '500', color: '#222' },
});

export default Scanner;
