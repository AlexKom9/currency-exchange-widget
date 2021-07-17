import React, { useContext } from 'react'

import { ICurrencyExchangeWidgetStore } from '../types/currency_exchange_widget_store'

export const CurrencyExchangeWidgetStoreContext =
  React.createContext<ICurrencyExchangeWidgetStore | null>(null)

export const useCurrencyExchangeWidgetStore = (): {
  currencyExchangeWidgetStore: ICurrencyExchangeWidgetStore
} => {
  const currencyExchangeWidgetStore: ICurrencyExchangeWidgetStore | null =
    useContext(CurrencyExchangeWidgetStoreContext)

  if (currencyExchangeWidgetStore === null) {
    throw new Error('Invalid context usage')
  }

  return {
    currencyExchangeWidgetStore,
  }
}
