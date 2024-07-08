import React from 'react';
import { Text, View, Image, StyleSheet, Dimensions  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function BluetoothOffScreen() {
  return (
    
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#001268', '#45A7FF']}
        style={styles.background}
      />
      <View>
      <Image source={require('../assets/images/Blue.png')} style={styles.image} 
         resizeMode="contain"
      />
      </View>
      <View style={styles.textBlue}>
      <Text style={styles.headerText}>Ligar o Bluetooth.</Text>
      <Text style={styles.text}>Acesse o centro de controle e ligue o Bluetooth.</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',  // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,
    marginBottom: 60
   // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  text: {
    textAlign: 'left',
    fontSize: width * 0.033, // Ajuste o tamanho da fonte conforme necessário
    
  },
  headerText: {
    textAlign: 'left',
    fontSize: width * 0.055, // Tamanho de fonte maior para o primeiro texto
    marginBottom: 10
  },
  textBlue:{
    width: "100%",
    paddingLeft: 40
  }

})