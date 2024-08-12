import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Image, Dimensions, StyleSheet,TouchableHighlight } from "react-native";
const { width } = Dimensions.get("window");
export function Devices() {
  const route = useRoute();

  if (route.name == "BluetoothOn") {
    return (
      <View style={styles.titulo}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.image}
          resizeMode="contain"
        />

        
      </View>
    );
  } else {
    return (
      <View style={styles.titulo}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.dispositivo}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: "60%", 
    height: undefined,
    aspectRatio: 1.3,

   
  },
  titulo: {
    justifyContent: "center",
    alignItems: "center",
  },
  dispositivo: {
    width: width * 0.5, 
    height: width * 0.5, 
    borderRadius: (width * 0.5) / 2, 
    backgroundColor: "white", 
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
  },

  
});
