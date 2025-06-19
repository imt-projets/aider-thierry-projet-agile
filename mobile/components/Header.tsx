import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface HeaderProps {
  title? : string;
  homePage? : boolean
}

const Header = ({ title, homePage }: HeaderProps) => (
  <View style={!homePage ? styles.header : [styles.header, styles.noBorder]}>
    <Image source={require('@/assets/logo-imt.png')} style={homePage ? styles.logoHomePage : styles.logo} />
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
    marginTop: 0,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  logoHomePage : { width: 80, height: 40, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
});


export default Header;
