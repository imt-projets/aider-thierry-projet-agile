// pages/scan-room.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import { layout } from '@/styles/common';
import { scannerContext } from '@/context/ScannerContext';
import { checkRoomExists } from '@/services/ScannerService';
import useManualInput from '@/hooks/useManualInput';

export default function ScanRoomScreen() {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    roomCode,
    setRoomCode,
    resetRoomCode,
    isScannerActive,
    setIsScannerActive,
    isLoading
  } = useScanner();

  const { mode } = scannerContext();

  const handleRoomScan = async (code: string) => {
    const exists = await checkRoomExists(code);
    if (exists) {
      setRoomCode(code);
    } else {
      throw new Error('Salle inexistante ou code invalide');
    }
  };

  const manualInput = useManualInput(handleRoomScan);

  useEffect(() => {
    setIsScannerActive(true);
    return () => {
      setIsScannerActive(false);
    };
  }, []);

  const handleAnnuler = () => {
    resetRoomCode();
    setResetTrigger(prev => prev + 1);
  };

  const handleContinue = () => {
    const nextRoute = mode === 'addingObject' ? '/add-object' : '/room-inventory';
    router.push(nextRoute);
  };

  const scanned = roomCode !== null;

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />
      <Scanner
        message={scanned ? 'Code barre de la salle récupéré' : 'Veuillez scanner le code barre de la salle'}
        messageColor={scanned ? '#4caf50' : '#222'}
        frameColor={scanned ? '#4caf50' : '#222'}
        onScan={handleRoomScan}
        scanMode="single"
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
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