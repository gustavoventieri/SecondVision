import React, { useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BluetoothOffScreen from "../pags/BluetoothOff";
import BluetoothOnScreen from "../pags/BluetoothOn";
import Home from "../pags/Home";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="LoadingScreen">
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

        <Stack.Screen
          name="BluetoothOff"
          component={BluetoothOffScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
