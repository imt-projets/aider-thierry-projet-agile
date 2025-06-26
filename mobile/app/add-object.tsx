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
import { getItemByInventoryNumber } from '@/services/ScannerService';
import ModalConfirmation from '@/components/ModalConfirmation';
import  {MESSAGE_GO_BACK_TITLE, MESSAGE_GO_BACK_HOME_BODY, MESSAGE_HEADER_GO_HOME_TITLE, MESSAGE_HEADER_GO_HOME_BODY, MESSAGE_GO_BACK_SCAN_ROOM_BODY, MESSAGE_GO_BACK_SCAN_OBJECT_BODY} from '@/constants/Messages/MessagesModales';
import {scannerContext} from '@/context/ScannerContext';

export default function ScanObjectScreen() {
  const {
    removeScannedItem,
    addScannedCode,
    handleSendObject
  } = useScanner();

  const [isPageFocused, setIsPageFocused] = useState(true);
  const [lastScannedItem, setLastScannedItem] = useState<any>(null);
  const [currentModal, setCurrentModal] = useState("");
  const { setManualError, error : scanError, setError : setScanError, restartScan, scannedItems, isLoading, resetScannedCodes, setSubmissionMessage, setSubmissionMessageType, mode } = scannerContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleScan = async (code: string, isManual : boolean) => {
    setLastScannedCode(code);
    setScanError('');
    const itemResponse = await getItemByInventoryNumber(code);
    addScannedCode(itemResponse.data);
    setLastScannedItem(itemResponse.data);
  };
  
  const goBack = () => {
    if (lastScannedItem) {
      resetScannedCodes();
      setLastScannedItem(null);
    } else {
      router.back();
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (mode === 'addingObject') {
        await handleSendObject();
      }
    } catch (error) {
      const errorMessage = mode === 'addingObject' 
        ? "Erreur lors de l'ajout de l'objet"
        : "Erreur inconnue";
      setSubmissionMessage(errorMessage);
      setSubmissionMessageType('error');
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isObjectScanned = scannedItems.length > 0;

  const goHome = () => {
    restartScan();
    router.push('/');
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={()=> setCurrentModal('AFTER_HOME_CLICKED')}/>
      <Toast visible={!!scanError} message={scanError?.replace("{object}",lastScannedCode??"") ?? ""} onClose={() => setScanError('')} />
      <Scanner
        message={
          isObjectScanned
            ? `Code barre de l'objet récupéré : ${lastScannedItem?.inventoryNumber ?? ''}`
            : 'Veuillez scanner le code barre de l\'objet à ajouter'
        }
        messageColor={isObjectScanned ? '#4caf50' : '#222'}
        frameColor={lastScannedItem ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="single"
        isActive={isPageFocused}
        step="object"
        onGoBack={()=> setCurrentModal('AFTER_GO_BACK_CLICKED')}
        onAdd={handleSubmit}
        isLoading={isLoading}
        scanned={isObjectScanned}
        enableManualInput={true}
      />

      <ModalConfirmation
          modalVisible={currentModal != ''}
          setModalVisible={() => setCurrentModal('')}
          title= { currentModal == 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_TITLE : MESSAGE_HEADER_GO_HOME_TITLE}
          message={
            currentModal === 'AFTER_GO_BACK_CLICKED'
              ? (lastScannedItem ? MESSAGE_GO_BACK_SCAN_OBJECT_BODY : MESSAGE_GO_BACK_SCAN_ROOM_BODY)
              : MESSAGE_HEADER_GO_HOME_BODY
          }          
          isImportant = {currentModal == 'AFTER_HOME_CLICKED'}
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={currentModal === 'AFTER_GO_BACK_CLICKED' ? goBack : goHome}
      />
    </View>
  );
}