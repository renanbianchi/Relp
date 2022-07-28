import React, {useState} from 'react';
import { VStack, Heading, Icon, useTheme, Text} from 'native-base';

import Logo from '../assets/Relp_1.svg';
import { Button } from '../components/Button';
import { AppRoutes } from '../routes/app.routes';
import { SignIn } from './SignIn';

export function Greeting() {
  return (
    <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
    <Logo />
    <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Problema na</Heading><Text color="gray.100" fontSize="xl">Orbi</Text>

    <Button title="Criar uma conta" mt={20} onPress={AppRoutes} w='full' />

    <Button title="Já tenho uma conta" mt={20} onPress={AppRoutes} w='full' />
    </VStack>
  );
}