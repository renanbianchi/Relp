import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { SignOut, ChatTeardropText, User } from 'phosphor-react-native'
import { navigationRef } from '../routes/RootNavigation'
import {
  HStack,
  VStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center
} from 'native-base'
import auth from '@react-native-firebase/auth'

import Logo from '../assets/Relp_2.svg'
import { Filter } from '../components/Filter'
import { Button } from '../components/Button'
import { Order, OrderProps } from '../components/Order'
import { dateFormat } from '../utils/firestoreDateFormat'
import { Loading } from '../components/Loading'

export function Home() {
  const [orders, setOrders] = useState<OrderProps[]>([])
  const navigation = navigationRef
  const currentUser = auth().currentUser.uid
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  )
  let isAdmin = currentUser === 'ZikI2M5od3hjgY1S7IAv9sCp3TH2'
  const [isloading, setIsLoading] = useState(true)

  const { colors } = useTheme()

  const db = firestore().collection('orders')
  const fetch = isAdmin
    ? db.where('status', '==', statusSelected)
    : db
        .where('status', '==', statusSelected)
        .where('userId', '==', currentUser)

  function handleNewOrder() {
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId })
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error)
        return Alert.alert('Sair, não foi possível sair.')
      })
      .then(() => {
        navigation.navigate('greeting')
      })
  }

  useEffect(() => {
    setIsLoading(true)

    const subscriber = fetch.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        const { asset, description, status, created_at, priority, userId } =
          doc.data()

        return {
          id: doc.id,
          asset,
          description,
          status,
          when: dateFormat(created_at),
          priority,
          userId
        }
      })
      setOrders(data)
      setIsLoading(false)
    })
    return subscriber
  }, [statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        background="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8} size="sm">
          <Filter
            type="open"
            title="em andamento"
            color="gray.100"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter
            type="closed"
            title="fechado"
            text-color="gray.100"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>
        {isloading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  {' '}
                  Você ainda não possui {'\n'} Solicitações{' '}
                  {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}{' '}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  )
}
