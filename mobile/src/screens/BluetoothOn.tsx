import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

import { About } from "../components/About";
import { Devices } from "../components/Devices";
import { Header } from "../components/Header";

const loadFonts = async () => {
  await Font.loadAsync({
    FonteCustomizada: require("../../assets/fonts/Poppins-Medium.ttf"),
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
        colors={["#45A7FF", "#001268"]}
        style={styles.background}
      />
      <Header toggleMenu={toggleMenu} props="Meus Dispositvos" />
      <Devices />
      <View />
      <View />

      <About visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
