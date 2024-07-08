import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, NavigationContainerRef  } from '@react-navigation/native';
import { createStackNavigator  } from '@react-navigation/stack';
import {  BleManager, State as BleState  } from 'react-native-ble-plx';
import BluetoothOffScreen from '../pags/BluetoothOff';
import BluetoothOnScreen from '../pags/BluetoothOn';
import Home from '../pags/Home';


const Stack = createStackNavigator();


const App = () => {
  
  return (
    //<Stack.Screen  name="BluetoothOnScreen" component={BluetoothOnScreen} options={{headerShown: false}} />
    //<Stack.Screen name="BluetoothOffScreen" component={BluetoothOffScreen} options={{headerShown: false}} />
    <NavigationContainer independent={true} >
      <Stack.Navigator initialRouteName="LoadingScreen">
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;