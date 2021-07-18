import React from 'react'
import { render } from '@testing-library/react'

import { CurrencyExchangeWidgetRoot } from '../../../components/currency_exchange_widget/currency_exchange_widget_root'

export const renderCurrencyExchangeWidget = ({ accountsStore, fetcher }) => {
  render(
    <CurrencyExchangeWidgetRoot
      accountsStore={accountsStore}
      fetcher={fetcher}
    />
  )
}
