import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import { Home } from "../screens/Home";
import { Details } from "../screens/Details";
import { Register } from "../screens/Register";
import { NewUser } from "../screens/NewUser"

const {Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes() {
  return(
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="home" component={Home} />
      <Screen name="new" component={Register} />
      <Screen name="details" component={Details} />
      <Screen name="NewUser" component={NewUser} />
    </Navigator>
  )
}