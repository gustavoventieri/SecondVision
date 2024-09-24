import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	BackHandler,
	NativeEventEmitter,
	NativeModules,
	Platform,
	PermissionsAndroid,
	TouchableHighlight,
	SafeAreaView,
	StatusBar,
	Text,
	Pressable,
	FlatList,
	Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { About } from "../components/About";
import { Devices } from "../components/Devices";
import { Header } from "../components/Header";
import { useNavigation, StackActions } from "@react-navigation/native";
import BleManager, {
	BleScanCallbackType,
	BleScanMatchMode,
	BleScanMode,
	Peripheral,
} from "react-native-ble-manager";
import * as Speech from "expo-speech";
declare module "react-native-ble-manager" {
	interface Peripheral {
		connected?: boolean;
		connecting?: boolean;
	}
}
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function BluetoothOnScreen() {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [bluetoothState, setBluetoothState] = useState("PoweredOn");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [BackColor, setBackColor] = useState("#FFFFFF");
	const [searchPerformed, setSearchPerformed] = useState(false);

	//Lógica do scan
	const [isScanning, setIsScanning] = useState(false);
	const [peripherals, setPeripherals] = useState(
		new Map<Peripheral["id"], Peripheral>()
	);
	const SECONDS_TO_SCAN_FOR = 5;
	const SERVICE_UUIDS: string[] = [];
	const ALLOW_DUPLICATES = true;

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const startScan = () => {
		if (!isScanning) {
			setPeripherals(new Map<Peripheral["id"], Peripheral>());
			setSearchPerformed(true);

			try {
				PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				]).then((result) => {
					if (
						result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
							"granted" &&
						result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
							"granted"
					) {
						console.debug("[handleAndroidPermissions] Permissao concedida.");
					}
				});

				PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				).then((result) => {
					if (result === "granted") {
						console.debug(
							"[handleAndroidPermissions] Permissão de localização concedida."
						);
					}
				});

				console.debug("[startScan] iniciando verificação...");
				setIsScanning(true);
				BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
					matchMode: BleScanMatchMode.Sticky,
					scanMode: BleScanMode.LowLatency,
					callbackType: BleScanCallbackType.AllMatches,
				})
					.then(() => {
						console.debug(
							"[startScan] promess de digitalização retornada com sucesso."
						);
					})
					.catch((err: any) => {
						console.error("[startScan] verificação ble retornou com erro", err);
					});
			} catch (error) {
				console.error(
					"[startScan] erro de verificação impossível gerado",
					error
				);
			}
		}
	};

	const handleDiscoverPeripheral = (peripheral: Peripheral) => {
		console.debug(
			"[handleDiscoverPeripheral] novo periférico BLE =",
			peripheral
		);
		if (peripheral.id === "D8:3A:DD:D5:49:E8") {
			setPeripherals((map) => {
				return new Map(map.set(peripheral.id, peripheral));
			});
		}
	};

	const togglePeripheralConnection = async (peripheral: Peripheral) => {
		if (peripheral && peripheral.connected) {
			try {
				await BleManager.disconnect(peripheral.id);
				setBackColor("#FFFFFF");
			} catch (error) {
				console.error(
					`[togglePeripheralConnection][${peripheral.id}] erro ao tentar desconectar o dispositivo.`,
					error
				);
			}
		} else {
			await connectPeripheral(peripheral);
		}
	};

	const connectPeripheral = async (peripheral: Peripheral) => {
		try {
			if (peripheral) {
				setPeripherals((map) => {
					let p = map.get(peripheral.id);
					if (p) {
						p.connecting = true;
						return new Map(map.set(p.id, p));
					}
					return map;
				});

				await BleManager.connect(peripheral.id);

				console.debug(`[connectPeripheral][${peripheral.id}] conectado.`);

				setPeripherals((map) => {
					let p = map.get(peripheral.id);
					if (p) {
						p.connecting = false;
						p.connected = true;
						return new Map(map.set(p.id, p));
					}
					return map;
				});

				await sleep(900);

				const peripheralData = await BleManager.retrieveServices(peripheral.id);
				console.debug(
					`[connectPeripheral][${peripheral.id}] serviços periféricos recuperados`,
					peripheralData
				);

				setPeripherals((map) => {
					let p = map.get(peripheral.id);
					if (p) {
						return new Map(map.set(p.id, p));
					}
					return map;
				});

				const rssi = await BleManager.readRSSI(peripheral.id);
				console.debug(
					`[connectPeripheral][${peripheral.id}] valor RSSI atual recuperado: ${rssi}.`
				);

				if (peripheralData.characteristics) {
					for (let characteristic of peripheralData.characteristics) {
						if (characteristic.descriptors) {
							for (let descriptor of characteristic.descriptors) {
								try {
									let data = await BleManager.readDescriptor(
										peripheral.id,
										characteristic.service,
										characteristic.characteristic,
										descriptor.uuid
									);
									console.debug(
										`[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor lido:`,
										data
									);
								} catch (error) {
									console.error(
										`[connectPeripheral][${peripheral.id}] falha ao retornar o descriptor ${descriptor} para characteristic ${characteristic}:`,
										error
									);
								}
							}
						}
					}
				}

				setPeripherals((map) => {
					let p = map.get(peripheral.id);
					if (p) {
						p.rssi = rssi;
						return new Map(map.set(p.id, p));
					}
					return map;
				});

				navigation.navigate("TabNavigator");



			}
		} catch (error) {
			console.error(
				`[connectPeripheral][${peripheral.id}] erro ao conectar no periferico`,
				error
			);
		}
	};

	function sleep(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}
	const handleConnectPeripheral = (event: any) => {
		console.log(`[handleConnectPeripheral][${event.peripheral}] conectado.`);
	};

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
					//console.error("[handleAndroidPermissions] O usuário recusa permissões de tempo de execução Android 12+");
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

	const handleStopScan = () => {
		setIsScanning(false);
		if (peripherals.size === 0) { // Verifica se o Map está vazio
			speak(`Nenhum periférico encontrado, em caso de dúvida acesse o tutorial no menu de informações do cabeçalho.`);
		}
		console.debug("[handleStopScan] Escaneador parou.");
	};

	useEffect(() => {
		try {
			BleManager.start({ showAlert: false })
				.then(() => console.debug("BleManager iniciado."))
				.catch((error: any) =>
					console.error("BeManager nao pode ser iniciado.", error)
				);
		} catch (error) {
			console.error("erro inesperado ao iniciar o BleManager.", error);
			return;
		}

		const listeners = [
			bleManagerEmitter.addListener(
				"BleManagerDiscoverPeripheral",
				handleDiscoverPeripheral
			),
			bleManagerEmitter.addListener("BleManagerStopScan", handleStopScan),
			bleManagerEmitter.addListener(
				"BleManagerConnectPeripheral",
				handleConnectPeripheral
			),
		];

		handleAndroidPermissions();

		return () => {
			console.debug(
				"[app] desmontagem do componente principal. Removendo listeners..."
			);
			for (const listener of listeners) {
				listener.remove();
			}
		};
	}, []);

	const renderItem = ({ item }: { item: Peripheral }) => {
		item.connected ? setBackColor("#45A7FF") : setBackColor("#FFFFFF");
		const backgroundColor = BackColor;

		return (
			<TouchableHighlight
				underlayColor="#0082FC"
				onPress={() => togglePeripheralConnection(item)}
			>
				<View style={[styles.row, { backgroundColor }]}>
					<Ionicons name="bluetooth-outline" size={30} color={"#0A398A"} />
					<Text style={styles.peripheralName}>
						{item.name || "Sem nome"}
						{item.connecting && " - Conectando..."}
					</Text>
				</View>
			</TouchableHighlight>
		);
	};
	const sendShutdownCommand = () => {};

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

		speak(`Clique no botão de escanear para localizar o seu Second Vision`);

		return () => {
			subscription.remove();
			backHandler.remove();
		};
	}, []);

	useEffect(() => {
		if (bluetoothState != "PoweredOn") {
			navigation.dispatch(StackActions.replace("ControlScreen"));
		}
	}, [bluetoothState, navigation]);

	return (
		<View style={styles.container}>
			<Header
				toggleMenu={toggleMenu}
				props="Meus Dispositivos"
				sendShutdownCommand={sendShutdownCommand}
			/>
			<Devices />
			<View />
			<>
				<StatusBar />
				<SafeAreaView style={styles.body}>
					<View style={styles.buttonGroup}>
						<Pressable
							style={styles.scanButton}
							onPress={startScan}
							accessible
							accessibilityLabel={
								isScanning ? "Parar escaneamento" : "Iniciar escaneamento"
							}
							accessibilityHint="Clique aqui para iniciar ou parar o escaneamento de dispositivos Bluetooth."
						>
							<Text style={styles.scanButtonText}>
								{isScanning ? "Escaneando..." : "Escanear Bluetooth"}
							</Text>
						</Pressable>
					</View>

					{searchPerformed && Array.from(peripherals.values()).length === 0 && (
						<View style={styles.row}>
							<Text style={styles.noPeripherals}>
								Sem periféricos, pressione "Escanear" para encontrar ou acesse o
								menu de informações no canto superior esquerdo da tela para
								receber um tutorial de como utilizar o sistema.
							</Text>
						</View>
					)}

					<FlatList
						data={Array.from(peripherals.values())}
						contentContainerStyle={{ rowGap: 12 }}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				</SafeAreaView>
			</>
			<View />

			<About visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</View>
	);
}

const boxShadow = {
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5,
};

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
	body: {
		flex: 1,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		height: 90,
		marginHorizontal: 10,
		borderRadius: 5,
		backgroundColor: "#F6F7F8",
		...boxShadow,
	},
	noPeripherals: {
		margin: 5,
		textAlign: "center",
	},
	buttonGroup: {
		flexDirection: "row",
		width: "100%",
	},
	scanButton: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: "#0a398a",
		margin: 10,
		borderRadius: 12,
		flex: 1,
		...boxShadow,
	},
	scanButtonText: {
		fontSize: 16,
		letterSpacing: 0.25,
		color: "#FFFFFF",
	},
	peripheralName: {
		fontSize: 16,
		textAlign: "center",
	},
});
