// pages/scan-objects.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import { scannerContext } from '@/context/ScannerContext';
import { useFocusEffect } from '@react-navigation/native';
import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from "@/interfaces/Item/ApiErrors";
import { getItemByInventoryNumber } from '@/services/ScannerService';

export default function ScanObjectsScreen() {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [scanError, setScanError] = useState('');
  const {
    scannedItems,
    addScannedCode,
    isLoading,
    removeScannedItem
  } = useScanner();
  const router = useRouter();
  const { restartScan } = scannerContext();
  const [isPageFocused, setIsPageFocused] = useState(true);
  const [showScanToast, setShowScanToast] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState<any>(null);

  useEffect(() => {
    if (scannedItems.length > 0) setScanError('');
  }, [scannedItems.length]);

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showScanToast) {
      timer = setTimeout(() => setShowScanToast(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showScanToast]);

  useEffect(() => {
    if (!isPageFocused) setShowScanToast(false);
  }, [isPageFocused]);

  const handleScan = async (code: string) => {
    setScanError('');
    try {
      const itemResponse = await getItemByInventoryNumber(code);
      addScannedCode(itemResponse.data);
      setLastScanned(code);
      setLastScannedItem(itemResponse.data);
      setShowScanToast(true);
      setTimeout(() => setLastScanned(null), 2000);
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        setScanError('Salle inexistante ou code invalide');
      } else if (error instanceof ApiServerError) {
        setScanError('Une erreur est survenue');
      } else if (error instanceof ApiTimeoutError) {
        setScanError('Le serveur met trop de temps à répondre');
      }
    }
  };

  const handleFinish = () => {
    router.push('/recap-inventory');
  };

  const handleCancel = () => {
    restartScan();
    router.back();
  };

  const handleHome = () => {
    restartScan();
    router.push('/');
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={handleHome} />
      <Toast visible={!!scanError} message={scanError} onClose={() => setScanError('')} />
      <Toast
        visible={showScanToast}
        message={lastScannedItem ? `Objet scanné : ${lastScannedItem.name || lastScannedItem.inventoryNumber}` : 'Objet scanné'}
        onClose={() => setShowScanToast(false)}
        duration={5000}
        actionLabel="Annuler"
        onAction={() => {
          if (lastScannedItem) removeScannedItem(lastScannedItem.inventoryNumber);
          setShowScanToast(false);
        }}
        type="success"
      />
      <Scanner
        message="Veuillez scanner les objets de la salle"
        messageColor="#222"
        frameColor={lastScanned ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="multiple"
        scannedCount={scannedItems.length}
        resetTrigger={resetTrigger}
        isActive={isPageFocused}
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