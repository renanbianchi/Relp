import React from 'react';
import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Register() {
const [isLoading, setIsLoading] = useState(false);
const [asset, setAsset] = useState('');
const [description, setDescription] = useState ('');
const navigation = useNavigation();

  function handleNewOrderRegister() {
    if(!asset || !description) {
      Alert.alert('Registrar', 'Preencha todos os campos.')
    }

    setIsLoading(true);

    firestore().collection('orders').add({
      asset, 
      description, 
      status: 'open', 
      created_at: firestore.FieldValue.serverTimestamp()
    })

    .then(() => {
      Alert.alert("Solicitação", "Solicitação registrada com sucesso!");
      navigation.goBack();
    })
    .catch((error)=> {
      console.log(error);
      setIsLoading(false);
      return Alert.alert('Solicitação', 'Não foi possível registrar o pedido')
    })
  }


  return (
    <VStack flex={1} p={6} bg="gray.600">
    <Header title="Nova Solicitação" />
    <Input 
    placeholder="Número do patrimônio" 
    mt={4} 
    onChangeText={setAsset}
    />
    
    <Input
      placeholder='Descrição do problema'
      mt={5}
      flex={1}
      multiline
      textAlignVertical="top"
      onChangeText={setDescription}
    />
    <Button 
      title="Cadastrar" 
      mt={5} 
      isLoading={isLoading}
      onPress={handleNewOrderRegister}
    />
    </VStack>
  );
}