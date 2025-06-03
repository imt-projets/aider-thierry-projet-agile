import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = ({ title }: { title: string }) => (  
  <View style={styles.header}>
    <Image source={require('@/assets/logo-imt.png')} style={styles.logo} />
    <Text style={styles.title}>{title}</Text>
    <Image source={require('@/assets/logo-barcode.png')} style={styles.logo} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    marginTop: 10,
    borderBottomWidth : 1
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
});

export default Header;
