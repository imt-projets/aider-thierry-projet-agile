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

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleItemScan = async (code: string, isManual : boolean) => {
    const itemResponse = await getItemByInventoryNumber(code);
    addScannedCode(itemResponse.data);
    setLastScannedItem(itemResponse.data);
    setTimeout(() => setLastScannedItem(null), 2000);
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
      <Toast visible={!!scanError} message={scanError ?? ""} onClose={() => setScanError('')} />
      <Toast
        visible={!!lastScannedItem}
        message={`Objet scanné : ${lastScannedItem?.name || lastScannedItem?.inventoryNumber}`}
        onClose={() => setLastScannedItem(null)}
        actionLabel="Annuler"
        onAction={() => lastScannedItem && removeScannedItem(lastScannedItem.inventoryNumber)}
        type="success"
      />
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
      />
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