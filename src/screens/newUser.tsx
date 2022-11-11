import React, { useEffect, useState } from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'

import OneSignal from 'react-native-onesignal'
import { useTheme, Heading, Icon } from 'native-base'
import { Envelope, Key, IdentificationCard } from 'phosphor-react-native'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'

import { navigationRef as navigation } from '../routes/RootNavigation'
import auth from '@react-native-firebase/auth'

import { Button } from '../components/Button'
import { Input } from '../components/Input'
import Logo from '../assets/Relp_1.svg'

export function NewUser() {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  async function handleNewUser() {
    const { userId } = await OneSignal.getDeviceState()
    const oneSignalAdminId = firebase.firestore.FieldValue.arrayUnion(userId)
    if (!email || !password || !name) {
      setIsLoading(false)
      return Alert.alert('Cadastro', 'Por favor insira seu Nome, Email e Senha')
    } else if (password != password2) {
      setIsLoading(false)
      return Alert.alert('Senha', 'As senhas devem ser iguais')
    }

    try {
      setIsLoading(true)
      await auth().createUserWithEmailAndPassword(email, password)
      await auth().currentUser.updateProfile({
        displayName: name
      })

      OneSignal.setExternalUserId(name)
      OneSignal.setEmail(email)

      Alert.alert('Usuário', 'Defina seu tipo de usuário', [
        {
          text: 'Admin',
          onPress: () => {
            firestore()
              .collection('users')
              .doc('oneSignalAdminId')
              .update(`adminlist`, oneSignalAdminId),
              firestore()
                .collection('users')
                .doc('firestoreAdminId')
                .update(
                  'adminlist',
                  firebase.firestore.FieldValue.arrayUnion(
                    auth().currentUser.uid
                  )
                )
            navigation.navigate('greeting')
            Alert.alert(
              'Sucesso!',
              'Cadastro efetuado com sucesso! Efetue o login na tela principal com seu usuário recém-criado'
            )
          }
        },
        {
          text: 'Usuário',
          onPress: () => {
            navigation.navigate('greeting')
            Alert.alert(
              'Sucesso!',
              'Cadastro efetuado com sucesso! Efetue o login na tela principal com seu usuário recém-criado'
            )
          }
        }
      ])
    } catch (e) {
      console.log(e)
      if (e.code === 'auth/email-already-in-use') {
        setIsLoading(false)
        return Alert.alert('Cadastro', 'E-mail já cadastrado!')
      } else {
        setIsLoading(false)
        return Alert.alert('Cadastro', 'Não foi possível criar cadastro')
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          backgroundColor: '#202024',
          flex: 1,
          alignItems: 'center',
          paddingHorizontal: 20,
          justifyContent: 'center',
          marginBottom: 0
        }}
        keyboardVerticalOffset={-50}
      >
        <Logo width={110} height={110} />
        <Heading color="gray.100" fontSize="xl" mt={10} mb={6}>
          Registre seu usuário
        </Heading>

        <Input
          placeholder="Nome de Usuário"
          mb={4}
          onChangeText={setName}
          isDisabled={isLoading}
          InputLeftElement={
            <Icon as={<IdentificationCard color={colors.gray[300]} />} ml={4} />
          }
        />
        <Input
          placeholder="E-mail"
          mb={4}
          onChangeText={setEmail}
          isDisabled={isLoading}
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
          }
        />

        <Input
          placeholder="senha"
          mb={4}
          onChangeText={setPassword}
          isDisabled={isLoading}
          secureTextEntry
          InputLeftElement={
            <Icon as={<Key color={colors.gray[300]} />} ml={4} />
          }
        />
        <Input
          placeholder="confirme sua senha"
          mb={24}
          onChangeText={setPassword2}
          isDisabled={isLoading}
          secureTextEntry
          InputLeftElement={
            <Icon as={<Key color={colors.gray[300]} />} ml={4} />
          }
        />
        {/* <Heading color="gray.100" fontSize="xl">
          Defina seu tipo de usuário
        </Heading>
        <Checkbox
          value="teste"
          onChange={setisAdmin}
          _text={{ color: `gray.300` }}
        >
          Administrador
        </Checkbox> */}

        <Button
          title="Criar cadastro"
          w="full"
          onPress={handleNewUser}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
