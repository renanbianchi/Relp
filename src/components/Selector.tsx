import React, { useState } from 'react'
import { Select, CheckIcon } from 'native-base'

export function Selector() {
  const [priority, setPriority] = useState('baixa')

  return (
    <Select
      selectedValue={priority}
      placeholder="Escolha a prioridade do problema"
      mt={2}
      bg="gray.400"
      color={
        priority === 'baixa'
          ? 'green.300'
          : priority === 'média'
          ? 'yellow.300'
          : priority === 'alta'
          ? 'red.600'
          : 'white'
      }
      onValueChange={itemValue => setPriority(itemValue)}
      _selectedItem={{
        bg: 'gray.100',
        endIcon: <CheckIcon size={5} />
      }}
    >
      <Select.Item label="Baixa" value="baixa" />
      <Select.Item label="Média" value="média" />
      <Select.Item label="Alta" value="alta" />
    </Select>
  )
}
