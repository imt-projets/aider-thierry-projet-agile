// pages/scan-object.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { router } from 'expo-router';

export default function ScanObjectScreen() {
  const [lastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    scannedItems,
    addScannedCode,
    isScannerActive,
    resetScannedCodes,
    setIsScannerActive,
    isLoading
  } = useScanner();

  useEffect(() => {
    setIsScannerActive(true);
    return () => {
      setIsScannerActive(false);
    };
  }, []);

  const handleScan = (code: string) => {
    addScannedCode(code);
  };

  const handleAnnuler = () => {
    resetScannedCodes();
    setResetTrigger(prev => prev + 1);
  };

  const handleAdd = () => {
    setIsScannerActive(false);
    router.push('/recap-inventory');
  };

  const isObjectScanned = scannedItems.length > 0;

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />
      <Scanner
        message={isObjectScanned ? "Code barre de l'objet récupéré" : "Veuillez scanner le code barre de l'objet à ajouter"}
        messageColor={isObjectScanned ? '#4caf50' : '#222'}
        frameColor={lastScanned ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="single"
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="object"
        onCancel={handleAnnuler}
        onAdd={handleAdd}
        isLoading={isLoading}
        scanned={isObjectScanned}
      />
    </View>
  );
}