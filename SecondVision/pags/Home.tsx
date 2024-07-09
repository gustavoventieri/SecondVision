import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

import { About } from "@/components/About";
import { Header } from "@/components/Header";
import { Devices } from "@/components/Devices";
import { Dashboard } from "@/components/Dashboard";

const loadFonts = async () => {
  await Font.loadAsync({
    FonteCustomizada: require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
  });
};

export default function Home() {
  const [isOn, setIsOn] = useState(false);
  const [StatusText, setStatusText] = useState("Desligado");

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setStatusText(isOn ? "Desligado" : "Ligado");
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
        colors={["#45A7FF", "#001268"]}
        style={styles.background}
      />
      <Header toggleMenu={toggleMenu} props="Second Vision" />
      <Devices />
      <Dashboard
        toggleSwitch={toggleSwitch}
        isOn={isOn}
        statusText={StatusText}
      />
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
