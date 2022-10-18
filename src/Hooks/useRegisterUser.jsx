import auth from '@react-native-firebase/auth'
import { navigationRef } from '../routes/RootNavigation'
import { Alert } from 'react-native'

export async function useRegisterUser(email, password, name, setIsLoading) {
  const navigation = navigationRef
  try {
    setIsLoading(true)
    await auth().createUserWithEmailAndPassword(email, password)
    await auth().currentUser.updateProfile({ displayName: name })
    navigation.navigate('greeting')
    Alert.alert(
      'Sucesso!',
      'Cadastro efetuado com sucesso! Efetue o login na tela principal com seu usuário recém-criado'
    )
  } catch (e) {
    console.log(e)
    if (e.code === 'auth/email-already-in-use')
      Alert.alert('Cadastro', 'E-mail já cadastrado!')
    else Alert.alert('Cadastro', 'Não foi possível criar cadastro')
  }
}
