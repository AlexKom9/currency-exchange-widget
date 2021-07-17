import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useCurrencyExchangeWidgetStore } from '../../contexts/currency_exchange_widget_store_context'
import { Button } from '../ui/button'
import { Slider } from './slider/slider'

const Container = styled.div`
  background: #3f94e4;
  max-width: 414px;
  min-height: 716px;
  height: 100vh;
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

  return (
    <Container>
      <div className="container">
        <Header>
          <Button>Cancel</Button>
          <Button>Exchange</Button>
        </Header>
      </div>
      <div>
        <Slider mode="from" accounts={currencyExchangeWidgetStore.accounts} />
        <Slider mode="to" accounts={currencyExchangeWidgetStore.accountsTo} />
      </div>
    </Container>
  )
})
