import React from 'react'

import { CurrencyExchangeWidgetContainer } from './currency_exchange_widget_container'
import { CurrencyExchangeWidgetStoreContext } from '../../contexts/currency_exchange_widget_store_context'
import { CurrencyExchangeWidgetStore } from '../../stores/currency_exchange_widget_store'
import { ICurrencyExchangeWidgetStore } from '../../types/currency_exchange_widget_store'
import { useInitStore } from '../../hooks/use_init_store'
import { IAccountsStore } from '../../types/accounts_store'
import { Fetcher } from '../../types/fetcher'

interface ICurrencyExchangeWidgetRoot {
  accountsStore: IAccountsStore
  fetcher: Fetcher
}

export const CurrencyExchangeWidgetRoot = ({
  accountsStore,
  fetcher,
}: ICurrencyExchangeWidgetRoot) => {
  const initStore = (): ICurrencyExchangeWidgetStore => {
    const store = CurrencyExchangeWidgetStore.create(
      {},
      { accountsStore, fetcher }
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
