import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/Home";
import SettingsScreen from "./src/screens/Settings";
import ControlScreen from "./src/screens/ControlScreen";
import BluetoothOffScreen from "./src/screens/BluetoothOff";
import BluetoothOnScreen from "./src/screens/BluetoothOn";
import IntervalScreen from "./src/screens/Interval";
import OperationModeScreen from "./src/screens/OperationMode";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="ControlScreen">
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
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
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
        name="Interval"
        component={IntervalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OperationMode"
        component={OperationModeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Componente principal
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
