import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, BackHandler, Alert, Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, SafeAreaView, ScrollView, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { About } from "../components/About";
import { Header } from "../components/Header";
import { Devices } from "../components/Devices";
import { Dashboard } from "../components/Dashboard";
import { useNavigation } from "@react-navigation/native";
import * as Speech from 'expo-speech';
import BleManager, { BleScanCallbackType, BleScanMatchMode, BleScanMode, Peripheral, PeripheralInfo, BleDisconnectPeripheralEvent, BleManagerDidUpdateValueForCharacteristicEvent } from "react-native-ble-manager";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Buffer } from 'buffer';


const loadFonts = async () => {
  await Font.loadAsync({
    FonteCustomizada: require("../../assets/fonts/Poppins-SemiBoldItalic.ttf"),
  });
};

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
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
  const [inputValue, setInputValue] = useState('');
  const [inputValueInt, setInputValueInt] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(80);
  const [currentModeIndex, setCurrentModeIndex] = useState(0);
  const [peripherals, setPeripherals] = useState(new Map<Peripheral['id'], Peripheral>());
  const [yoloResults, setYoloResults] = useState('');
  const [tesseractResults, setTesseractResults] = useState('');
  const specificMacAddress = '50:2F:9B:AA:B9:27';

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const speak = async (text: string, delayValue: number) => {
    Speech.speak(text, {
      language: 'pt-BR'
    });
    await delay(delayValue);
  };

  const handleDisconnectedPeripheral = (event: BleDisconnectPeripheralEvent) => {
    console.debug(`[handleDisconnectedPeripheral][${event.peripheral}] desconectado.`);
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });

    if (event.peripheral === specificMacAddress) {
      navigation.navigate("BluetoothOn");
    }
  };

  const handleUpdateValueForCharacteristic = (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
    const dataYOLOPY = Buffer.from(data.value).toString('utf-8');
    setNotificationData(dataYOLOPY);
    console.log(`[Notificacao] ${data}`);

    console.debug(`[handleUpdateValueForCharacteristic] recebendo data de '${data.peripheral}' com characteristic='${data.characteristic}' e value='${data.value}'`);

    resetTimer(); //Reinicia o temporizador sempre que novos dados são recebidos
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Define um temporizador de 10 segundos
    timerRef.current = setTimeout(() => {
      Alert.alert('Conexão perdida', 'O servidor GATT parou de enviar dados.');
      console.log('TemporizadorAcabou')
    }, 10000);
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] Nenhum periferico encontrado.');
        return;
      }

      

      for (let peripheral of connectedPeripherals) {
        setPeripherals((map) => {
          return new Map(map.set(peripheral.id, peripheral));
        })
        peripheral.connecting = false;
        peripheral.connected = true;
        
      }
     
    } catch (error) {
      console.error('[retrieveConnected] incapaz de recuperar periféricos conectados.', error);
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
    retrieveConnected();
    
    let services = await retrieveServices();
    try{
    
    for (let peripheralInfo of services) {
     
      peripheralInfo.characteristics?.forEach(async c => {
        try {
          const value = await BleManager.read(peripheralInfo.id, c.service, c.characteristic);
          const result = Buffer.from(value).toString('utf-8');

          if (c.characteristic === '12345678-1234-5678-1234-56789abcdef1') {
            setYoloResults(result);
            console.log("YOLO Resultados:", result);
          } else if (c.characteristic === '12345678-1234-5678-1234-56789abcdef2') {
            setTesseractResults(result);
            console.log("Tesseract Resultados:", result);
          }
         
          
        } catch (error) {
          console.error("[readCharacteristics]", "Característica de erro de leitura", error);
        }
      });
    }}catch(error){
      console.error("[readCharacteristics]", "Característica de erro de leitura", error);
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
          console.log('Notificacao iniciada');
        } catch (error) {
          console.error('Erro na notificacao', error);
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
          console.debug("[handleAndroidPermissions] O usuário aceita permissões de tempo de execução Android 12+");
        } else {
          console.error("[handleAndroidPermissions] O usuário recusa permissões de tempo de execução Android 12+");
        }
      });
    } else if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((checkResult) => {
        if (checkResult) {
          console.debug("[handleAndroidPermissions] permissão de tempo de execução Android <12 já está OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((requestResult) => {
            if (requestResult) {
              console.debug("[handleAndroidPermissions] O usuário aceita permissão de execução android <12");
            } else {
              console.error("[handleAndroidPermissions] Usuário recusa permissão de execução android <12");
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug('BleManager iniciado.'))
        .catch((error: any) => console.error('BeManager no pode iniciar.', error));
    } catch (error) {
      console.error('erro inesperado ao iniciar o BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
    ];

    handleAndroidPermissions();
    startNotification(); // Inicie a notificação quando o componente for montado

   
    const intervalId = setInterval(() => {
      readCharacteristics();
    }, 5500);

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
      if (timerRef.current) {
       clearTimeout(timerRef.current);
      }
      console.log('saiu')
    };

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
    return null; 
  }

  const handleChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
    setInputValueInt(parseInt(inputValue, 10) * 1000);
  };

  const handleSubmit = () => {
    const integerValue = parseInt(inputValue, 10);
    if (!isNaN(integerValue)) {
      Alert.alert('Valor inserido', `O valor digitado é: ${integerValue}`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número inteiro válido.');
    }
  };

  const nextMode = () => {
    setCurrentModeIndex((currentModeIndex + 1) % modes.length);
  };

  const previousMode = () => {
    setCurrentModeIndex((currentModeIndex - 1 + modes.length) % modes.length);
  };

  const modes = [
    {
      name: "Híbrido",
      description: "Esse modo detecta tanto objetos possivelmente perigosos como textos estáticos."
    },
    {
      name: "Texto",
      description: "Esse modo detecta apenas textos estáticos."
    },
    {
      name: "Objetos",
      description: "Esse modo detecta apenas objetos possivelmente perigosos."
    }
  ];

  const currentMode = modes[currentModeIndex];

  return (
    
    <SafeAreaView style={styles.container}>
      
      <LinearGradient
        colors={["#45A7FF", "#001268"]}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      
        <Header toggleMenu={toggleMenu} props="Second Vision" sendShutdownCommand={sendShutdownCommand} />
        <Devices />
        <Dashboard
          toggleSwitch={toggleSwitch}
          isOn={isOn}
          statusText={StatusText}
          batteryLevel={batteryLevel}
          inputValue={inputValue}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          currentModeIndex={currentModeIndex}
          nextMode={nextMode}
          previousMode={previousMode}
          currentMode={currentMode}
          readCharacteristics={readCharacteristics}
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
