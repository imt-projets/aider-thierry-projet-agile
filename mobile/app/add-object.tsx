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
import ModalConfirmation from '@/components/ModalConfirmation';
import  {MESSAGE_GO_BACK_TITLE, MESSAGE_GO_BACK_HOME_BODY, MESSAGE_HEADER_GO_HOME_TITLE, MESSAGE_HEADER_GO_HOME_BODY} from '@/constants/Messages/MessagesModales';
import {ROOM_NOT_FOUND_MESSAGE} from '@/constants/Messages/Errors/ScanErrors';
import {scannerContext} from '@/context/ScannerContext';


export default function ScanObjectScreen() {
  const {
    removeScannedItem,
    addScannedCode
  } = useScanner();

  const [isPageFocused, setIsPageFocused] = useState(true);
  const [lastScannedItem, setLastScannedItem] = useState<any>(null);
  const [currentModal, setCurrentModal] = useState("");
  const { setManualError, error : scanError, setError : setScanError, restartScan, scannedItems, isLoading, resetScannedCodes } = scannerContext();


  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleScan = async (code: string, isManual : boolean) => {
    setScanError('');
    try {
      const itemResponse = await getItemByInventoryNumber(code);
      addScannedCode(itemResponse.data);
      setLastScannedItem(itemResponse.data);
    } catch (error) {
      let errorMessage = '';     
      if (error instanceof ApiNotFoundError) {
        errorMessage = ROOM_NOT_FOUND_MESSAGE;
      } else if (error instanceof ApiServerError || error instanceof ApiTimeoutError) {
        errorMessage = error.message;
      }
      isManual ? setManualError(errorMessage) : setScanError(errorMessage)
    }
  };
  
  const goBack = () => {
    restartScan();
    router.back();
  };

  const goToRecap = () => {
    router.push('/recap-inventory');
  };

  const isObjectScanned = scannedItems.length > 0;

  const goHome = () => {
    resetScannedCodes();
    router.back();
  }

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={()=> setCurrentModal('AFTER_HOME_CLICKED')}/>
      <Toast visible={!!scanError} message={scanError ?? ''} onClose={() => setScanError('')} />
      <Toast
        visible={!!lastScannedItem}
        message={`Objet scanné : ${lastScannedItem?.name || lastScannedItem?.inventoryNumber}`}
        onClose={() => setLastScannedItem(null)}
        actionLabel="Annuler"
        onAction={() => lastScannedItem && removeScannedItem(lastScannedItem.inventoryNumber)}
        type="success"
      />

      <Scanner
        message={isObjectScanned ? "Code barre de l'objet récupéré" : "Veuillez scanner le code barre de l'objet à ajouter"}
        messageColor={isObjectScanned ? '#4caf50' : '#222'}
        frameColor={lastScannedItem ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="single"
        isActive={isPageFocused}
        step="object"
        onGoBack={()=> setCurrentModal('AFTER_GO_BACK_CLICKED')}
        onAdd={goToRecap}
        isLoading={isLoading}
        scanned={isObjectScanned}
        enableManualInput={true}
      />

      <ModalConfirmation
          modalVisible={currentModal != ''}
          setModalVisible={() => setCurrentModal('')}
          title= { currentModal == 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_TITLE : MESSAGE_HEADER_GO_HOME_TITLE}
          message = {currentModal === 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_HOME_BODY: MESSAGE_HEADER_GO_HOME_BODY}
          isImportant = {currentModal == 'AFTER_HOME_CLICKED'}
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={currentModal === 'AFTER_GO_BACK_CLICKED' ? goBack : goHome}
      />
    </View>
  );
}