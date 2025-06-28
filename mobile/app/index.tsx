// pages/index.tsx
import React, {useCallback, useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

import Header from '@/components/Header';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import {layout} from '@/styles/common';
import {scannerContext} from '@/context/ScannerContext';

export default function HomeScreen() {
  const router = useRouter();
  const {
    setMode, 
    restartScan, 
    setIsScannerActive,
    submissionMessage,
    submissionMessageType,
    clearSubmissionMessage
  } = scannerContext();

  useEffect(() => {
    setIsScannerActive(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setMode(null)
    }, [])
  );

  const navigateTo = (mode: 'inventoryRoom' | 'addingObject') => {
    restartScan();
    setMode(mode);
    router.push('/scan-room');
  };

  return (
    <View style={[layout.container, styles.container]}>
      <Header homePage />
      
      <Toast 
        visible={!!submissionMessage} 
        message={submissionMessage ?? ""} 
        onClose={clearSubmissionMessage}
        type={submissionMessageType === 'success' ? 'success' : 'error'}
      />

      <View style={styles.hero}>
        <Text style={styles.title}>IMT'ventaire</Text>
        <Image
          source={require('@/assets/logo-barcode.png')}
          style={styles.barcode}
        />
      </View>

      <View>
        <Button
          title="Faire l'inventaire"
          onPress={() => navigateTo('inventoryRoom')}
          type="primary"
          icon={<Octicons name="checklist" size={24} color="white" />}
        />
        <Button
          title="Ajouter un objet"
          onPress={() => navigateTo('addingObject')}
          type="outline"
          style={styles.addButton}
          icon={
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color="black"
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 80,
  },
  barcode: {
    width: 175,
    height: 175,
    resizeMode: 'contain',
    marginBottom: 60,
  },
  addButton: {
    marginTop: 15,
  },
});
