import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useCurrencyExchangeWidgetStore } from '../../contexts/currency_exchange_widget_store_context'
import { Button } from '../ui/button'
import { Slider } from './slider/slider'
import { Description } from '../ui/typography'

const Container = styled.div`
  background: #3f94e4;
  width: 414px;
  height: 482px;
  padding-top: 24px;

  .container {
    padding: 0 8px;
  }

  .height-full {
    height: 100%;
  }

  .text-right {
    text-align: right;
  }

  .mts {
    margin-top: 8px;
  }

  .mtm {
    margin-top: 16px;
  }
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`

export const CurrencyExchangeWidgetContainer = observer(() => {
  const { currencyExchangeWidgetStore } = useCurrencyExchangeWidgetStore()

  if (!currencyExchangeWidgetStore.networkStatus.isLoaded) {
    return null
  }

  const handleFocus = (mode: 'from' | 'to') => () => {
    currencyExchangeWidgetStore.updateActiveMode(mode)
  }

  return (
    <Container data-testid="ac-currency-exchange-widget-container">
      <div className="container">
        <Header>
          <Button>Cancel</Button>
          <Description data-testid="ac-currency-exchange-slide-account-from-rate">
            {currencyExchangeWidgetStore.formattedAccountFromRate}
          </Description>
          <Button>Exchange</Button>
        </Header>
      </div>
      <div>
        <Slider
          mode="from"
          accounts={currencyExchangeWidgetStore.accounts}
          onChangeSlide={currencyExchangeWidgetStore.updateActiveFromAccount}
          activeAccountCurrency={currencyExchangeWidgetStore.activeAccountFrom}
          onFocus={handleFocus('from')}
          isFocused={currencyExchangeWidgetStore.activeMode === 'from'}
        />
        <Slider
          key={currencyExchangeWidgetStore.key}
          mode="to"
          accounts={currencyExchangeWidgetStore.accountsTo}
          onChangeSlide={currencyExchangeWidgetStore.updateActiveToAccount}
          activeAccountCurrency={currencyExchangeWidgetStore.activeAccountTo}
          onFocus={handleFocus('to')}
          isFocused={currencyExchangeWidgetStore.activeMode === 'to'}
        />
      </div>
    </Container>
  )
})
