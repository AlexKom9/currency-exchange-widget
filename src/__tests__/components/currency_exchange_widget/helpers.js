import React from 'react'
import { render, screen } from '@testing-library/react'

import { CurrencyExchangeWidgetRoot } from '../../../components/currency_exchange_widget/currency_exchange_widget_root'

export const renderCurrencyExchangeWidget = async ({
  accountsStore,
  fetcher,
}) => {
  const { container } = render(
    <CurrencyExchangeWidgetRoot
      accountsStore={accountsStore}
      fetcher={fetcher}
    />
  )

  const fromAccountSlider = await screen.findByTestId(
    'ac-currency-exchange-widget-slider-from'
  )

  const toAccountSlider = await screen.findByTestId(
    'ac-currency-exchange-widget-slider-to'
  )

  return {
    container,
    getDots(mode) {
      if (mode === 'from') {
        return container.querySelectorAll(
          "[data-testid='ac-currency-exchange-widget-slider-from'] .slick-dots li button"
        )
      }
      if (mode === 'to') {
        return container.querySelectorAll(
          "[data-testid='ac-currency-exchange-widget-slider-to'] .slick-dots li button"
        )
      }
    },
    fromAccountSlider,
    toAccountSlider,
    // fromAccountSliderDots,
    // toAccountSliderDots,
    // nextSlide
  }
}
