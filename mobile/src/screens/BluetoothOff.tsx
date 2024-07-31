import React, { useEffect, useState } from "react";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
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
const { width, height } = Dimensions.get("window");



export default function BluetoothOffScreen() {
  const navigation = useNavigation();
  const [bluetoothState, setBluetoothState] = useState("");

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug("BleManager started."))
        .catch((error: any) =>
          console.error("BeManager could not be started.", error)
        );
    } catch (error) {
      console.error("unexpected error starting BleManager.", error);
      return;
    }

    handleAndroidPermissions();

   
  }, []);
  useEffect(() => {
    const checkBluetoothState = async () => {
      const state = await BluetoothStateManager.getState();
      setBluetoothState(state);
    };
    // Ação que faz voltar a tela
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

  if (bluetoothState == "PoweredOn") navigation.navigate("BluetoothOn");

  
  const handleAndroidPermissions = () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then((result) => {
        if (result) {
          console.debug(
            "[handleAndroidPermissions] User accepts runtime permissions android 12+"
          );
        } else {
          console.error(
            "[handleAndroidPermissions] User refuses runtime permissions android 12+"
          );
        }
      });
    } else if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((checkResult) => {
        if (checkResult) {
          console.debug(
            "[handleAndroidPermissions] runtime permission Android <12 already OK"
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((requestResult) => {
            if (requestResult) {
              console.debug(
                "[handleAndroidPermissions] User accepts runtime permission android <12"
              );
            } else {
              console.error(
                "[handleAndroidPermissions] User refuses runtime permission android <12"
              );
            }
          });
        }
      });
    }
  };

  const enableBluetooth = async () => {
    try {
      console.debug("Bluetooth Ativado");
      await BleManager.enableBluetooth();
      navigation.navigate("BluetoothOn");
    } catch (error) {
      console.error("Bluetooth não foi ativado", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#001268", "#45A7FF"]}
        style={styles.background}
      />
      <View>
        <Image
          source={require("../../assets/images/Blue.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textBlue}>
        <Text style={styles.headerText}>Ligar o Bluetooth.</Text>
        <Text style={styles.text}>
          Acesse o centro de controle e ligue o Bluetooth.
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.scanButton} onPress={enableBluetooth}>
          <Text style={styles.scanButtonText}>{"Habilitar Bluetooth"}</Text>
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
  },
  image: {
    width: "100%", // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,
    marginBottom: 60,
    // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  text: {
    fontSize: width * 0.033, 
  },
  headerText: {
    fontSize: width * 0.055, 
    marginBottom: 10,
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
    borderWidth: 2,
    margin: 10,
    borderRadius: 25,
    flex: 1,
    top: 30,
  },
  scanButtonText: {
    fontSize: width * 0.04,
    letterSpacing: 0.25,
    color: "#0a398a",
  },
});
