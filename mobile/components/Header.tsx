import React from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  TextProps,
} from "react-native";
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

  const handleNavigate = () => {
    navigation.navigate("BluetoothOn");
  };

  if (route.name == "BluetoothOn") {
    return (
      <View style={styles.headerOptions}>
        <Pressable onPress={toggleMenu}>
          <Ionicons name="information-circle-outline" size={35} color="white" />
        </Pressable>
        <Text style={styles.textFontOn}>{props}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.headerOptions}>
        <Pressable onPress={toggleMenu}>
          <Ionicons name="information-circle-outline" size={35} color="white" />
        </Pressable>
        <Text style={styles.textFont}>{props}</Text>
        <Pressable onPress={handleNavigate}>
          <Ionicons name="power" size={32} color="white" />
        </Pressable>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    top: 30,
  },
  textFont: {
    fontFamily: "FonteCustomizada",
    fontSize: width * 0.05,
    color: "white",
  },
  textFontOn: {
    fontFamily: "FonteCustomizada",
    fontSize: width * 0.05,
    color: "white",
    right: 95.7,
  },
});
