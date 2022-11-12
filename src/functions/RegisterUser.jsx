import { useState } from 'react'

import auth from '@react-native-firebase/auth'
import { navigationRef as navigation } from '../routes/RootNavigation'

export async function RegisterUser(
  email,
  password,
  password2,
  name,
  isLoading,
  setIsLoading
) {
  const messages = {
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
      message: 'Informe um nome de usuário, e-mail e senha .'
    },
    passwordsNotEqual: {
      title: 'Senha',
      message: 'As senhas devem ser iguais.'
    }
  }
  const [message, setMessage] = useState(
    messages.success.title
    //messages.success.message
  )

  try {
    setIsLoading(true)
    if (!email || !password || !name) {
      setIsLoading(false)
      setMessage(
        `${messages.emptyFields.title}`,
        `${messages.emptyFields.message}`
      )
      return { message, isLoading }
    }
    await auth().createUserWithEmailAndPassword(email, password)
    await auth().currentUser.updateProfile({ displayName: name })
    navigation.navigate('greeting')
  } catch (error) {
    console.log(error)
    error.code === 'auth/email-already-in-use'
      ? setMessage(
          messages.emailAlreadyRegistered.title
          //messages.emailAlreadyRegistered.message
        )
      : password != password2
      ? setMessage(
          messages.passwordsNotEqual.title
          //messages.passwordsNotEqual.message
        )
      : setMessage(
          messages.genericError.title //, messages.genericError.message
        )
    setIsLoading(false)
  }
  return { message, isLoading }
}
