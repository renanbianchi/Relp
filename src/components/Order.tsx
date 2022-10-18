import React from 'react'
import {
  Box,
  HStack,
  Text,
  useTheme,
  VStack,
  Circle,
  Pressable,
  IPressableProps
} from 'native-base'
import {
  Hourglass,
  CircleWavyCheck,
  ClockAfternoon
} from 'phosphor-react-native'

export type OrderProps = {
  id: string
  asset: string
  when: string
  status: 'open' | 'closed'
  priority: string
  userId: string
  createdBy: string
}

type Props = IPressableProps & {
  data: OrderProps
  isAdmin: boolean
}

export function Order({ data, isAdmin, ...rest }: Props) {
  const { colors } = useTheme()
  const statusColor =
    data.status === 'open' ? colors.secondary[700] : colors.green[300]
  const priorityColor =
    data.priority === 'baixa'
      ? colors.green[300]
      : data.priority === 'média'
      ? colors.yellow[300]
      : colors.red[600]

  return (
    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        <Box h="full" w={5} bg={statusColor} />
        <VStack flex={1} my={5} ml={5}>
          <Text color="white" fontSize="lg">
            {data.asset}
          </Text>
          <Text color={priorityColor} textTransform="uppercase" fontSize="sm">
            prioridade {data.priority}{' '}
          </Text>
          {isAdmin ? (
            <Text color="white" fontSize="sm">
              Solicitante: {data.createdBy}
            </Text>
          ) : null}
          <HStack alignItems="center">
            <ClockAfternoon size={15} color={colors.gray[300]} />
            <Text color={colors.gray[200]} fontSize="xs" ml={1}>
              {data.when}
            </Text>
          </HStack>
        </VStack>
        <Circle bg="gray.500" h={12} w={12} mr={5}>
          {data.status === 'closed' ? (
            <CircleWavyCheck size={24} color={statusColor} />
          ) : (
            <Hourglass size={24} color={statusColor} />
          )}
        </Circle>
      </HStack>
    </Pressable>
  )
}
