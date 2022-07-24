import React from 'react';
import { Heading, HStack, IconButton, StyledProps, useTheme} from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native'

type Props = StyledProps & {
  title: string;
}

export function Header({ title, ...rest}) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }
  return (
    <HStack w="full" justifyContent="space-between" align-items="center" bg="gray.600" pb={6} pt={12}>
      <IconButton onPress={handleGoBack}
      icon={<CaretLeft color={colors.gray[200]} size={24} />} 
      />

      <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-6} >
      {title}
      </Heading>
    </HStack>
  );
}