import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, Pressable, TouchableOpacity, Modal  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';




const { width, height } = Dimensions.get('window');

const loadFonts = async () => {
  await Font.loadAsync({
    'FonteCustomizada': require('../assets/fonts/Poppins-Medium.ttf'),
  });
};


export default function BluetoothOnScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento
  }


  return (
    
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#001268', '#45A7FF']}
        style={styles.background}
      />

      <View style={styles.headerOptions}>
        <Pressable onPress={toggleMenu} style={[{position: 'absolute'}, {top: 20}, {left: 20}]}>
            <Ionicons name="information-circle-outline" size={35} color="white" />
            
        </Pressable>
        <Text style={styles.textFont}>Meus Dispositivos</Text>
        
      </View>

      <View style={styles.titulo}>
          <Image source={require('../assets/images/Logo.png')} style={styles.image} 
            resizeMode="contain"
          />

          <Pressable  style={styles.dispositivo}>
              <Image source={require('../assets/images/Logo.png')} style={styles.image} 
                resizeMode="contain"
              />
          </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuOpen}
        onRequestClose={() => {
          setIsMenuOpen(false);
        }}
      >
        <View style={styles.modalContainer}>
                <TouchableOpacity style={[{position: 'absolute'}, {top: 20}, {left: 20}]} onPress={toggleMenu}>
                  <Ionicons name="close-circle-outline" size={30} color="black" />
                </TouchableOpacity>
          <View style={styles.modalInfo}>
                
                <Image source={require('../assets/images/LogoPreta.png')} style={styles.imageSessaoInfo} 
                resizeMode="contain"
                />
                    
          </View>
          <View style={styles.textInfo}>
              <Text>
                basjal;sjsalcdjsakldsjadsajdls;a
              </Text>
              <Text style={styles.line} />
              <Text >
                basjal;sjsalcdjsakldsjadsajdls;a
              </Text>
              <Text style={styles.line} />
              <Text>
                basjal;sjsalcdjsakldsjadsajdls;a
              </Text>
          </View>
          
        </View>
      </Modal>
    
      
    </View>

    
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,},
  image: {
    width: '60%',  // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,
    
   // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  imageSessaoInfo: {
    width: '30%',  // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,
    marginLeft: 10
    
   // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  headerOptions:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  textFont: {
    fontFamily: 'FonteCustomizada',
    fontSize: width * 0.03,
    color: "white"
  },
  titulo:{
    justifyContent: "center",
    alignItems: "center",

  },
  dispositivo:{
    width: width * 0.5, // Largura do círculo como metade da largura da tela
    height: width * 0.5, // Altura do círculo como metade da largura da tela
    borderRadius: (width * 0.5) / 2, // Metade da largura para formar um círculo
    backgroundColor: 'white', // Cor de fundo branca
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f3f3ff',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  
  },
  modalInfo:{
    flexDirection: "row",
    justifyContent: "center"
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginBottom: 10,
    marginTop: 10
    // Você pode adicionar mais estilos aqui, como margens, etc.
  },
  textInfo:{
    padding: 20
  }

}) 