import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'

const InputNumberStyled = styled.input`
  background: none;
  border: none;
  font-family: 'Roboto', Arial, sans-serif;
  font-size: 28px;
  color: #fff;
  outline: none;
  text-align: right;
`

interface IInputNumber {
  value: number | string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputNumber = observer(({ value, onChange }: IInputNumber) => {
  return <InputNumberStyled value={value} onChange={onChange} type="text" />
})
