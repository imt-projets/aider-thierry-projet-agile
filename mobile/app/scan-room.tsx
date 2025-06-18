// pages/scan-room.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';
import { useScanner } from '@/context/ScannerContext';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { layout } from '@/styles/common';
import { Entypo } from '@expo/vector-icons';

export default function ScanRoomScreen() {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(0);
  const { roomCode, setRoomCode, resetRoomCode, isScannerActive, setIsScannerActive, mode } = useScanner();

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
    resetRoomCode();
    setResetTrigger(prev => prev + 1);
  };

  const scanned = roomCode !== null;

  const nextRoute = mode === 'addingObject' ? '/scan-object' : '/scan-objects';

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
      />

      <View style={layout.footer}>
        {!scanned ? (
          <>
            <Button title="Saisir le code" onPress={() => {}} type="outline" icon={<Entypo name="pencil" size={24} color="black" />}/>
            <Button title="Annuler" onPress={() => router.back()} type="danger" icon={<Entypo name="circle-with-cross" size={24} color="white" />}/>
          </>
        ) : (
          <>
            <Button title="Continuer" onPress={() => router.push(nextRoute)} type="success" icon={<Entypo name="arrow-with-circle-right" size={24} color="white" />} />
            <Button title="Annuler" onPress={handleAnnuler} type="danger" icon={<Entypo name="circle-with-cross" size={24} color="white" />}/>
          </>
        )}
      </View>
    </View>
  );
}