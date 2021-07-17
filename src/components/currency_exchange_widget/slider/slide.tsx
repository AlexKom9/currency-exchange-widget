import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useCurrencyExchangeWidgetStore } from '../../../contexts/currency_exchange_widget_store_context'
import { IAccountStore } from '../../../types/accounts_store'
import { InputNumber } from '../../ui/inputNumber'
import { Description, H2 } from '../../ui/typography'
import { nanoid } from 'nanoid'

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

interface ISlide {
  account: IAccountStore
  mode: 'from' | 'to'
}

export const Slide = observer(({ account, mode }: ISlide) => {
  const { currencyExchangeWidgetStore } = useCurrencyExchangeWidgetStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)

    currencyExchangeWidgetStore.updateFromValue({
      value: e.target.value,
    })
  }

  return (
    <Container>
      <SlideInner>
        <div className="slide-info-container">
          <H2>{account.currency}</H2>
          <Description className="mts">You have ${account.sum}</Description>
        </div>
        {mode === 'from' ? (
          <div className="slide-value-container">
            <InputNumber
              value={currencyExchangeWidgetStore.valueFrom}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="slide-info-container text-right">
            <H2>{currencyExchangeWidgetStore.formattedValueTo}</H2>
            <Description className="mts">You have ${account.sum}</Description>
          </div>
        )}
      </SlideInner>
    </Container>
  )
})
