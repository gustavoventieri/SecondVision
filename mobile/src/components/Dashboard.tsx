import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	SafeAreaView,
	TextInput,
	Alert,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface DashboardProps {
	isOn: boolean;
	statusText: string;
	batteryLevel: number;
	inputValue: string;
	handleChange: (value: string) => void;
	handleSubmit: () => void;
	currentModeIndex: number;
	nextMode: () => void;
	previousMode: () => void;
	currentMode: {
		name: string;
		description: string;
	};
}

export const Dashboard: React.FC<DashboardProps> = ({
	isOn,
	statusText,
	batteryLevel,
	inputValue,
	handleChange,
	handleSubmit,
	currentModeIndex,
	nextMode,
	previousMode,
	currentMode,
}) => {
	let batteryIcon;
	if (batteryLevel === 100) {
		batteryIcon = "battery-full-outline"; // Ícone para bateria cheia
	} else if (batteryLevel >= 50) {
		batteryIcon = "battery-half-outline"; // Ícone para bateria metade
	} else if (batteryLevel >= 30) {
		batteryIcon = "battery-low-outline"; // Ícone para bateria com 30% (você pode ajustar o ícone se desejar)
	} else {
		batteryIcon = "battery-dead-outline"; // Ícone para bateria vazia
	}

	const systemIcon = isOn
		? require("../../assets/images/on_icon.png")
		: require("../../assets/images/off_icon.png");

	return (
		<SafeAreaView>
			<View style={styles.dashboard}>
				<Text style={styles.dashboardTitle} accessibilityRole="header">
					Estatísticas de Uso
				</Text>

				<View style={styles.campos}>
					<View style={styles.info}>
						<Ionicons
							name={batteryIcon}
							size={35}
							color="#001268"
							accessibilityLabel="Ícone da Bateria"
						/>
						<Text style={styles.nivel} accessibilityRole="text">
							{batteryLevel}%
						</Text>
						<Text accessibilityRole="text">Bateria</Text>
					</View>

					<View style={styles.info}>
						<Image
							source={systemIcon}
							style={styles.systemIcon}
							accessibilityLabel={isOn ? "Sistema ligado" : "Sistema desligado"}
						/>
						<Text style={styles.nivel} accessibilityRole="text">
							{isOn ? "Ligado" : "Desligado"}
						</Text>
						<Text accessibilityRole="text">Sistema</Text>
					</View>

					<View style={styles.info}>
						<Image
							source={require("../../assets/images/timer_icon.png")}
							style={styles.systemIcon}
							accessibilityLabel="Ícone do temporizador"
						/>
						<Text style={styles.nivel} accessibilityRole="text">
							5s
						</Text>
						<Text style={styles.category} accessibilityRole="text">
							Intervalo
						</Text>
					</View>
				</View>
				<View style={styles.operationMode}>
					<Text style={styles.dashboardTitle} accessibilityRole="header">
						Modo de Operação
					</Text>
					<View style={styles.operationCard}>
						<Text style={styles.cardTitle} accessibilityRole="text">
							{currentMode.name}
						</Text>
						<Text style={styles.cardText} accessibilityRole="text">
							{currentMode.description}
						</Text>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

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
	dashboard: {
		marginHorizontal: 20,
	},
	dashboardTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingVertical: 15,
	},
	campos: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	info: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	nivel: {
		color: "#001268",
		fontWeight: "900",
		fontSize: width * 0.05,
	},
	category: {
		fontWeight: "light",
	},
	systemIcon: {
		width: 30,
		height: 30,
	},
	operationMode: {
		marginTop: 20,
	},
	operationCard: {
		flexDirection: "row",
		alignItems: "center",
		height: 80,
		padding: 10,
		borderRadius: 5,
		backgroundColor: "#F6F7F8",
		...boxShadow,
	},
	cardTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingHorizontal: 6,
	},
	cardText: {
		fontSize: width * 0.03,
		maxWidth: "80%",
	},
});
