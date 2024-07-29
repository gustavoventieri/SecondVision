import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const batteryLevel = 80;
const { width } = Dimensions.get("window");

interface DashboardProps {
  toggleSwitch: () => void;
  isOn: boolean;
  statusText: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  toggleSwitch,
  isOn,
  statusText,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  infoSystem: {
    fontSize: width * 0.04,
    marginRight: 15,
    marginBottom: 10,
  },
  quadroinfo: {
    width: "80%",
    backgroundColor: "#D9D4D4",
    borderRadius: 10,
    padding: 20,
    bottom: 140,
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
    marginTop: 4,
    color: "white",
  },
});
