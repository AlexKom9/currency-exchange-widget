import React from 'react'
import styled, { css } from 'styled-components'

const InputNumberStyled = styled.input`
    background: none;
    border: none;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 28px;
    color: #fff;
    /* letter-spacing: -0.5px; */
    outline: none;
    /* width: 2px; */
    text-align: right;

    /* ${({ value }) =>
        String(value) &&
        css`
            width: unset;
        `} */
`

interface IInputNumber {
    value: number | string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputNumber = ({ value, ...rest }: IInputNumber) => {
    return <InputNumberStyled {...rest} value={value} type="number" />
}
