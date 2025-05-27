import { StyleSheet } from 'react-native';

export const layout = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      marginTop: 10,
    },
    footer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingRight: 16,
      paddingLeft : 16,
      marginTop : 30,
     
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#222',
    },
  });
  
  export const buttons = StyleSheet.create({
    primary: {
      flex: 1,
      backgroundColor: '#1976D2',
      borderRadius: 10,
      padding: 14,
      marginLeft: 8,
      alignItems: 'center',
    },
    danger: {
      flex: 1,
      backgroundColor: '#F44336',
      borderRadius: 10,
      padding: 14,
      marginRight: 8,
      alignItems: 'center',
    },
    sucess : {
      flex: 1,
      backgroundColor: '#009B12',
      borderRadius: 10,
      padding: 14,
      marginRight: 8,
      alignItems: 'center',
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    primaryText: {
      color: '#fff',
    },
    dangerText: {
      color: '#fff',
    },
  });