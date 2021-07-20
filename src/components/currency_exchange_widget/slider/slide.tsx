import React, { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useCurrencyExchangeWidgetStore } from '../../../contexts/currency_exchange_widget_store_context'
import { IAccountStore } from '../../../types/accounts_store'
import { InputNumber } from '../../ui/inputNumber'
import { Description, H2 } from '../../ui/typography'

const Container = styled.div`
  box-sizing: border-box;
  width: 398px;
  max-width: 100%;
  padding: 8px 32px;
  height: 160px;
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

const SlideAccountTOInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

interface ISlide {
  account: IAccountStore
  mode: 'from' | 'to'
  isActive: boolean
}

export const Slide = observer(({ account, mode, isActive }: ISlide) => {
  const { currencyExchangeWidgetStore } = useCurrencyExchangeWidgetStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    currencyExchangeWidgetStore.updateFromValue({
      value: e.target.value,
    })
  }

  let valueFrom = currencyExchangeWidgetStore.valueFrom

  if (valueFrom && valueFrom[0] !== '-') {
    valueFrom = `-${valueFrom}`
  }


  return (
    <Container
      data-testid={`ac-currency-exchange-widget-slide-${mode}-account-${account.currency}`}
    >
      <SlideInner>
        <div className="slide-info-container">
          <H2>{account.currency}</H2>
          <Description className="mts">
            You have {account.formattedSum}
          </Description>
        </div>
        {mode === 'from' ? (
          <div className="slide-value-container">
            <InputNumber
              data-testid="ac-currency-exchange-widget-input"
              disabled={!isActive}
              value={valueFrom}
              onChange={handleChange}
              autofocus={isActive}
            />
          </div>
        ) : (
          <SlideAccountTOInfoContainer className="slide-info-container text-right">
            <H2>
              {currencyExchangeWidgetStore.shouldShowFormattedValueTo &&
                `+${currencyExchangeWidgetStore.formattedValueTo}`}
            </H2>
            <Description className="mts">
              {currencyExchangeWidgetStore.formattedAccountToRate}
            </Description>
          </SlideAccountTOInfoContainer>
        )}
      </SlideInner>
    </Container>
  )
})
