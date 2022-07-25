import React, {useState} from 'react';
import { Alert } from 'react-native'
import { VStack, Heading, Icon, useTheme} from 'native-base';
import {Envelope, Key} from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';



import Logo from '../assets/Relp_1.svg';
import { Input } from '../components/Input';
import { Button } from '../components/Button';


export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  


  
  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe e-mail e senha.')
    }

    setIsLoading(true);

    auth()
    .signInWithEmailAndPassword(email, password)
  
    .catch((error) => {
      console.log(error);
      setIsLoading(false);

      if(error.code === 'auth/invalid-email') {
        return Alert.alert('Entrar', 'E-mail inválido!')
      }

      if (error.code === 'auth/user-not-found') {
        return Alert.alert('Entrar', 'Usuário não cadastrado!')
      }

      if(error.code === 'auth/wrong-password') {
        return Alert.alert('Entrar', 'E-mail ou senha inválido!')
      }

      return Alert.alert('Entrar', 'Não foi possível acessar')
    })
  }

return(
  <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
  <Logo />
  <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Acessse sua conta</Heading>

  <Input placeholder="E-mail"  mb={4} onChangeText={setEmail} InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />} />
  <Input placeholder="senha" mb={40} onChangeText={setPassword} secureTextEntry InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />} />

  <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading} />

  </VStack>
  )
}
