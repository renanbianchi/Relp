import React, {useState, useEffect} from 'react';
import { Alert } from 'react-native';
import { VStack, useTheme, Heading, Icon,  } from 'native-base';
import auth from '@react-native-firebase/auth';
import {Envelope, Key} from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Logo from '../assets/logo_primary.svg';


export function NewUser() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleNewUser() {
  auth().createUserWithEmailAndPassword(email, password)

  .catch((error) => {
    console.log(error);
    setIsLoading(false);
    
    return Alert.alert('Entrar', 'Não foi possível acessar')
  })
  
  return(
    <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
    <Logo />
    <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Registre seu usuário</Heading>
  
    <Input placeholder="E-mail"  mb={4} onChangeText={setEmail} InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />} />
    <Input placeholder="senha" mb={40} onChangeText={setPassword} secureTextEntry InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />} />
    <Input placeholder="confirme sua senha" mb={40} onChangeText={setPassword} secureTextEntry InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />} />

  
    <Button title="Entrar" w="full" onPress={handleNewUser} isLoading={isLoading} />
    </VStack>
  
    )
}
