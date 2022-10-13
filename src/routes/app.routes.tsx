import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Routes } from '.'
import { Home } from '../screens/Home'
import { Details } from '../screens/Details'
import { Register } from '../screens/Register'
import { NewUser } from '../screens/NewUser'
import { Greeting } from '../screens/Greeting'
import { SignIn } from '../screens/SignIn'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes(Routes: any) {
  return (
    <Navigator
      initialRouteName={Routes.user ? 'home' : 'greeting'}
      screenOptions={{ headerShown: false }}
    >
      <Screen name="home" component={Home} />
      <Screen name="details" component={Details} />
      <Screen name="new" component={Register} />
      <Screen name="greeting" component={Greeting} />
      <Screen name="newuser" component={NewUser} />
      <Screen name="signin" component={SignIn} />
    </Navigator>
  )
}
