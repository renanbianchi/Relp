import React, {useState, useEffect } from 'react';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';


import { Header } from '../components/Header';
import {OrderProps} from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import {CardDetails} from '../components/CardDetails'
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
  priority: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const {colors} = useTheme();
  const navigation = useNavigation();
  const userId = auth().currentUser.uid
  
  function handleOrderClose() {
    if(!solution) {
      return Alert.alert('Solicitação', 'Informe uma solução para encerrar a solicitação');
    }

    firestore().collection<OrderFirestoreDTO>('orders').doc(orderId).update({status: 'closed', solution, closed_at: firestore.FieldValue.serverTimestamp()})
    .then(() => {
      Alert.alert('Solicitação', "Solicitação encerrada");
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
    })
  }
  

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { asset, description, status, created_at, closed_at, solution, priority} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        asset,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
        priority
      });

      console.log({
         
        userId,
        id: doc.id,
        asset,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
        priority
      });

      setIsLoading(false);
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (

    <VStack flex={1} bg="gray.700">
      <Box px={5} bg="gray.600" >
    <Header title="Solicitação"/> 
    </Box>
    <HStack bg="gray.500" justifyContent="center" p={4}>
      {order.status === 'closed' ? <CircleWavyCheck size={22} color={colors.green[300]} /> : <Hourglass size={22} color={colors.secondary[700]} />}
      
      <Text fontSize="sm" color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]} ml={2} textTransform="uppercase">{order.status === 'closed' ? 'Finalizado' : 'em andamento'} </Text>
      
      <Text fontSize="sm" color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]} textTransform="uppercase">| prioridade:</Text>
      
      <Text color={order.priority === 'baixa' ? colors.green[300] : order.priority === 'média' ? colors.yellow[300] : colors.red[600]} fontSize='sm' ml={1} textTransform="uppercase">{order.priority}</Text>

    </HStack>
    <ScrollView mx={5} showsVerticalScrollIndicator={false}>
      
      <CardDetails title="Equipamento | Objeto | Patrimônio" description={`${order.asset}`} icon={DesktopTower} ></CardDetails>

      <CardDetails title="Descrição do Problema" description={order.description} icon={ClipboardText}  footer={`registrado em ${order.when}`}></CardDetails>

      
      <CardDetails title="Solução apresentada" icon={CircleWavyCheck} description={order.solution} footer={order.closed && `Encerrado em ${order.closed}`}>
      { (order.status === "open" && userId === "ZikI2M5od3hjgY1S7IAv9sCp3TH2"  ) && 
        
        <Input placeholder="descrição da solução" onChangeText={setSolution} bg="gray.600" h={24} textAlignVertical="top" multiline/>}

      </CardDetails>
    </ScrollView>
    {
      order.status === 'open' && <Button title= "Encerrar solicitação" m={5} onPress={handleOrderClose}/>
    }
    </VStack>
  );
}