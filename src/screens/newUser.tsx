import React, { useEffect, useState } from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import { useTheme, Heading, Icon } from 'native-base'
import { Envelope, Key, IdentificationCard } from 'phosphor-react-native'
import { navigationRef as navigation } from '../routes/RootNavigation'
import auth from '@react-native-firebase/auth'

import { RegisterUser } from '../functions/RegisterUser'
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
    if (!email || !password || !name) {
      setIsLoading(false)
      return Alert.alert('Cadastro', 'Por favor insira seu Nome, Email e Senha')
    } else if (password != password2) {
      setIsLoading(false)
      return Alert.alert('Senha', 'As senhas devem ser iguais')
    }
    /* //useEffect(() => {
    const message = await RegisterUser(
      email,
      password,
      password2,
      name,
      isLoading,
      setIsLoading
    )
    console.log(RegisterUser)
    return Alert.alert(message.message, `teste`)
    //}, []) */
    try {
      setIsLoading(true)
      await auth().createUserWithEmailAndPassword(email, password)
      await auth().currentUser.updateProfile({ displayName: name })
      Alert.alert(
        'Sucesso!',
        'Cadastro efetuado com sucesso! Efetue o login na tela principal com seu usuário recém-criado'
      )
      navigation.navigate('greeting')
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
  /* const isit = {
      success: {
        title: 'Sucesso!',
        message: `Cadastro efetuado com sucesso! \nEfetue o login com seu usuário`
      },
      emailAlreadyRegistered: {
        title: 'Cadastro',
        message: 'E-mail já cadastrado'
      },
      genericError: {
        title: 'Cadastro',
        message: 'Não foi possível criar cadastro'
      },
      emptyFields: {
        title: 'Cadastro',
        message: 'Informe e-mail e senha.'
      },
      passwordsNotEqual: {
        title: 'Senha',
        message: 'As senhas devem ser iguais.'
      }
    }
    setIsLoading(true)

    if (!email || !password) {
      setIsLoading(false)
      return Alert.alert('Cadastro', 'Informe e-mail e senha.')
    }
    if (password != password2) {
      setIsLoading(false)
      return Alert.alert('Senha', 'As senhas devem ser iguais.')
    }

    Alert.alert(
      hook === undefined
        ? (isit.success.title, isit.success.message)
        : hook.code === 'auth/email-already-in-use'
        ? (isit.emailAlreadyRegistered.title,
          isit.emailAlreadyRegistered.message)
        : !email || !password
        ? (isit.emptyFields.title, isit.emptyFields.message)
        : password != password2
        ? (isit.passwordsNotEqual.title, isit.passwordsNotEqual.message)
        : (isit.genericError.title, isit.genericError.message)
    )
    if (hook === undefined)
      return setIsLoading(false), navigation.navigate('greeting')
    if (hook.code === 'auth/email-already-in-use') {
      setIsLoading(false)
    } else {
      setIsLoading(false)
    } */

  /* if (hook === undefined)
      Alert.alert(
        'Sucesso!',
        'Cadastro efetuado com sucesso! Efetue o login com seu usuário recém-criado'
      ),
        navigation.navigate('greeting'),
        setIsLoading(false)
    if (hook.code === 'auth/email-already-in-use') {
      setIsLoading(false)
      return Alert.alert('Cadastro', 'E-mail já cadastrado!')
    } else {
      setIsLoading(false)
      return Alert.alert('Cadastro', 'Não foi possível criar cadastro')
    } */

  /* try {
      setIsLoading(true)
      await auth().createUserWithEmailAndPassword(email, password)
      await auth().currentUser.updateProfile({ displayName: name })
      Alert.alert(
        'Sucesso!',
        'Cadastro efetuado com sucesso! Efetue o login na tela principal com seu usuário recém-criado'
      )
      navigation.navigate('greeting')
    } catch (e) {
      console.log(e)
      if (e.code === 'auth/email-already-in-use')
        Alert.alert('Cadastro', 'E-mail já cadastrado!')
      else Alert.alert('Cadastro', 'Não foi possível criar cadastro')
    } */

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
        keyboardVerticalOffset={50}
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
