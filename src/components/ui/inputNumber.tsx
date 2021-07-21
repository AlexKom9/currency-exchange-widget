import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
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
  disabled?: boolean
  autofocus?: boolean
  value: number | string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
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
  ({
    value,
    onChange,
    disabled = false,
    onFocus,
    autofocus,
    ...rest
  }: IInputNumber) => {
    const ref = useRef<HTMLInputElement>(null)

    const focus = () => {
      if (ref.current?.focus instanceof Function) {
        ref.current.focus()
      }
    }

    useEffect(() => {
      if (autofocus && !disabled) {
        setTimeout(() => {
          focus()
        }, 400)
      }
    }, [ref, autofocus, disabled])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = format(e.target.value)

      onChange(e)
    }

    return (
      <InputNumberStyled
        {...rest}
        ref={autofocus && !disabled ? ref : undefined}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        disabled={disabled}
        type="text"
      />
    )
  }
)
