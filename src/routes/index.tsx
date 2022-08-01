import React, {useState, useEffect} from 'react'
import { Loading } from '../components/Loading'
import {NavigationContainer} from '@react-navigation/native'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'


import { AppRoutes } from './app.routes'
import { Greeting } from '../screens/Greeting'
import { Home } from '../screens/Home'

export function Routes() {
  const [loading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUser(response);
      setIsLoading(false);
    }) 
    return subscriber;

  }, [])

  if(loading === true) {
      return <Loading />
  }

  return (
    <NavigationContainer>
      {user ? <Home /> : <AppRoutes/>} 
    </NavigationContainer>
  )
}