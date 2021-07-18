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

function format(str: string | number = ''): string {
  if (Number(str) === Infinity) {
    return String(Infinity)
  }

  return String(str)
    .replace(/[^0-9.]/g, '')
    .replace(/^([^.]*\.)(.*)$/, function (_, pattern1, pattern2) {
      return pattern1 + pattern2.replaceAll('.', '')
    })
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = format(e.target.value)

      onChange(e)
    }

    return (
      <InputNumberStyled
        ref={autofocus && !disabled ? ref : undefined}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        type="text"
      />
    )
  }
)
