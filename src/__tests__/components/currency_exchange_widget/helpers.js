import React from 'react'
import { render, screen } from '@testing-library/react'

import { CurrencyExchangeWidgetRoot } from '../../../components/currency_exchange_widget/currency_exchange_widget_root'

export const renderCurrencyExchangeWidget = ({ accountsStore, fetcher }) => {
  render(
    <CurrencyExchangeWidgetRoot
      accountsStore={accountsStore}
      fetcher={fetcher}
    />
  )

  return {
    async getSlidersControllers(){
      const fromAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-swiper-from'
      )

      const toAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-swiper-to'
      )

      return {
        from: fromAccountSlider.swiper,
        to: toAccountSlider.swiper,
      }
    }
  }
}
