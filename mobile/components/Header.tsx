import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface HeaderProps {
  title? : string;
  homePage? : boolean;
  onHomePress?: () => void;
}

const Header = ({ title, homePage, onHomePress }: HeaderProps) => (
  <View style={!homePage ? styles.header : [styles.header, styles.noBorder]}>
    {!homePage && onHomePress && (
      <TouchableOpacity onPress={onHomePress} style={styles.homeBtn}>
        <Entypo name="home" size={28} color="#000" />
      </TouchableOpacity>
    )}
    {homePage && (<Image source={require('@/assets/logo-imt.png')} style={homePage ? styles.logoHomePage : styles.logo} />)}
    {!homePage && (
      <>
        <Text style={styles.title}>{title}</Text>
        <Image source={require('@/assets/logo-barcode.png')} style={styles.logo} />
      </>
    )}
  </View>
);


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  logoHomePage : { width: 80, height: 40, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  homeBtn: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    // Ombre pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Ombre pour Android
    elevation: 4,
  },
});


export default Header;
