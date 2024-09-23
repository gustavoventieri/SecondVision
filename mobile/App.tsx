import * as React from "react";
import { useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/Home";
import ControlScreen from "./src/screens/ControlScreen";
import BluetoothOffScreen from "./src/screens/BluetoothOff";
import BluetoothOnScreen from "./src/screens/BluetoothOn";
import IntervalScreen from "./src/screens/Interval";
import OperationModeScreen from "./src/screens/OperationMode";
import TermsScreen from "./src/screens/TermsScreen";
import { Ionicons } from "@expo/vector-icons";
import { Splash } from "./src/screens/Splash";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator para telas com o footer
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Intervalo"
        component={IntervalScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Modo de Operação"
        component={OperationModeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator para telas sem o footer
function NonTabStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ControlScreen"
        component={ControlScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BluetoothOff"
        component={BluetoothOffScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BluetoothOn"
        component={BluetoothOnScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator principal
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="ControlScreen">
      <Stack.Screen
        name="ControlScreen"
        component={NonTabStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Componente principal
export default function App() {
  const [splashComplete, setSplashComplete] = useState(false)

  return (
    splashComplete
      ? <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      : <Splash onComplete={setSplashComplete} />
  );
}