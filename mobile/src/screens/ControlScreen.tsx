import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { useNavigation, StackActions } from "@react-navigation/native";
import { BackHandler } from "react-native";



export default function ControlScreen() {
  const [bluetoothState, setBluetoothState] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkBluetoothState = async () => {
      const state = await BluetoothStateManager.getState();
      setBluetoothState(state); // Atualiza o estado imediatamente após a leitura
      console.log("Estado inicial do Bluetooth:", state);
    };

    const backAction = () => {
      return true; // Impede o comportamento padrão do botão de voltar
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    checkBluetoothState();

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Verificando o estado do Bluetooth para navegação:", bluetoothState);
    if (bluetoothState === "PoweredOn") {
      navigation.dispatch(
        StackActions.replace('BluetoothOn')
      );
     
    } else if (bluetoothState === "PoweredOff") {
      navigation.dispatch(
        StackActions.replace('BluetoothOff')
      );
      
    }
  }, [bluetoothState, navigation]);

  return (
    <View>
      <Text>Verificando o estado do Bluetooth...</Text>
    </View>
  );
}
