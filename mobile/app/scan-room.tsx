// pages/scan-room.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';
import useScanner from '@/hooks/useScanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { layout } from '@/styles/common';
import { scannerContext } from '@/context/ScannerContext';

export default function ScanRoomScreen() {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(0);
  const {
    roomCode,
    setRoomCode,
    resetRoomCode,
    isScannerActive,
    setIsScannerActive,
  } = useScanner();

  const { mode, restartScan } = scannerContext();

  useEffect(() => {
    setIsScannerActive(true);
    return () => {
      setIsScannerActive(false);
    };
  }, []);

  const handleRoomScan = (code: string) => {
    setRoomCode(code);
  }

  const handleAnnuler = () => {
    restartScan();
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
        message={scanned ? 'Code barre de la salle récupéré' + roomCode : 'Veuillez scanner le code barre de la salle'}
        messageColor={scanned ? '#4caf50' : '#222'}
        frameColor={scanned ? '#4caf50' : '#222'}
        onScan={handleRoomScan}
        scanMode="single"
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="salle"
      />

      <Footer
        isScanned={scanned}
        onCancel={handleAnnuler}
        onContinue={handleContinue}
        showBackButton={true}
        onBack={() => router.back()}
      />
    </View>
  );
}