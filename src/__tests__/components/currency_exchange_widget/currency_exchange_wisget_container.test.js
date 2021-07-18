import React from 'react'
import { fireEvent, waitFor, screen, within } from '@testing-library/react'

import { renderCurrencyExchangeWidget } from './helpers'
import { AccountsStore } from '../../../stores/accounts_store'
import { FakeFetcher } from '../../../stores/helpers/fake_fetcher'

describe('CurrencyExchangeWidget', () => {
  let accountsStore
  let fetcher

  beforeEach(() => {
    accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'EUR', sum: 0 },
        { currency: 'GBP', sum: 0 },
        { currency: 'UAH', sum: 0 },
      ],
    })

    fetcher = new FakeFetcher({ randomizeRates: false })
  })

  it(`should render widget`, async () => {
    renderCurrencyExchangeWidget({ accountsStore, fetcher })

    expect(
      await screen.findByTestId('ac-currency-exchange-widget-container')
    ).toBeInTheDocument()
  })

  it(`should render available accounts sliders amount`, async () => {
    renderCurrencyExchangeWidget({ accountsStore, fetcher })

    const fromAccountSlider = await screen.findByTestId(
      'ac-currency-exchange-widget-slider-from'
    )
    const toAccountSlider = await screen.findByTestId(
      'ac-currency-exchange-widget-slider-to'
    )

    expect(fromAccountSlider).toBeInTheDocument()
    expect(toAccountSlider).toBeInTheDocument()

    expect(
      Array.from(
        await within(fromAccountSlider).findAllByTestId(
          'ac-currency-exchange-widget-slider-slide'
        )
      ).length
    ).toMatchInlineSnapshot(`4`)

    expect(
      Array.from(
        await within(toAccountSlider).findAllByTestId(
          'ac-currency-exchange-widget-slider-slide'
        )
      ).length
    ).toMatchInlineSnapshot(`3`)
  })

  

  // it(`should render available accounts`, async () => {
  //   renderCurrencyExchangeWidget({ accountsStore, fetcher })

  //   const fromAccountSlider = await screen.findByTestId(
  //     'ac-currency-exchange-widget-slider-from'
  //   )
  //   const toAccountSlider = await screen.findByTestId(
  //     'ac-currency-exchange-widget-slider-to'
  //   )

  //   fromAccountSlider.
  //   expect(toAccountSlider).toBeInTheDocument()
  // })
})
