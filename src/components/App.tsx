import React, { useEffect, useRef, useState } from 'react'
import { AccountsStore } from '../stores/accounts_store'
import { FakeFetcher } from '../stores/helpers/fake_fetcher'
import { Fetcher } from '../types/fetcher'
import { CurrencyExchangeWidgetRoot } from './currency_exchange_widget/currency_exchange_widget_root'
import styled from 'styled-components'

const WidgetContainer = styled.div`
  width: 414px;
  height: 482px;
`

const accountsStore = AccountsStore.create({
  accounts: [
    { currency: 'USD', sum: 100 },
    { currency: 'EUR', sum: 0 },
    { currency: 'GBP', sum: 0 },
    { currency: 'UAH', sum: 0 },
  ],
})

const fakeFetcher = new FakeFetcher({ randomizeRates: true })

const realFetcher = {
  apiGet(url: string) {
    return fetch(url).then((response) => response.json())
  },
}

function App() {
  const fetcherRef = useRef<Fetcher>(fakeFetcher)
  const [key, setKey] = useState(0)
  const [realRates, setRealRates] = useState(false)

  const handleChangeRealRates = () => {
    setRealRates((state) => !state)
  }

  useEffect(() => {
    if (realRates) {
      fetcherRef.current = realFetcher
    } else {
      fetcherRef.current = fakeFetcher
    }
    setKey((key) => key + 1)
  }, [realRates])

  return (
    <div className="App">
      <WidgetContainer>
        <CurrencyExchangeWidgetRoot
          key={key}
          accountsStore={accountsStore}
          fetcher={fetcherRef.current}
        />
      </WidgetContainer>
      <br />
      <br />
      <input
        type="checkbox"
        name="use_real_rates_api"
        id="use_real_rates_api"
        onChange={handleChangeRealRates}
        checked={realRates}
      />
      <label htmlFor="use_real_rates_api">Use real rates api</label>
    </div>
  )
}

export default App
