import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const batteryLevel = 80;
const { width } = Dimensions.get("window");

interface DashboardProps {
  toggleSwitch: () => void;
  isOn: boolean;
  statusText: string;
}

const modes = [
  {
    name: "Híbrido",
    description: "Esse modo detecta tanto objetos possivelmente perigosos como textos estáticos."
  },
  {
    name: "Texto",
    description: "Esse modo detecta apenas textos estáticos."
  },
  {
    name: "Objetos",
    description: "Esse modo detecta apenas objetos possivelmente perigosos."
  }
];

export const Dashboard: React.FC<DashboardProps> = ({
  toggleSwitch,
  isOn,
  statusText,
}) => {

  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  const [inputValue, setInputValue] = useState('');

  const handleChange = (value: any) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
  };

  const handleSubmit = () => {
    const integerValue = parseInt(inputValue, 10);
    if (!isNaN(integerValue)) {
      Alert.alert('Valor inserido', `O valor digitado é: ${integerValue}`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número inteiro válido.');
    }
  };

  const nextMode = () => {
    setCurrentModeIndex((currentModeIndex + 1) % modes.length);
  };

  const previousMode = () => {
    setCurrentModeIndex((currentModeIndex - 1 + modes.length) % modes.length);
  };

  const currentMode = modes[currentModeIndex];
  return (
    <SafeAreaView>

          <View style={styles.orgQuadro}>
            <View style={styles.quadroinfo}>
              <View style={styles.statusSystem}>
                <Text style={styles.infoSystem}>Status do sistema:</Text>

                <TouchableOpacity
                  style={[styles.button, isOn ? styles.buttonOn : null]}
                  onPress={toggleSwitch}
                >
                  <View
                    style={[styles.switch, isOn ? styles.switchOn : styles.switchOff]}
                  />
                </TouchableOpacity>
                <Text style={styles.infoSystem}>{statusText}</Text>
              </View>

              <Text style={styles.infoSystem}>Bateria:</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${batteryLevel}%` }]}>
                  <LinearGradient
                    colors={["#45A7FF", "#001268"]} // Cores do gradiente linear
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


          <View style={styles.orgQuadro}>
            <View style={styles.quadroinfo}>
                  <Text style={styles.infoSystem}>Modos de operação:</Text>
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionText}>{currentMode.description}</Text>
                    </View>
                    <View style={styles.navigationContainer}>
                      <TouchableOpacity onPress={previousMode} style={styles.arrowButton}>
                        <View style={{ height: 25, transform: [{ rotate: '180deg' }], justifyContent: "center", alignItems: "center" }} >{<Image source={require("../../assets/images/Seta.png")} style={styles.imageSeta} />}</View>
                      </TouchableOpacity>
                      <View style={styles.modeText}><Text style={styles.buttonText}>{currentMode.name}</Text></View>
                      <TouchableOpacity onPress={nextMode} style={styles.arrowButton}>
                        <View style={{ height: 25}}>{<Image source={require("../../assets/images/Seta.png")} style={styles.imageSeta} />}</View>
                      </TouchableOpacity>
                    </View>
            </View>
          </View>

          <View style={styles.orgQuadro}>
            <View style={styles.quadroinfo}>
              <Text style={styles.infoSystem}>Regular intervalo das informações faladas em segundos:</Text>
              <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={handleChange}
                  keyboardType="numeric"
                  placeholder="Digite um número inteiro"
                />
                <View style={{alignItems: "center", width: "100%"}}>
                <TouchableOpacity style={styles.buttonEnviar} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
     
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  infoSystem: {
    fontSize: width * 0.04,
    marginRight: 15,
    marginBottom: 10,
    color: "#484848"
  },
  quadroinfo: {
    width: "80%",
    backgroundColor: "#D9D4D4",
    borderRadius: 10,
    padding: 20,
    bottom: 0,
  },
  orgQuadro: {
    alignItems: "center",
    paddingBottom: 40,
  },
  progressBar: {
    width: "100%", // Largura da barra de progresso
    height: 30, // Altura da barra de progresso
    backgroundColor: "#e0e0e0", // Cor de fundo da barra de progresso
    borderRadius: 5, // Borda arredondada
    overflow: "hidden", // Garante que a barra de progresso não ultrapasse os limites do contêiner
  },
  progress: {
    height: "100%", // Altura da barra de progresso
  },
  button: {
    width: 60,
    height: 25,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },
  switch: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    position: "absolute",
    top: 2.5,
  },
  switchOn: {
    right: 4,
  },
  switchOff: {
    left: 4,
  },
  buttonOn: {
    backgroundColor: "#001268", // Cor de fundo quando ativado para a direita
    marginRight: 10,
  },
  statusSystem: {
    flexDirection: "row",
  },
  NivelDisp: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  Nivel: {
    marginTop: 8,
    color: "#484848"
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10
  },

  descriptionContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#484848"
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowButton: {
    padding: 10,
    
  },
  arrowText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modeText: {
    width: "70%",
    backgroundColor: "#BCBCBC",
    borderRadius: 25,
    justifyContent: "center",
    alignItems:"center",
    padding: 10
  },
  buttonEnviar:{
    width: "80%",
    backgroundColor: "#BCBCBC",
    borderRadius: 25,
    justifyContent: "center",
    alignItems:"center",
    padding: 10
  },
  buttonText:{
    color: "#484848"
  },
  imageSeta:{
    maxWidth: 20,
    maxHeight: 20
  }
});
