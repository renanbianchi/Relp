import React from 'react'
import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base'
import { CaretLeft } from 'phosphor-react-native'
import { navigationRef } from '../routes/RootNavigation'

type Props = StyledProps & {
  title: string
}

export function Header({ title, ...rest }) {
  const { colors } = useTheme()
  const navigation = navigationRef

  function handleGoBack() {
    navigation.goBack()
  }
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      align-items="center"
      bg="gray.600"
      pb={2}
      pt={12}
    >
      <IconButton
        onPress={handleGoBack}
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
      />

      <Heading
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        flex={1}
        ml={-6}
        mt={2}
      >
        {title}
      </Heading>
    </HStack>
  )
}
