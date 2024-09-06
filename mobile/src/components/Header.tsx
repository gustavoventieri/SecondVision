import React from "react";
import { Text, View, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface HeaderProps {
	toggleMenu: () => void;
	props: string;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, props }) => {
	const navigation = useNavigation();
	const route = useRoute();

	if (route.name == "BluetoothOn") {
		return (
			<View style={styles.headerOptions}>
				<Pressable
					onPress={toggleMenu}
					style={styles.information}
					accessibilityLabel="Abrir menu de informações"
					accessibilityRole="button"
				>
					<Ionicons
						name="information-circle-outline"
						size={35}
						color="#001268"
					/>
				</Pressable>
				<Text style={styles.textFontOn}>{props}</Text>
			</View>
		);
	} else {
		return (
			<View style={styles.headerOptions}>
				<Pressable
					onPress={toggleMenu}
					style={styles.information}
					accessibilityLabel="Abrir menu de informações"
					accessibilityRole="button"
				>
					<Ionicons
						name="information-circle-outline"
						size={35}
						color="#001268"
						style={styles.information2}
					/>
				</Pressable>
				<Text style={styles.textFont}>{props}</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	headerOptions: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		top: 5,
	},
	information: {
		alignSelf: "flex-start",
	},
	information2: {
		alignSelf: "flex-start",
	},
	textFont: {
		margin: "auto",
		fontWeight: "bold",
		fontSize: width * 0.05,
		color: "#001268",
	},
	textFontOn: {
		margin: "auto",
		fontWeight: "bold",
		fontSize: width * 0.05,
		color: "#001268",
	},
});
