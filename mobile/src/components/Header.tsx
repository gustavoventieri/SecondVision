import React from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface HeaderProps {
  toggleMenu: () => void;
  props: string;
  sendShutdownCommand: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, props, sendShutdownCommand }) => {
  const navigation = useNavigation();
  const route = useRoute();

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
        <Pressable onPress={sendShutdownCommand}>
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
    top: 5,
  },
  textFont: {
    fontWeight: "bold",
    fontSize: width * 0.05,
    color: "white",
  },
  textFontOn: {
    fontWeight: "bold",
    fontSize: width * 0.05,
    color: "white",
    right: width * 0.27,
  },
});
