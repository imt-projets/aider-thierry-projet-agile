// pages/index.tsx
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { layout } from '@/styles/common';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[layout.container, { justifyContent: 'space-between', alignItems: 'center', paddingBottom : 60}]}>
      <Header title="IMT'ventaire" />
      <View style={{ marginTop: 40 }}>
        <Button
          title="Scanner un code barre"
          onPress={() => router.push('/scan-room')}
          type="primary"
          style={{ paddingHorizontal: 30 }}
        />
      </View>
    </View>
  );
}