import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { SignOut, ChatTeardropText, User } from 'phosphor-react-native'
import { navigationRef as navigation } from '../routes/RootNavigation'
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
  const currentUser = auth().currentUser.uid
  const admins = firestore().collection('users').doc('firestoreAdminId')
  const userName = auth().currentUser.displayName

  const [isAdmin, setIsAdmin] = useState(false)
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  )
  const [isloading, setIsLoading] = useState(true)
  const db = firestore().collection('orders')

  const { colors } = useTheme()

  function handleNewOrder() {
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string, isAdmin: boolean) {
    navigation.navigate('details', { orderId, isAdmin })
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

    let unsubscriber: any

    const getOrders = async () => {
      setIsLoading(true)

      const adminListQuerySnapshot = await admins.get()
      const adminList = adminListQuerySnapshot.data().adminlist
      const adminCheck = adminList.includes(currentUser)

      setIsAdmin(adminCheck)

      const fetch = adminCheck
        ? db.where('status', '==', statusSelected)
        : db
            .where('status', '==', statusSelected)
            .where('userId', '==', auth().currentUser.uid)

      unsubscriber = fetch.onSnapshot(snapshot => {
        const newOrders = snapshot.docs.map(doc => {
          const {
            pushId,
            asset,
            description,
            status,
            created_at,
            priority,
            userId,
            createdBy
          } = doc.data()

          return {
            pushId,
            id: doc.id,
            asset,
            description,
            status,
            when: dateFormat(created_at),
            priority,
            userId,
            createdBy
          }
        })

        setOrders(newOrders)
        setIsLoading(false)
      })
    }

    getOrders()

    return unsubscriber
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
        <Text fontSize={'md'} ml={'12'} color="gray.100">
          Olá, {userName}
        </Text>
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
              <Order
                isAdmin={isAdmin}
                data={item}
                onPress={() => handleOpenDetails(item.id, isAdmin)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  {' '}
                  Você ainda não possui {'\n'} Solicitações{' '}
                  {statusSelected === 'open' ? `em andamento` : 'finalizadas'}{' '}
                </Text>
              </Center>
            )}
          />
        )}
        {isAdmin ? null : (
          <Button mt={2} title="Nova solicitação" onPress={handleNewOrder} />
        )}
      </VStack>
    </VStack>
  )
}
