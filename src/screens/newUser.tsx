import React, { useState } from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import { useTheme, Heading, Icon } from 'native-base'
import auth from '@react-native-firebase/auth'
import { Envelope, Key, IdentificationCard } from 'phosphor-react-native'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import Logo from '../assets/Relp_1.svg'
import { navigationRef } from '../routes/RootNavigation'

export function NewUser() {
  const navigation = navigationRef
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  async function handleNewUser() {
    if (!email || !password) {
      return Alert.alert('Cadastro', 'Informe e-mail e senha.')
    }
    if (password != password2) {
      return Alert.alert('Senha', 'As senhas devem ser iguais.')
    }

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
      if (e.code === 'auth/email-already-in-use')
        Alert.alert('Cadastro', 'E-mail já cadastrado!')
      else Alert.alert('Cadastro', 'Não foi possível criar cadastro')
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
      >
        <Logo />
        <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
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
          mb={6}
          onChangeText={setEmail}
          isDisabled={isLoading}
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
          }
        />
        <Heading color="gray.100" fontSize="xl" mt={0} mb={6}>
          Insira sua senha
        </Heading>
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
        {/* </VStack> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
