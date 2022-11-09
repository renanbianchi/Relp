import React, { useEffect, useState } from 'react'
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { VStack, Select, CheckIcon } from 'native-base'
import firestore from '@react-native-firebase/firestore'
import { navigationRef as navigation } from '../routes/RootNavigation'
import auth from '@react-native-firebase/auth'
import OneSignal from 'react-native-onesignal'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Selector } from '../components/Selector'

export function Register() {
  const [priority, setPriority] = useState('baixa')
  const [isLoading, setIsLoading] = useState(false)
  const [asset, setAsset] = useState('')
  const [description, setDescription] = useState('')
  const [array, setArray] = useState('')

  const currentUser = auth().currentUser.uid
  const userName = auth().currentUser.displayName
  const admins = firestore().collection('users').doc('admin')

  useEffect(() => {
    admins.get().then(querySnapshot => {
      setArray(querySnapshot.data().admin)
      console.log(array)
    })
  }, [])

  function handleNewOrderRegister() {
    const notificationObj = {
      contents: { en: 'Nova Solicitação' },
      include_player_ids: array
    }

    const jsonString = JSON.stringify(notificationObj)

    if (!asset || !description) {
      Alert.alert('Registrar', 'Preencha todos os campos.')
    }

    setIsLoading(true)

    firestore()
      .collection('orders')
      .add({
        asset,
        description,
        status: 'open',
        priority,
        userId: currentUser,
        createdBy: userName,
        created_at: firestore.FieldValue.serverTimestamp()
      })

      .then(() => {
        OneSignal.postNotification(
          jsonString,
          success => {
            console.log('Success:', success)
          },
          error => {
            console.log('Error:', error)
          }
        )
        Alert.alert('Solicitação', 'Solicitação registrada com sucesso!')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
        return Alert.alert('Solicitação', 'Não foi possível registrar o pedido')
      })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} p={6} bg="gray.600">
        <Header title="Nova Solicitação" />
        <Input
          placeholder="Informações do patrimônio"
          mt={4}
          onChangeText={setAsset}
        />
        <Input
          placeholder="Descrição do problema"
          mt={5}
          h={80}
          multiline
          textAlignVertical="top"
          onChangeText={setDescription}
        />

        <Selector priority={priority} setPriority={setPriority} />

        <Button
          title="Cadastrar"
          mt={5}
          isLoading={isLoading}
          onPress={handleNewOrderRegister}
        />
      </VStack>
    </TouchableWithoutFeedback>
  )
}
