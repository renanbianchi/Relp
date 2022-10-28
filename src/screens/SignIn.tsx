import React, { useState } from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import { Heading, Icon, useTheme, VStack } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import auth from '@react-native-firebase/auth'
import { navigationRef as navigation } from '../routes/RootNavigation'

import Logo from '../assets/Relp_1.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { colors } = useTheme()

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe e-mail e senha.')
    }

    setIsLoading(false)

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('home'))

      .catch(error => {
        console.log(error)
        setIsLoading(false)

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido!')
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'Usuário não cadastrado!')
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Entrar', 'E-mail ou senha inválido!')
        }
        console.log(error.code)

        return Alert.alert('Entrar', 'Não foi possível acessar')
      })
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
      >
        <Logo width={110} height={110} />
        <Heading color="gray.100" fontSize="xl" mt={'3'} mb={6}>
          Acesse sua conta
        </Heading>
        <Input
          placeholder="E-mail"
          isDisabled={isLoading}
          mb={4}
          height={4}
          onChangeText={setEmail}
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
          }
        />
        <Input
          placeholder="senha"
          isDisabled={isLoading}
          mb={7}
          onChangeText={setPassword}
          secureTextEntry
          InputLeftElement={
            <Icon as={<Key color={colors.gray[300]} />} ml={4} />
          }
        />
        <Button
          title="ENTRAR"
          h={14}
          w={'full'}
          onPress={handleSignIn}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
