import React, { useState, useEffect } from 'react'
import {
  VStack,
  Text,
  HStack,
  useTheme,
  ScrollView,
  Box,
  Select,
  CheckIcon
} from 'native-base'
import { useRoute } from '@react-navigation/native'
import { navigationRef as navigation } from '../routes/RootNavigation'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText
} from 'phosphor-react-native'
import OneSignal from 'react-native-onesignal'

import { Header } from '../components/Header'
import { OrderProps } from '../components/Order'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO'
import { dateFormat } from '../utils/firestoreDateFormat'
import { Loading } from '../components/Loading'
import { CardDetails } from '../components/CardDetails'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Alert } from 'react-native'
import { Selector } from '../components/Selector'

type RouteParams = {
  orderId: string
  isAdmin: boolean
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
  priority: string
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true)
  const [solution, setSolution] = useState('')
  const [priority, setPriority] = useState('baixa')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const route = useRoute()
  const { orderId, isAdmin } = route.params as RouteParams
  const { colors } = useTheme()

  function handleOrderClose() {
    const notificationObj = {
      contents: {
        en: `${
          order.createdBy ? order.createdBy : `Usuário`
        }, sua requisição foi atualizada.`
      },
      include_player_ids: order.pushId
    }
    const jsonString = JSON.stringify(notificationObj)

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: solution === '' ? 'open' : 'closed',
        priority,
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        OneSignal.postNotification(
          jsonString,
          success => {
            console.log('Success:', success)
          },
          error => {
            console.log('Error:', error)
          }
        )

        solution === ''
          ? Alert.alert(
              'Solicitação',
              'Solicitação atualizada, porém continuará aberta até ser inserida uma solução!'
            )
          : Alert.alert('Solicitação', 'Solicitação encerrada')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const {
          pushId,
          asset,
          description,
          status,
          created_at,
          closed_at,
          solution,
          priority,
          userId,
          createdBy
        } = doc.data()

        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          pushId,
          userId,
          asset,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
          priority,
          createdBy
        })

        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={5} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'Finalizado' : 'em andamento'}{' '}
        </Text>

        <Text
          fontSize="sm"
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          textTransform="uppercase"
        >
          | prioridade:
        </Text>

        <Text
          color={
            order.priority === 'baixa'
              ? colors.green[300]
              : order.priority === 'média'
              ? colors.yellow[300]
              : colors.red[600]
          }
          fontSize="sm"
          ml={1}
          textTransform="uppercase"
        >
          {order.priority}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        {order.status === 'open' && isAdmin ? (
          <CardDetails
            title="Alterar prioridade"
            description={`${order.priority}`}
            icon={DesktopTower}
          >
            <Selector priority={priority} setPriority={setPriority} />
          </CardDetails>
        ) : null}

        <CardDetails
          title="Equipamento | Objeto | Patrimônio"
          description={`${order.asset}`}
          icon={DesktopTower}
        ></CardDetails>

        <CardDetails
          title="Descrição do Problema"
          description={order.description}
          icon={ClipboardText}
          footer={`registrado em ${order.when}`}
        ></CardDetails>

        <CardDetails
          title="Solução apresentada"
          icon={CircleWavyCheck}
          description={
            order.solution
              ? order.solution
              : isAdmin
              ? null
              : 'Ainda não foi apresentada uma solução para sua requisição. Por favor, aguarde a resposta do suporte'
          }
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' && isAdmin ? (
            <Input
              placeholder="Insira aqui a solução para o problema"
              onChangeText={setSolution}
              bg="gray.600"
              h={24}
              textAlignVertical="top"
              multiline
            />
          ) : null}
        </CardDetails>
      </ScrollView>
      {order.status === 'open' && isAdmin ? (
        <Button
          title={
            solution === '' ? 'Atualizar solicitação' : 'Encerrar solicitação'
          }
          m={5}
          onPress={handleOrderClose}
        />
      ) : null}
    </VStack>
  )
}
