// pages/scan-objects.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { layout } from '@/styles/common';
import { useRouter } from 'expo-router';

export default function ScanObjectsScreen() {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    scannedItems,
    addScannedCode,
    isScannerActive,
    setIsScannerActive
  } = useScanner();
  const router = useRouter();

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
    // Logique d'annulation si nécessaire
    router.back();
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />

      <Scanner
        message="Veuillez scanner les objets de la salle"
        messageColor="#222"
        frameColor={lastScanned ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="multiple"
        scannedCount={scannedItems.length}
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="object"
      />

      <Footer
        isScanned={false}
        onCancel={handleCancel}
        onFinish={handleFinish}
        finishText="Terminer"
        showBackButton={true}
        onBack={() => router.back()}
      />
    </View>
  );
}