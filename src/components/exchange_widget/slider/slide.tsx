import React, { useState } from 'react'
import styled from 'styled-components'
import { InputNumber } from '../../ui/inputNumber'
import { Description, H2 } from '../../ui/typography'

const Container = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding: 8px 32px;
`

const SlideInner = styled.div`
    display: grid;
    width: 100%;
    justify-content: space-between;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    .slide-info-container {
        flex-shrink: 0;
    }

    .slide-value-container {
        input {
            max-width: 100%;
            width: 100%;
        }
    }
`

export const Slide = () => {
    const [value, setValue] = useState('')
    return (
        <Container>
            <SlideInner>
                <div className="slide-info-container">
                    <H2>GBP</H2>
                    <Description className="mts">You have $58.33</Description>
                </div>
                <div className="slide-value-container">
                    <InputNumber
                        value={value}
                        onChange={({ target: { value } }: any): void => {
                            setValue(value)
                        }}
                    />
                </div>
            </SlideInner>
        </Container>
    )
}
