import React from "react";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BluetoothOffScreen from "./src/screens/BluetoothOff";
import BluetoothOnScreen from "./src/screens/BluetoothOn";
import Home from "./src/screens/Home";
const Stack = createStackNavigator();

enableScreens();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="LoadingScreen">
        <Stack.Screen
          name="BluetoothOff"
          component={BluetoothOffScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BluetoothOn"
          component={BluetoothOnScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
