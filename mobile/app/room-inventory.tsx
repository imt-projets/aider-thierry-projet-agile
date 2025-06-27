// pages/scan-objects.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import { scannerContext } from '@/context/ScannerContext';
import { useFocusEffect } from '@react-navigation/native';
import { getItemByInventoryNumber } from '@/services/ScannerService';
import ModalConfirmation from '@/components/ModalConfirmation';
import  { MESSAGE_GO_BACK_TITLE, MESSAGE_HEADER_GO_HOME_TITLE, MESSAGE_HEADER_GO_HOME_BODY, MESSAGE_GO_BACK_SCAN_ITEM_BODY } from '@/constants/Messages/MessagesModales';

export default function ScanObjectsScreen() {
  const {
    addScannedCode,
    removeScannedItem,
  } = useScanner();

  const { setManualError, error : scanError, setError : setScanError, isLoading, resetScannedCodes, restartScan, scannedItems } = scannerContext();
  const router = useRouter();
  const [isPageFocused, setIsPageFocused] = useState(true);
  const [lastScannedItem, setLastScannedItem] = useState<any>(null);
  const [currentModal, setCurrentModal] = useState("");
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleItemScan = async (code: string, isManual : boolean) => {
    setLastScannedCode(code);
    const itemResponse = await getItemByInventoryNumber(code);
    addScannedCode(itemResponse.data);
    setLastScannedItem(itemResponse.data);
    // Nettoie l'ancien timeout s'il existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setLastScannedItem(null);
      timeoutRef.current = null;
    }, 4000);
  };

  // Nettoie le timeout si on ferme manuellement le toast
  const handleCloseToast = () => {
    setLastScannedItem(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const goToRecap = () => {
    router.push('/recap-inventory');
  };

  const goBack = () => {
    resetScannedCodes();
    setManualError(null);
    router.back();
  };

  const goHome = () => {
    restartScan();
    router.push('/');
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={()=> setCurrentModal('AFTER_HOME_CLICKED')}  />
      <Toast
        visible={!!scanError}
        message={
          scanError && lastScannedCode
            ? `Objet ${lastScannedCode} non enregistré`
            : scanError ?? ""
        }
        onClose={() => setScanError('')}
      />
      <Toast
        visible={!!lastScannedItem}
        message={
          lastScannedItem
            ? `Objet scanné : ${lastScannedItem?.name || ''} (#${lastScannedItem?.inventoryNumber || ''})`
            : ''
        }
        onClose={() => setLastScannedItem(null)}
        actionLabel="Annuler"
          onAction={() => {
          if (lastScannedItem) {
            removeScannedItem(lastScannedItem.inventoryNumber);
            handleCloseToast();
          }
        }}
        type="success"
      />
      {isPageFocused && (
        <Scanner
          message="Veuillez scanner les objets de la salle"
          messageColor="#222"
          frameColor={lastScannedItem ? '#4caf50' : '#222'}
          onScan={handleItemScan}
          scanMode="multiple"
          scannedCount={scannedItems.length}
          isActive={isPageFocused}
          step="object"
          onGoBack={()=> setCurrentModal('AFTER_GO_BACK_CLICKED')}
          onFinish={goToRecap}
          isLoading={isLoading}
          scanned={scannedItems.length > 0}
          enableManualInput={true}
        />)
      }
      <ModalConfirmation
          modalVisible={currentModal != ''}
          setModalVisible={() => setCurrentModal('')}
          title= { currentModal == 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_TITLE : MESSAGE_HEADER_GO_HOME_TITLE}
          message = {currentModal === 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_SCAN_ITEM_BODY: MESSAGE_HEADER_GO_HOME_BODY}
          isImportant = {currentModal == 'AFTER_HOME_CLICKED'}
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={currentModal === 'AFTER_GO_BACK_CLICKED' ? goBack : goHome}
      />
    </View>
  );
}