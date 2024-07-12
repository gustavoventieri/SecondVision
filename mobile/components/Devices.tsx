import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Image, Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");
export function Devices() {
  const route = useRoute();

  if (route.name == "BluetoothOn") {
    return (
      <View style={styles.titulo}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.dispositivoOn}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.titulo}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.dispositivo}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: "60%", // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,

    // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  titulo: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
  },
  dispositivo: {
    width: width * 0.5, // Largura do círculo como metade da largura da tela
    height: width * 0.5, // Altura do círculo como metade da largura da tela
    borderRadius: (width * 0.5) / 2, // Metade da largura para formar um círculo
    backgroundColor: "white", // Cor de fundo branca
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -29,
  },

  // Quando está na pagina BluetoothOn
  dispositivoOn: {
    width: width * 0.5, // Largura do círculo como metade da largura da tela
    height: width * 0.5, // Altura do círculo como metade da largura da tela
    borderRadius: (width * 0.5) / 2, // Metade da largura para formar um círculo
    backgroundColor: "white", // Cor de fundo branca
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
});
