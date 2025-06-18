// pages/index.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { layout } from '@/styles/common';
import { useScanner } from '@/context/ScannerContext';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { setMode } = useScanner();
  const {restartScan} = useScanner();

  const goToInventory = () => {
    setMode('inventoryRoom'); 
    router.push('/scan-room');
    restartScan();

  }

  const goToAddObject = () => {
    setMode('addingObject');
    router.push('/scan-room');
    restartScan();
  }
  return (
    <View style={[layout.container, { justifyContent: 'space-between', paddingBottom: 60, paddingTop: 60 }]}>
      
      <View style={{ alignItems: 'flex-start', paddingLeft: 20, paddingTop: 20 }}>
        <Image 
          source={require('@/assets/logo-imt.png')}
          style={{ width: 80, height: 40, resizeMode: 'contain' }}
        />
      </View>

      <View style={{ alignItems: 'center'}}>
        <Text style={{ fontSize: 40, fontWeight: '600', marginBottom: 80 }}>
          IMT’ventaire
        </Text>

        <Image 
          source={require('@/assets/logo-barcode.png')}
          style={{ width: 175, height: 175, resizeMode: 'contain', marginBottom: 60 }}
        />
      </View>

      <View>
        <Button
          title="Faire l'inventaire"
          onPress={goToInventory}
          type="primary"
          icon={<Octicons name="checklist" size={24} color="white" />}
        />
        <Button
          title="Ajouter un objet"
          onPress={goToAddObject}
          type="outline"
          style={{ marginTop: 15 }}
          icon={<MaterialIcons name="add-circle-outline" size={24} color="black" />}
        />
      </View>
    </View>
  );
}
