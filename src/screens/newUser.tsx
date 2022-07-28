import React, {useState} from 'react';
import { Alert } from 'react-native';
import { VStack, useTheme, Heading, Icon,  } from 'native-base';
import auth from '@react-native-firebase/auth';
import {Envelope, Key} from 'phosphor-react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Logo from '../assets/Relp_1.svg';


export function NewUser() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  function handleNewUser() {
    if (!email || !password) {
      return Alert.alert('Cadastro', 'Informe e-mail e senha.')
    }
    if (password != password2) {
      return Alert.alert ('Senha', 'As senhas devem ser iguais.')
    }
    auth().createUserWithEmailAndPassword(email, password)
    
    .catch((error) => {
      console.log(error);
      setIsLoading(false);
      
      if(error.code === 'auth/email-already-in-use') {
        return Alert.alert('Cadastro', 'E-mail já cadastrado!')
      }
      
      return Alert.alert('Cadastro', 'Não foi possível criar cadastro')
    })
}
  
  return(
    <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
    <Logo />
    <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Registre seu usuário</Heading>
  
    <Input placeholder="E-mail"  mb={12} onChangeText={setEmail} InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />} />
    <Input placeholder="senha" mb={4} onChangeText={setPassword} secureTextEntry InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />} />
    <Input placeholder="confirme sua senha" mb={24} onChangeText={setPassword2} secureTextEntry InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />} />

  
    <Button title="Criar cadastro" w="full" onPress={handleNewUser} isLoading={isLoading} />
    </VStack>
  
    )
}
