import { VStack, HStack, Text, Box, useTheme } from 'native-base';
import { ReactNode } from 'react';
import { IconProps } from 'phosphor-react-native';
import React from 'react';

type Props = {
  title: string;
  description?: string;
  priority?: string;
  footer?: string;
  icon: React.ElementType<IconProps>;
  children?: ReactNode;
}


export function CardDetails( {
  title,
  description,
  footer = null,
  icon: Icon, 
  children,
  priority

} : Props) {
  const {colors} = useTheme();

  return (
    <VStack bg='gray.600' padding={5} mt={5} rounded="sm" >
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.gray[50]} />
        <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
          {title}
        </Text>
      </HStack>

          {!!description && <Text color="gray.100" fontSize="md">{description}</Text>}
          

          {!!priority && <Text fontSize="md">{priority}</Text>}
          
          { children }

          {!!footer && <Box borderTopWidth={1} borderTopColor="gray.400"><Text mt={3} color="gray.300" fontSize='sm'>{footer}</Text></Box>}
    </VStack>
  );
}