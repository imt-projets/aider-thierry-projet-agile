// pages/scan-objects.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import ModalConfirmation from '@/components/ModalConfirmation';
import { useScanner } from '@/context/ScannerContext';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { layout } from '@/styles/common';

export default function ScanObjectsScreen() {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const { scannedCodes, addScannedCode, isScannerActive, setIsScannerActive } = useScanner();

  const handleScan = (code: string) => {
    addScannedCode(code);
    setLastScanned(code);
    setTimeout(() => setLastScanned(null), 1000);
  };

  return (
    <View style={layout.container}>
      <Header title="IMT'ventaire" />

      <Scanner
        message="Veuillez scanner les objets de la salle"
        messageColor="#222"
        frameColor={lastScanned ? '#4caf50' : '#1976D2'}
        onScan={handleScan}
        scanMode="multiple"
        scannedCount={scannedCodes.length}
        resetTrigger={resetTrigger}
        isActive={isScannerActive}
        step="object"
      />

      <View style={layout.footer}>
        <Button title="Saisir le code" onPress={() => {}} type="outline" />
        <Button
          title="Terminer"
          onPress={() => {
            setModalVisible(true);
            setIsScannerActive(false);
          }}
          type="primary"
        />
      </View>

      <ModalConfirmation
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setIsScannerActive={setIsScannerActive}
      />
    </View>
  );
}