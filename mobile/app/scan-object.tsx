// pages/scan-objects.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import { useScanner } from '@/context/ScannerContext';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { layout } from '@/styles/common';
import { Entypo, Octicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ScanObjectsScreen() {
  const [lastScanned] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const { scannedCodes, addScannedCode, isScannerActive, restartScan, resetScannedCodes } = useScanner();

  const handleScan = (code: string) => {
    addScannedCode(code);
  };

  const handleAnnuler = () => {
    resetScannedCodes();
    setResetTrigger(prev => prev + 1);
  };

  const isObjectScanned = scannedCodes.length > 0;

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />

      <Scanner
        message={isObjectScanned ? "Code barre de l'objet récupéré" : "Veuillez scanner le code barre de l'objet à ajouter"}
        messageColor={isObjectScanned ? '#4caf50' : '#222'}
        frameColor={lastScanned ? '#4caf50' : '#222'}
        onScan={handleScan}
        scanMode="single"
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="object"
      />

      <View style={layout.footer}>
        {!isObjectScanned ?  (
          <>
            <Button title="Saisir le code" onPress={() => {}} type="outline" icon={<Entypo name="pencil" size={24} color="black" />}/>
            <Button 
                title="Annuler" 
                onPress={() => {router.back()}} 
                type="danger" 
                icon={<Entypo name="circle-with-cross" size={24} color="white" />}
            />
          </>
        ) : (
          <>
            <Button title="Ajouter" onPress={() => {restartScan(); router.push('/');}} type="success" icon={<Octicons name="diff-added" size={24} color="white" />} />
            <Button 
                title="Annuler" 
                onPress={handleAnnuler}
                type="danger" 
                icon={<Entypo name="circle-with-cross" size={24} color="white" />}
            />            
          </>
        )}
      </View>
    </View>
  );
}