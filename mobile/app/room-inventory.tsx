// pages/scan-objects.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { useRouter } from 'expo-router';
import useManualInput from '@/hooks/useManualInput';

export default function ScanObjectsScreen() {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    scannedItems,
    addScannedCode,
    isScannerActive,
    setIsScannerActive,
    isLoading
  } = useScanner();
  const router = useRouter();

  const manualInput = useManualInput(addScannedCode);

  useEffect(() => {
    setIsScannerActive(true);
    return () => {
      setIsScannerActive(false);
    };
  }, []);

  const handleScan = (code: string) => {
    addScannedCode(code);
    setLastScanned(code);
    setTimeout(() => setLastScanned(null), 2000);
  };

  const handleFinish = () => {
    setIsScannerActive(false);
    router.push('/recap-inventory');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />
      <Scanner
        message="Veuillez scanner les objets de la salle"
        messageColor="#222"
        frameColor={lastScanned ? '#4caf50' : '#222'}
        onScan={addScannedCode}
        scanMode="multiple"
        scannedCount={scannedItems.length}
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="object"
        onCancel={handleCancel}
        onFinish={handleFinish}
        isLoading={isLoading}
        scanned={scannedItems.length > 0}
        enableManualInput={true}
      />
    </View>
  );
}