import React, { useState } from 'react'
import { Select, CheckIcon } from 'native-base'

export function Selector() {
  const [priority, setPriority] = useState(`baixa`)
  return (
    <Select
      placeholder="Escolha a prioridade do problema"
      mt={2}
      bgColor="gray.400"
      _actionSheetContent={{ bgColor: `gray.400` }}
      color={
        priority === 'baixa'
          ? 'green.300'
          : priority === 'média'
          ? 'yellow.300'
          : 'red.600'
      }
      onValueChange={itemValue => setPriority(itemValue)}
      _item={{
        bgColor: `gray.400`
      }}
      _selectedItem={{
        endIcon: <CheckIcon size={5} />,
        bgColor: `gray.500`
      }}
    >
      <Select.Item _text={{ color: 'green.300' }} label="Baixa" value="baixa" />
      <Select.Item
        _text={{ color: 'yellow.300' }}
        label="Média"
        value="média"
      />
      <Select.Item _text={{ color: 'red.600' }} label="Alta" value="alta" />
    </Select>
  )
}
