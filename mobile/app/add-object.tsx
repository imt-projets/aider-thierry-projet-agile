// pages/scan-object.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Toast from '@/components/Toast';
import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from "@/interfaces/Item/ApiErrors";
import { getItemByInventoryNumber } from '@/services/ScannerService';


export default function ScanObjectScreen() {
  const [lastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [scanError, setScanError] = useState('');
  const {
    scannedItems,
    addScannedCode,
    resetScannedCodes,
    isLoading,
    restartScan,
    removeScannedItem
  } = useScanner();
  const [isPageFocused, setIsPageFocused] = useState(true);
  const [showScanToast, setShowScanToast] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState<any>(null);


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
      setLastScannedItem(itemResponse.data);
      setShowScanToast(true);
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
        enableManualInput={true}
      />
    </View>
  );
}