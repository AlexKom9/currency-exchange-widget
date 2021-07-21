import React from 'react'
import { AccountsStore } from '../stores/accounts_store'
import { FakeFetcher } from '../stores/helpers/fake_fetcher'
import { CurrencyExchangeWidgetRoot } from './currency_exchange_widget/currency_exchange_widget_root'

const accountsStore = AccountsStore.create({
  accounts: [
    { currency: 'USD', sum: 100 },
    { currency: 'EUR', sum: 0 },
    { currency: 'GBP', sum: 0 },
    { currency: 'UAH', sum: 0 },
  ],
})

const fetcher = new FakeFetcher({ randomizeRates: false })

function App() {
  return (
    <div className="App">
      <CurrencyExchangeWidgetRoot
        accountsStore={accountsStore}
        fetcher={fetcher}
      />
    </div>
  )
}

export default App
