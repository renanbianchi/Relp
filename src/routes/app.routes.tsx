import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import { Home } from "../screens/Home";
import { Details } from "../screens/Details";
import { Register } from "../screens/Register";
import { NewUser } from "../screens/NewUser"
import { Greeting } from '../screens/Greeting';
import { SignIn } from '../screens/SignIn';

const {Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes() {
  return(
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="greeting" component={Greeting} />
      <Screen name="SignIn" component={SignIn} />
      <Screen name="newuser" component={NewUser} />
      <Screen name="home" component={Home} />
      <Screen name="new" component={Register} />
      <Screen name="details" component={Details} />
    </Navigator>
  )
}