import React, { useState } from 'react'
import { Alert } from 'react-native'
import { VStack, Select, CheckIcon } from 'native-base'
import firestore from '@react-native-firebase/firestore'
import { navigationRef } from '../routes/RootNavigation'
import auth from '@react-native-firebase/auth'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Selector } from '../components/Selector'

export function Register() {
  const [priority, setPriority] = useState('baixa')
  const [isLoading, setIsLoading] = useState(false)
  const [asset, setAsset] = useState('')
  const [description, setDescription] = useState('')

  const navigation = navigationRef
  const currentUser = auth().currentUser.uid

  function handleNewOrderRegister() {
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
        created_at: firestore.FieldValue.serverTimestamp()
      })

      .then(() => {
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
        flex={1}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Select
        selectedValue={priority}
        placeholder="Escolha a prioridade do problema"
        mt={2}
        bg="gray.400"
        color={
          priority === 'baixa'
            ? 'green.300'
            : priority === 'média'
            ? 'yellow.300'
            : priority === 'alta'
            ? 'red.600'
            : 'white'
        }
        onValueChange={itemValue => setPriority(itemValue)}
        _selectedItem={{
          bg: 'gray.100',
          endIcon: <CheckIcon size={5} />
        }}
      >
        <Select.Item label="Baixa" value="baixa" />
        <Select.Item label="Média" value="média" />
        <Select.Item label="Alta" value="alta" />
      </Select>

      {/* <Selector /> */}

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  )
}
