import React from 'react'

import { CurrencyExchangeWidgetContainer } from './currency_exchange_widget_container'
import { CurrencyExchangeWidgetStoreContext } from '../../contexts/currency_exchange_widget_store_context'
import { CurrencyExchangeWidgetStore } from '../../stores/currency_exchange_widget_store'
import { ICurrencyExchangeWidgetStore } from '../../types/currency_exchange_widget_store'
import { AccountsStore } from '../../stores/accounts_store'
import { useInitStore } from '../../hooks/use_init_store'
import { FakeFetcher } from '../../stores/helpers/fake_fetcher'

export const CurrencyExchangeWidgetRoot = () => {
  const initStore = (): ICurrencyExchangeWidgetStore => {
    const accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'EUR', sum: 0 },
        { currency: 'GBP', sum: 0 },
        { currency: 'UAH', sum: 0 },
      ],
    })

    const store = CurrencyExchangeWidgetStore.create(
      {
        activeAccountFrom: 'USD',
        activeAccountTo: 'EUR',
      },
      { accountsStore, fetcher: new FakeFetcher({ randomizeRates: true }) }
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
      <CurrencyExchangeWidgetContainer />
    </CurrencyExchangeWidgetStoreContext.Provider>
  )
}
