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

export default function ScanRoomScreen() {
  const router = useRouter();
  const [scanError, setScanError] = useState('');
  const {
    roomCode,
    setRoomCode,
    resetRoomCode,
    isLoading
  } = useScanner();

  const { mode, restartScan } = scannerContext();

  const [isPageFocused, setIsPageFocused] = useState(true);
  const [isModalCancelShown, setIsModalCancelShwon] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsPageFocused(true);
      return () => setIsPageFocused(false);
    }, [])
  );

  const handleRoomScan = async (code: string) => {
    setScanError('');
    try {
      const roomResponse = await getRoomByCode(code);
      if (roomResponse.ok && roomResponse.data && roomResponse.data.id) {
        setRoomCode(code);
      }
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
    if (scanned) setScanError('');
  }, [scanned]);

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" onHomePress={goHome} />
      <Toast visible={!!scanError} message={scanError} onClose={() => setScanError('')} />
      <Scanner
        message={scanned ? 'Code barre de la salle récupéré': 'Veuillez scanner le code barre de la salle'}
        messageColor={scanned ? '#4caf50' : '#222'}
        frameColor={scanned ? '#4caf50' : '#222'}
        onScan={handleRoomScan}
        scanMode="single"
        isActive={!scanned && isPageFocused}
        step="salle"
        onCancel={ ()=> setIsModalCancelShwon(true) }
        onContinue={handleContinue}
        isLoading={isLoading}
        scanned={scanned}
        enableManualInput={true}
      />
      <ModalConfirmation
        modalVisible={isModalCancelShown}
        setModalVisible={setIsModalCancelShwon}
        title="Êtes vous sûr de retourner au menu principal ?"
        message={`L'action en cours sera abandonée`}
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={goHome}
      />
    </View>
  );
}