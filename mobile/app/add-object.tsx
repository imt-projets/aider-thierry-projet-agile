// pages/scan-object.tsx
import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ScanObjectScreen() {
  const [lastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    scannedItems,
    addScannedCode,
    resetScannedCodes,
    isLoading,
    restartScan
  } = useScanner();
  const [isPageFocused, setIsPageFocused] = useState(true);


  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleScan = (code: string) => {
    addScannedCode(code);
  };

  const handleAnnuler = () => {
    restartScan();
    router.back();
  };

  const handleAdd = () => {
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
        isActive={isPageFocused}
        step="object"
        onCancel={handleAnnuler}
        onAdd={handleAdd}
        isLoading={isLoading}
        scanned={isObjectScanned}
      />
    </View>
  );
}