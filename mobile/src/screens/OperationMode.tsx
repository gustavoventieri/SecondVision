import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
	StyleSheet,
	SafeAreaView,
	View,
	ScrollView,
	TextInput,
	Text,
	Dimensions,
	Pressable,
} from "react-native";
import { About } from "../components/About";
import { Header } from "../components/Header";
import { Devices } from "../components/Devices";

const { width } = Dimensions.get("window");

export default function OperationMode() {
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

				<View style={styles.operationMode}>
					<Text style={styles.operationModeTitle}>Modos de Operação:</Text>

					<View
						style={styles.operationCard}
						accessibilityLabel="Modo Híbrido"
						accessibilityHint="Esse modo detecta tanto objetos possivelmente perigosos como textos estáticos."
					>
						<Text style={styles.cardTitle}>Híbrido</Text>
						<Text style={styles.cardText}>
							Esse modo detecta tanto objetos possivelmente perigosos como
							textos estáticos.
						</Text>
					</View>
					<View
						style={styles.operationCard}
						accessibilityLabel="Modo Texto"
						accessibilityHint="Esse modo detecta somente textos estáticos."
					>
						<Text style={styles.cardTitle}>Texto</Text>
						<Text style={styles.cardText}>
							Esse modo detecta somente textos estáticos.
						</Text>
					</View>
					<View
						style={styles.operationCard}
						accessibilityLabel="Modo Objetos"
						accessibilityHint="Esse modo detecta somente os objetos possivelmente perigosos."
					>
						<Text style={styles.cardTitle}>Objetos</Text>
						<Text style={styles.cardText}>
							Esse modo detecta somente os objetos possivelmente perigosos.
						</Text>
					</View>
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
	scrollContent: {
		paddingVertical: 20,
	},
	operationMode: {
		marginHorizontal: 20,
		display: "flex",
		gap: 20,
	},
	operationModeTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingVertical: 15,
	},
	operationModeText: {
		color: "#001268",
	},
	inputOperationMode: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 15,
		padding: 15,
		borderRadius: 10,
		backgroundColor: "#F6F7F8",
		gap: 10,
		borderColor: "#000",
		borderStyle: "solid",
		borderWidth: 1,
	},
	operationModeButton: {
		padding: 15,
		backgroundColor: "#001268",
		borderRadius: 10,
	},
	operationModeButtonText: {
		color: "#F6F7F8",
		textAlign: "center",
	},
	operationCard: {
		flexDirection: "row",
		alignItems: "center",
		height: 80,
		padding: 16,
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
});
