import React from 'react';
import { VStack, Heading, Text} from 'native-base';
import Tipspace from '../assets/Tipspace.svg'
import Hitwork from '../assets/Hitwork.svg'


import Logo from '../assets/Relp_1.svg';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';


export function Greeting() {
  const navigation = useNavigation();
  
  function handleSignIn() {
    navigation.navigate("SignIn");
  }

  function handleCreateAccount() {
    navigation.navigate("newuser");
  }

  
  return (
    <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
    <Logo width={110} height={110} />
    <Heading color="gray.100" fontSize="xl" mt={20} mb={6} textAlign="center" >O aplicativo de suporte para prestadores</Heading>
    <Tipspace width={80} height={80} />
    <Hitwork color="white" width={80} height={80} />


    <Button title="Criar uma conta" mt={20} onPress={handleCreateAccount} w='full' />

    <Button title="Já tenho uma conta" mt={10} onPress={handleSignIn} w='full' />
    </VStack>
  );
}