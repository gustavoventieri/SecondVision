import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, BackHandler,Alert, Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, SafeAreaView, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

import { About } from "../components/About";
import { Header } from "../components/Header";
import { Devices } from "../components/Devices";
import { Dashboard } from "../components/Dashboard";
import { useNavigation } from "@react-navigation/native";

import * as Speech from 'expo-speech'


import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
  PeripheralInfo,
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent
} from "react-native-ble-manager";

const loadFonts = async () => {
  await Font.loadAsync({
    FonteCustomizada: require("../../assets/fonts/Poppins-SemiBoldItalic.ttf"),
  });
};

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

export default function Home() {
  const [notificationData, setNotificationData] = useState("");
  const navigation = useNavigation();
  const [isOn, setIsOn] = useState(false);
  const [StatusText, setStatusText] = useState("Desligado");
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [yoloResults, setYoloResults] = useState('');
  const [tesseractResults, setTesseractResults] = useState('');
  const specificMacAddress = '50:2F:9B:AA:B9:27';

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const speak = async (text: string) => {
    Speech.speak(text, {
        language: 'pt-BR'
    });

    await delay(2000);
    //2000 deve ser substituido pela varivael use state do input do dashboard
  };


  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
     // Verifique se o periférico desconectado é o específico
     if (event.peripheral === specificMacAddress) {
      navigation.navigate("BluetoothOn");
    }
  };


  const handleUpdateValueForCharacteristic = (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
    const dataYOLOPY = Buffer.from(data.value).toString('utf-8');
      setNotificationData(dataYOLOPY);
      console.log(`[Notification] ${data}`);

    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };


  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected]', connectedPeripherals.length, 'connectedPeripherals',
        connectedPeripherals,
      );

      for (let peripheral of connectedPeripherals) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };


  const retrieveServices = async () => {
    const peripheralInfos: PeripheralInfo[] = [];
    for (let [peripheralId, peripheral] of peripherals) {
      if (peripheral.connected) {
        const newPeripheralInfo = await BleManager.retrieveServices(peripheralId);
        peripheralInfos.push(newPeripheralInfo);
      }
    }
    return peripheralInfos;
  };

  const readCharacteristics = async () => {
    let services = await retrieveServices();

    for (let peripheralInfo of services) {
      peripheralInfo.characteristics?.forEach(async c => {
        try {
          const value = await BleManager.read(peripheralInfo.id, c.service, c.characteristic);
          const result = Buffer.from(value).toString('utf-8');
          
          if (c.characteristic === '12345678-1234-5678-1234-56789abcdef1') {
            setYoloResults(result);
            console.log("YOLO Results:", result);
          } else if (c.characteristic === '12345678-1234-5678-1234-56789abcdef2') {
            setTesseractResults(result);
            console.log("Tesseract Results:", result);
          }

          console.log("[readCharacteristics]", "peripheralId", peripheralInfo.id, "service", c.service, "char", c.characteristic, "\n\tvalue", result);
        } catch (error) {
          console.error("[readCharacteristics]", "Error reading characteristic", error);
        }
      });
    }
  };


const startNotification = async () => {
  let services = await retrieveServices();

  for (let peripheralInfo of services) {
    peripheralInfo.characteristics?.forEach(async c => {
      try {
        await BleManager.startNotification(
          peripheralInfo.id,
          c.service,
          c.characteristic
        );
        console.log('Notification started');
      } catch (error) {
        console.error('Notification error', error);
      }
    });
  }
};


const sendShutdownCommand = async () => {

  let services = await retrieveServices();

  for (let peripheralInfo of services) {
    peripheralInfo.characteristics?.forEach(async c => {
      try {
        const data = [0x01]; // Comando de desligamento
        await BleManager.write(peripheralInfo.id, c.service, c.characteristic, data);
        Alert.alert('Desligamento', 'Comando de desligamento enviado');
     
      } catch (error) {
        console.error('Erro ao enviar comando de desligamento', error);
        Alert.alert('Erro', 'Não foi possível enviar o comando de desligamento');
      }
    });
  }
};

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


useEffect(() => {
  try {
    BleManager.start({ showAlert: false })
      .then(() => console.debug('BleManager started.'))
      .catch((error: any) =>
        console.error('BeManager could not be started.', error),
      );
  } catch (error) {
    console.error('unexpected error starting BleManager.', error);
    return;
  }

  const listeners = [
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    ),
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    ),
  ];

  handleAndroidPermissions();

  return () => {
    console.debug('[app] main component unmounting. Removing listeners...');
    for (const listener of listeners) {
      listener.remove();
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#45A7FF", "#001268"]}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      
      <Header toggleMenu={toggleMenu} props="Second Vision" />
      <Devices />
      <Dashboard
        toggleSwitch={toggleSwitch}
        isOn={isOn}
        statusText={StatusText}
      />
      <About visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
