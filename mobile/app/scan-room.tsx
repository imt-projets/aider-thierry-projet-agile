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

export default function ScanRoomScreen() {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(0);
  const [scanError, setScanError] = useState('');
  const {
    roomCode,
    setRoomCode,
    resetRoomCode,
    isLoading
  } = useScanner();

  const { mode, restartScan } = scannerContext();

  const [isPageFocused, setIsPageFocused] = useState(true);

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


  const handleAnnuler = () => {
    resetRoomCode();
    setResetTrigger(prev => prev + 1);
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
        resetTrigger={resetTrigger}
        isActive={!scanned && isPageFocused}
        step="salle"
        onCancel={handleAnnuler}
        onContinue={handleContinue}
        isLoading={isLoading}
        scanned={scanned}
        enableManualInput={true}
      />
    </View>
  );
}