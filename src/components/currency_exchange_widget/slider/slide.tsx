import React, { RefObject } from 'react'
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
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  inputRef?: RefObject<HTMLInputElement>
}

export const Slide = observer(
  ({ account, mode, isActive, onFocus, inputRef }: ISlide) => {
    const { currencyExchangeWidgetStore } = useCurrencyExchangeWidgetStore()

    return (
      <Container
        data-testid={
          isActive
            ? 'ac-currency-exchange-slide-active'
            : 'ac-currency-exchange-slide'
        }
      >
        <SlideInner
          data-testid={`ac-currency-exchange-slide-${mode}-${account.currency}${
            isActive ? '-active' : ''
          }`}
        >
          <div className="slide-info-container">
            <H2>{account.currency}</H2>
            <Description
              data-testid="ac-currency-exchange-slide-account-sum"
              className="mts"
            >
              You have {account.formattedSum}
            </Description>
          </div>
          {mode === 'from' ? (
            <div className="slide-value-container">
              <InputNumber
                inputRef={inputRef}
                data-testid="ac-currency-exchange-widget-input"
                value={currencyExchangeWidgetStore.formattedValueFrom}
                onChange={(e) => {
                  currencyExchangeWidgetStore.updateFromValue(e.target.value)
                }}
                onFocus={onFocus}
                disabled={!isActive}
              />
            </div>
          ) : (
            <SlideAccountTOInfoContainer className="slide-info-container text-right">
              <div className="slide-value-container">
                <InputNumber
                  inputRef={inputRef}
                  data-testid="ac-currency-exchange-widget-input"
                  value={currencyExchangeWidgetStore.formattedValueTo}
                  onChange={(e) => {
                    currencyExchangeWidgetStore.updateToValue(e.target.value)
                  }}
                  onFocus={onFocus}
                  disabled={!isActive}
                />
              </div>
              <Description
                data-testid="ac-currency-exchange-slide-account-to-rate"
                className="mts"
              >
                {currencyExchangeWidgetStore.formattedAccountToRate}
              </Description>
            </SlideAccountTOInfoContainer>
          )}
        </SlideInner>
      </Container>
    )
  }
)
