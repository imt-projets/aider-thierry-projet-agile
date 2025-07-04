// pages/scan-room.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { scannerContext } from '@/context/ScannerContext';
import Toast from '@/components/Toast';
import { useFocusEffect } from '@react-navigation/native';
import ModalConfirmation from '@/components/ModalConfirmation';
import  { MESSAGE_GO_BACK_TITLE, MESSAGE_GO_BACK_HOME_BODY, MESSAGE_HEADER_GO_HOME_TITLE, MESSAGE_HEADER_GO_HOME_BODY, MESSAGE_GO_BACK_SCAN_ROOM_BODY } from '@/constants/Messages/MessagesModales'
import { getRoomByCode } from '@/services/ScannerService';

export default function ScanRoomScreen() {
  const router = useRouter();
  const {setManualError, error : scanError, setError : setScanError,roomCode, setRoomCode, isLoading, mode, restartScan} = scannerContext();
  const [isPageFocused, setIsPageFocused] = useState(true);
  const [currentModal, setCurrentModal] = useState("");
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleContinue = () => {
    const nextRoute = mode === 'addingObject' ? '/add-object' : '/room-inventory';
    router.push(nextRoute);
  };

  const scanned = roomCode !== null;

  const handleRoomScan = async (code: string, isManual : boolean) => {
    setLastScannedCode(code);
    const roomResponse = await getRoomByCode(code);
    if (roomResponse.ok && roomResponse.data && roomResponse.data.id) {
      setRoomCode(code);
    }
  };

  const goHome = () => {
    restartScan();
    router.push('/')
  }

  const goBack = () => {
    if (scanned) {
      restartScan();
    } else {
      goHome();
    }
  }
  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={()=> setCurrentModal('AFTER_HOME_CLICKED')} />
      <Toast visible={!!scanError} message={scanError?.replace("{room}"," "+(lastScannedCode??"")) ?? ""} onClose={() => setScanError('')} />
      { isPageFocused && 
        (<Scanner
          message={
            scanned
              ? `Code barre de la salle récupéré : ${roomCode}`
              : 'Veuillez scanner le code barre de la salle'
          }
          messageColor={scanned ? '#4caf50' : '#222'}
          frameColor={scanned ? '#4caf50' : '#222'}
          onScan={handleRoomScan}
          scanMode="single"
          isActive={!scanned && isPageFocused}
          step="salle"
          onGoBack={ ()=> setCurrentModal('AFTER_GO_BACK_CLICKED') }
          onContinue={handleContinue}
          isLoading={isLoading}
          scanned={scanned}
          enableManualInput={true}
        />)
      }
      <ModalConfirmation
        modalVisible={currentModal != ''}
        setModalVisible={() => setCurrentModal('')}
        title={currentModal == 'AFTER_GO_BACK_CLICKED' ? MESSAGE_GO_BACK_TITLE : MESSAGE_HEADER_GO_HOME_TITLE}
        message={
          currentModal === 'AFTER_GO_BACK_CLICKED'
            ? (scanned ? MESSAGE_GO_BACK_SCAN_ROOM_BODY : MESSAGE_GO_BACK_HOME_BODY)
            : MESSAGE_HEADER_GO_HOME_BODY
        }
        isImportant={currentModal == 'AFTER_HOME_CLICKED'}
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={currentModal === 'AFTER_GO_BACK_CLICKED' ? goBack : goHome}
      />
    </View>
  );
}