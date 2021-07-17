import React from 'react'
import styled from 'styled-components'
import { Button } from '../ui/button'
import { Slider } from './slider'

import { CurrencyExchangeWidgetStoreContext } from '../../contexts/currency_exchange_widget_store_context'
import { CurrencyExchangeWidgetStore } from '../../stores/currency_exchange_widget_store'
import { ICurrencyExchangeWidgetStore } from '../../types/currency_exchange_widget_store'
import { useInitStore } from '../../hooks/use_init_store'
import { AccountsStore } from '../../stores/accounts_store'

const RootContainer = styled.div`
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

export const CurrencyExchangeWidgetRoot = () => {
  const initStore = (): ICurrencyExchangeWidgetStore => {
    const accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'EUR', sum: 0 },
        { currency: 'GBP', sum: 0 },
      ],
    })
    const store = CurrencyExchangeWidgetStore.create(
      {
        activeAccountFrom: 'USD',
        activeAccountTo: 'EUR',
      },
      { accountsStore }
    )

    store.init()

    return store
  }

  const resetStore = (store: ICurrencyExchangeWidgetStore) => {
    store.reset()
  }

  const [shouldRender, store] = useInitStore<ICurrencyExchangeWidgetStore>(
    initStore,
    resetStore
  )

  if (!shouldRender) {
    return null
  }

  return (
    <CurrencyExchangeWidgetStoreContext.Provider value={store}>
      <RootContainer>
        <div className="container">
          <Header>
            <Button>Cancel</Button>
            <Button>Exchange</Button>
          </Header>
        </div>
        <div>
          <Slider position="top" accounts={store.accountsFrom} />
          <Slider position="bottom" accounts={store.accountsTo} />
        </div>
      </RootContainer>
    </CurrencyExchangeWidgetStoreContext.Provider>
  )
}
