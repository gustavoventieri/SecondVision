import React, { useEffect, useState } from "react";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { useNavigation, StackActions } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
  PermissionsAndroid,
  BackHandler,
} from "react-native";
import BleManager from "react-native-ble-manager";
import * as Speech from "expo-speech";

const { width } = Dimensions.get("window");

export default function BluetoothOffScreen() {
  const navigation = useNavigation();
  const [bluetoothState, setBluetoothState] = useState("");

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug("BleManager iniciado."))
        .catch((error: any) =>
          console.error("BeManager nao pode iniciar.", error)
        );
    } catch (error) {
      console.error("erro inesperado ao iniciar o BleManager.", error);
      return;
    }

    handleAndroidPermissions();
    speak("Habilite o Bluetooth no botão abaixo");
  }, []);

  useEffect(() => {
    const checkBluetoothState = async () => {
      const state = await BluetoothStateManager.getState();
      setBluetoothState(state);
    };

    const backAction = () => {
      // Impede o comportamento padrão do botão de voltar
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    checkBluetoothState();

    const subscription = BluetoothStateManager.onStateChange((state) => {
      setBluetoothState(state);
    }, true);

    return () => {
      subscription.remove();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (bluetoothState === "PoweredOn") {
      navigation.dispatch(StackActions.replace("ControlScreen"));
    }
  }, [bluetoothState, navigation]);

  const handleAndroidPermissions = () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then((result) => {
        if (result) {
          console.debug(
            "[handleAndroidPermissions] O usuário aceita permissões de tempo de execução Android 12+"
          );
        } else {
          //console.error( "[handleAndroidPermissions] O usuário recusa permissões de tempo de execução Android 12+");
        }
      });
    } else if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((checkResult) => {
        if (checkResult) {
          console.debug(
            "[handleAndroidPermissions] permissão de tempo de execução Android <12 já está OK"
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((requestResult) => {
            if (requestResult) {
              console.debug(
                "[handleAndroidPermissions] O usuário aceita permissão de execução android <12"
              );
            } else {
              //console.error("[handleAndroidPermissions] Usuário recusa permissão de execução android <12");
            }
          });
        }
      });
    }
  };

  const speak = async (text: string) => {
    Speech.speak(text, {
      language: "pt-BR",
    });
  };

  const enableBluetooth = async () => {
    try {
      console.debug("Bluetooth Ativado");
      await BleManager.enableBluetooth();
     
    } catch (error) {
      console.error("Bluetooth não foi ativado", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/images/device_icon.png")}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Ícone de dispositivo Bluetooth"
          accessibilityHint="Imagem que representa a função de habilitar o Bluetooth"
        />
      </View>
      <View style={styles.textBlue}>
        <Text style={styles.headerText} accessibilityRole="header">
          Ligar o Bluetooth.
        </Text>
        <Text style={styles.text}>
          Acesse o centro de controle e ligue o Bluetooth.
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.scanButton}
          onPress={enableBluetooth}
          accessibilityLabel="Habilitar Bluetooth"
          accessibilityHint="Toque para ativar o Bluetooth e acessar a tela de controle"
          accessibilityRole="button"
        >
          <Text style={styles.scanButtonText}>Habilitar Bluetooth</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.3,
    marginBottom: 60,
  },
  text: {
    fontSize: width * 0.044,
    fontWeight: "medium",
  },
  headerText: {
    fontSize: width * 0.055,
    marginBottom: 10,
    color: "#0A398A",
    fontWeight: "medium",
  },
  textBlue: {
    width: "100%",
    paddingLeft: 40,
    bottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    width: "70%",
  },
  scanButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: "#0a398a",
    backgroundColor: "#0A398A",
    borderWidth: 2,
    margin: 10,
    borderRadius: 10,
    flex: 1,
    top: 30,
  },
  scanButtonText: {
    fontSize: width * 0.04,
    letterSpacing: 0.25,
    color: "#fff",
  },
});