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

export default function Interval() {
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

				<View style={styles.interval}>
					<Text style={styles.intervalTitle}>Estatísticas de Uso</Text>

					<Text style={styles.intervalText}>
						Regule o intervalo entre as falas emitidas após Second Vision
						efetuar a detecção
					</Text>

					<TextInput
						style={styles.inputInterval}
						// onChangeText={}
						// value={}
						placeholder="Intervalo entre Falas"
						keyboardType="numeric"
					/>

					<Pressable style={styles.intervalButton}>
						<Text style={styles.intervalButtonText}>Salvar</Text>
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
	scrollContent: {
		paddingVertical: 20,
	},
	interval: {
		marginHorizontal: 20,
	},
	intervalTitle: {
		color: "#001268",
		fontWeight: "800",
		fontSize: width * 0.04,
		paddingVertical: 15,
	},
	intervalText: {
		color: "#001268",
	},
	inputInterval: {
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
	intervalButton: {
		padding: 10,
		backgroundColor: "#001268",
		borderRadius: 10,
	},
	intervalButtonText: {
		color: "#F6F7F8",
		textAlign: "center",
	},
});
