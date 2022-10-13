import React, { useState, useEffect } from 'react'
import { Loading } from '../components/Loading'
import { NavigationContainer } from '@react-navigation/native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { navigationRef } from './RootNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AppRoutes } from './app.routes'
import { Home } from '../screens/Home'

import { Details } from '../screens/Details'
import { Register } from '../screens/Register'
import { NewUser } from '../screens/NewUser'
import { Greeting } from '../screens/Greeting'
import { SignIn } from '../screens/SignIn'

const { Navigator, Screen } = createNativeStackNavigator()

export function Routes() {
  const [loading, setIsLoading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUser(response)
      setIsLoading(false)
    })
    return subscriber
  }, [])

  if (loading === true) {
    return <Loading />
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppRoutes />
    </NavigationContainer>
  )
}
