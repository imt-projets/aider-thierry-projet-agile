// pages/scan-room.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { scannerContext } from '@/context/ScannerContext';
import { getRoomByCode } from '@/services/ScannerService';
import useManualInput from '@/hooks/useManualInput';
import Toast from '@/components/Toast';
import { useFocusEffect } from '@react-navigation/native';
import { ApiNotFoundError, ApiServerError, ApiTimeoutError } from "@/interfaces/Item/ApiErrors";
import ModalConfirmation from '@/components/ModalConfirmation';
import  { MESSAGE_GO_BACK_TITLE, MESSAGE_GO_BACK_HOME_BODY, MESSAGE_HEADER_GO_HOME_TITLE, MESSAGE_HEADER_GO_HOME_BODY} from '@/constants/Messages/MessagesModales'

export default function ScanRoomScreen() {
  const router = useRouter();
  const { setManualError, error : scanError, setError : setScanError } = scannerContext();
  const {
    roomCode,
    setRoomCode,
    resetRoomCode,
    isLoading
  } = useScanner();

  const { mode, restartScan } = scannerContext();

  const [isPageFocused, setIsPageFocused] = useState(true);

  const [currentModal, setCurrentModal] = useState("");

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleRoomScan = async (code: string, isManual : boolean) => {
    setManualError('');
    try {
      const roomResponse = await getRoomByCode(code);
      if (roomResponse.ok && roomResponse.data && roomResponse.data.id) {
        setRoomCode(code);
      }
    } catch (error) {
      let errorMessage = '';     
      if (error instanceof ApiNotFoundError) {
        errorMessage = 'Salle inexistante ou code invalide';
      } else if (error instanceof ApiServerError) {
        errorMessage = 'Erreur interne';
      } else if (error instanceof ApiTimeoutError) {
        errorMessage = 'Le serveur ne répond pas';
      }
      isManual ? setManualError(errorMessage) : setScanError(errorMessage)
    }
  };

  const handleContinue = () => {
    const nextRoute = mode === 'addingObject' ? '/add-object' : '/room-inventory';
    router.push(nextRoute);
  };

  const goHome = () => {
    restartScan();
    router.push('/');
  };

  const scanned = roomCode !== null;

  useEffect(() => {
    if (scanned) setManualError('');
  }, [scanned]);

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={()=> setCurrentModal('AFTER_HOME_CLICKED')} />
      <Toast visible={!!scanError} message={scanError ?? ""} onClose={() => setScanError('')} />
      <Scanner
        message={scanned ? 'Code barre de la salle récupéré': 'Veuillez scanner le code barre de la salle'}
        messageColor={scanned ? '#4caf50' : '#222'}
        frameColor={scanned ? '#4caf50' : '#222'}
        onScan={handleRoomScan}
        scanMode="single"
        isActive={!scanned && isPageFocused}
        step="salle"
        onCancel={ ()=> setCurrentModal('AFTER_GO_BACK_CLICKED') }
        onContinue={handleContinue}
        isLoading={isLoading}
        scanned={scanned}
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
        onConfirm={goHome}
      />
    </View>
  );
}