import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { About } from "../components/About";
import { Devices } from "../components/Devices";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

export default function BluetoothOnScreen() {
  const navigation = useNavigation();
  const [bluetoothState, setBluetoothState] = useState("PoweredOn");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {

    const checkBluetoothState = async () => {
      const state = await BluetoothStateManager.getState();
      setBluetoothState(state);
    };
    checkBluetoothState();

    const backAction = () => {
      // Impede o comportamento padrão do botão de voltar
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const subscription = BluetoothStateManager.onStateChange((state) => {
      setBluetoothState(state);
    }, true);

    return () => {
      subscription.remove();
      backHandler.remove();
    };
  }, []);

  if (bluetoothState != "PoweredOn") navigation.navigate("BluetoothOff");

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
