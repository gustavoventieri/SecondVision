import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
	StyleSheet,
	SafeAreaView,
	View,
	ScrollView,
	Text,
	Dimensions,
	Pressable,
} from "react-native";
import { About } from "../components/About";
import { Header } from "../components/Header";
import { Devices } from "../components/Devices";

const { width } = Dimensions.get("window");

export default function Settings() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigation = useNavigation();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Header toggleMenu={toggleMenu} props="Second Vision" />
				<Devices />

				<View style={styles.settings}>
					<Text style={styles.settingsTitle}>Modo de Operação</Text>

					<Pressable
						style={styles.settingsCard}
						onPress={() => navigation.navigate("Interval")} // Use o nome da tela
					>
						<Ionicons name="time-outline" size={35} color="#001268" />
						<Text style={styles.cardText}>Intervalo entre Falas</Text>
					</Pressable>

					<Pressable
						style={styles.settingsCard}
						onPress={() => navigation.navigate("OperationMode")} // Exemplo de outra tela
					>
						<Ionicons name="settings-outline" size={35} color="#001268" />
						<Text style={styles.cardText}>Modos de Operação</Text>
					</Pressable>
				</View>

				<About visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
			</ScrollView>
		</SafeAreaView>
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
	settings: {
		marginTop: 20,
		marginHorizontal: 10,
		display: "flex",
		gap: 15,
	},
	systemIcon: {
		width: 30,
		height: 30,
	},
	settingsTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingVertical: 15,
	},
	settingsCard: {
		flexDirection: "row",
		alignItems: "center",
		height: 80,
		padding: 20,
		borderRadius: 5,
		backgroundColor: "#F6F7F8",
		gap: 10,
		...boxShadow,
	},
	cardTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingHorizontal: 10,
	},
	cardText: {
		fontSize: width * 0.03,
		maxWidth: "80%",
	},
	scrollContent: {
		paddingVertical: 20,
	},
});
