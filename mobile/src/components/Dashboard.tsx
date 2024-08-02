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

const { width } = Dimensions.get("window");

interface DashboardProps {
  toggleSwitch: () => void;
  readCharacteristics: () => void;
  isOn: boolean;
  statusText: string;
  batteryLevel: number;
  inputValue: string;
  handleChange: (value: string) => void;
  handleSubmit: () => void;
  currentModeIndex: number;
  nextMode: () => void;
  previousMode: () => void;
  currentMode: {
    name: string;
    description: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({
  toggleSwitch,
  readCharacteristics,
  isOn,
  statusText,
  batteryLevel,
  inputValue,
  handleChange,
  handleSubmit,
  currentModeIndex,
  nextMode,
  previousMode,
  currentMode,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.orgQuadro}>
        <View style={styles.quadroinfo}>
          <View style={styles.statusSystem}>
            <Text style={styles.infoSystem}>Status do sistema:</Text>

            <View
              style={[styles.button, isOn ? styles.buttonOn : null]}
              
            >
              <View
                style={[styles.switch, isOn ? styles.switchOn : styles.switchOff]}
              />
            </View>
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
          <TouchableOpacity onPress={readCharacteristics}><View style={{height: 100}}><Text style={{fontSize: 20}} >Aqui</Text></View></TouchableOpacity>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{currentMode.description}</Text>
          </View>
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={previousMode} style={styles.arrowButton}>
              <View style={{ height: 25, transform: [{ rotate: '180deg' }], justifyContent: "center", alignItems: "center" }} >
                <Image source={require("../../assets/images/Seta.png")} style={styles.imageSeta} />
              </View>
            </TouchableOpacity>
            <View style={styles.modeText}>
              <Text style={styles.buttonText}>{currentMode.name}</Text>
            </View>
            <TouchableOpacity onPress={nextMode} style={styles.arrowButton}>
              <View style={{ height: 25 }}>
                <Image source={require("../../assets/images/Seta.png")} style={styles.imageSeta} />
              </View>
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
          <View style={{ alignItems: "center", width: "100%" }}>
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
    alignItems: "center",
    padding: 10
  },
  buttonEnviar: {
    width: "80%",
    backgroundColor: "#BCBCBC",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  buttonText: {
    color: "#484848"
  },
  imageSeta: {
    maxWidth: 20,
    maxHeight: 20
  }
});