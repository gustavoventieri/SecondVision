import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AboutProps {
  visible: boolean;
  onClose: () => void;
}

export const About: React.FC<AboutProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[{ position: "absolute" }, { top: 20 }, { left: 20 }]}
          onPress={onClose}
        >
          <Ionicons name="close-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.modalInfo}>
          <Image
            source={require("../assets/images/LogoPreta.png")}
            style={styles.imageSessaoInfo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textInfo}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            tempor libero vitae tortor auctor, eu facilisis ante euismod. In hac
            habitasse platea dictumst. Proin ullamcorper sit amet dolor eget
            efficitur. Fusce ut ante odio. Pellentesque massa orci, rhoncus in
            rhoncus vel, laoreet eu dolor. Nam convallis pharetra urna, in
            laoreet libero consectetur sit amet. Fusce vitae augue vitae lacus
            dictum volutpat et cursus magna. Sed ultrices aliquet lorem, ut
            finibus mauris iaculis ac.
          </Text>
          <Text style={styles.line} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            tempor libero vitae tortor auctor, eu facilisis ante euismod. In hac
            habitasse platea dictumst. Proin ullamcorper sit amet dolor eget
            efficitur. Fusce ut ante odio. Pellentesque massa orci, rhoncus in
            rhoncus vel, laoreet eu dolor. Nam convallis pharetra urna, in
            laoreet libero consectetur sit amet. Fusce vitae augue vitae lacus
            dictum volutpat et cursus magna. Sed ultrices aliquet lorem, ut
            finibus mauris iaculis ac.
          </Text>
          <Text style={styles.line} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            tempor libero vitae tortor auctor, eu facilisis ante euismod. In hac
            habitasse platea dictumst. Proin ullamcorper sit amet dolor eget
            efficitur. Fusce ut ante odio. Pellentesque massa orci, rhoncus in
            rhoncus vel, laoreet eu dolor. Nam convallis pharetra urna, in
            laoreet libero consectetur sit amet. Fusce vitae augue vitae lacus
            dictum volutpat et cursus magna. Sed ultrices aliquet lorem, ut
            finibus mauris iaculis ac.
          </Text>
          <Text style={styles.line} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageSessaoInfo: {
    width: "30%", // Image takes up the full width of the container
    height: undefined,
    aspectRatio: 1.3,
    marginLeft: 10,

    // Opções: 'cover', 'contain', 'stretch', 'repeat', 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f3f3ff",
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
  modalInfo: {
    flexDirection: "row",
    justifyContent: "center",
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginBottom: 10,
    marginTop: 10,
    // Você pode adicionar mais estilos aqui, como margens, etc.
  },
  textInfo: {
    padding: 20,
  },
});
