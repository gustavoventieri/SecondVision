import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, Pressable, TouchableOpacity, Modal  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');
const batteryLevel = 80;

const loadFonts = async () => {
  await Font.loadAsync({
    'FonteCustomizada': require('../assets/fonts/Poppins-SemiBoldItalic.ttf'),
  });
};


export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [StatusText, setStatusText] = useState('Desligado');

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setStatusText(isOn ? 'Desligado' : 'Ligado');
  };



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
        colors={['#45A7FF', '#001268']}
        style={styles.background}
      />

      <View style={styles.headerOptions}>
        <Pressable onPress={toggleMenu}>
            <Ionicons name="information-circle-outline" size={35} color="white" />
        </Pressable>
        <Text style={styles.textFont}>Second Vision</Text>
        <Pressable>
            <Ionicons name="power" size={32} color="white" />
        </Pressable>
      </View>

      <View style={styles.titulo}>
          <Image source={require('../assets/images/Logo.png')} style={styles.image} 
            resizeMode="contain"
          />

          <View style={styles.dispositivo}>
              <Image source={require('../assets/images/Logo.png')} style={styles.image} 
                resizeMode="contain"
              />
          </View>
      </View>

      <View style={styles.orgQuadro}>
        <View style={styles.quadroinfo}>
            <View style={styles.statusSystem}>
                <Text style={styles.infoSystem}>Status do sistema:</Text> 
                
                    <TouchableOpacity  style={[styles.button, isOn ? styles.buttonOn : null]} onPress={toggleSwitch}>
                        <View style={[styles.switch, isOn ? styles.switchOn : styles.switchOff]} />
                    </TouchableOpacity> 
                    <Text style={styles.infoSystem}>{StatusText}</Text>
            </View>
            
          <Text style={styles.infoSystem}>Bateria:</Text>
          <View style={styles.progressBar}>
              
              <View style={[styles.progress, { width: `${batteryLevel}%` }]}>
                  <LinearGradient
                    colors={['#45A7FF', '#001268']} // Cores do gradiente linear
                    start={{ x: 0, y: 0 }} // Ponto inicial do gradiente (canto superior esquerdo)
                    end={{ x: 1, y: 0 }} // Ponto final do gradiente (canto superior direito)
                    style={[StyleSheet.absoluteFill, styles.progress]}
                  />
                  
              </View>
              
            </View>
            <View style={styles.NivelDisp}>
              <Text style={styles.Nivel}>Baixa</Text>
              <Text style={styles.Nivel}>Média</Text>
              <Text style={styles.Nivel}> Alta</Text>
            </View>
        </View>
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
    flex:1,
  justifyContent: "space-between"},
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
    justifyContent: "space-between",
    padding: 20
  },
  textFont: {
    fontFamily: 'FonteCustomizada',
    fontSize: width * 0.05,
    color: "white"
  },
  titulo:{
    justifyContent: "center",
    alignItems: "center",

  },
  infoSystem:{
    fontSize: width * 0.04,
    marginRight: 15,
    marginBottom: 10
  },
  dispositivo:{
    width: width * 0.5, // Largura do círculo como metade da largura da tela
    height: width * 0.5, // Altura do círculo como metade da largura da tela
    borderRadius: (width * 0.5) / 2, // Metade da largura para formar um círculo
    backgroundColor: 'white', // Cor de fundo branca
    justifyContent: "center",
    alignItems: "center"
  },
  quadroinfo:{
    width: "80%",
    
    backgroundColor: '#D9D4D4',
    borderRadius: 10,
    padding: 20
  },
  orgQuadro:{
    alignItems: "center",
    
    paddingBottom: 40,

  },
  progressBar: {
    width: '100%', // Largura da barra de progresso
    height: 30, // Altura da barra de progresso
    backgroundColor: '#e0e0e0', // Cor de fundo da barra de progresso
    borderRadius: 5, // Borda arredondada
    overflow: 'hidden', // Garante que a barra de progresso não ultrapasse os limites do contêiner
  },
  progress: {
    height: '100%', // Altura da barra de progresso
    
  },
  button: {
    width: 60,
    height: 25,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  switch: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2.5,
  },
  switchOn: {
    right: 4,
  },
  switchOff: {
    left: 4,
  },
  buttonOn: {
    backgroundColor: '#001268', // Cor de fundo quando ativado para a direita
    marginRight: 10,
  },
  statusSystem:{
    flexDirection: "row",
    
  },
  NivelDisp:{
    flexDirection: "row",
    justifyContent:"space-around"
  },
  Nivel:{
    marginTop: 4,
    color: "white"
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