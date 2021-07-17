import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useAutoFocus } from '../../hooks/use_auto_focus'

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
  disabled?: boolean
  autofocus?: boolean
  value: number | string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputNumber = observer(
  ({ value, onChange, disabled = false, autofocus }: IInputNumber) => {
    const [ref, focus] = useAutoFocus()

    useEffect(() => {
      if (!disabled && autofocus) {
        if (typeof focus === 'function') {
          setTimeout(() => {
            focus()
          }, 300)
        }
      }
    }, [autofocus, disabled, focus])

    return (
      <InputNumberStyled
        ref={autofocus && !disabled ? ref : undefined}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type="text"
      />
    )
  }
)
