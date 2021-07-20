import React from 'react'
import { fireEvent, waitFor, screen, within } from '@testing-library/react'

import { renderCurrencyExchangeWidget } from './helpers'
import { AccountsStore } from '../../../stores/accounts_store'
import { FakeFetcher } from '../../../stores/helpers/fake_fetcher'

// jest.useRealTimers()

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
    renderCurrencyExchangeWidget({
      accountsStore,
      fetcher,
    })

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

  describe(`should remove inappropriate slides`, () => {
    it(`USD is default`, async () => {
      renderCurrencyExchangeWidget({
        accountsStore,
        fetcher,
      })

      let fromAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-from'
      )
      let toAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-to'
      )

      expect(within(fromAccountSlider).getByText('USD')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('EUR')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('GBP')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('UAH')).toBeInTheDocument()

      expect(within(toAccountSlider).queryByText('USD')).not.toBeInTheDocument()
      expect(within(toAccountSlider).getByText('EUR')).toBeInTheDocument()
      expect(within(toAccountSlider).getByText('GBP')).toBeInTheDocument()
      expect(within(toAccountSlider).getByText('UAH')).toBeInTheDocument()
    })

    it(`EUR is default`, async () => {
      accountsStore = AccountsStore.create({
        accounts: [
          { currency: 'EUR', sum: 0 },
          { currency: 'USD', sum: 100 },
          { currency: 'GBP', sum: 0 },
          { currency: 'UAH', sum: 0 },
        ],
      })

      renderCurrencyExchangeWidget({
        accountsStore,
        fetcher,
      })

      let fromAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-from'
      )
      let toAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-to'
      )

      expect(within(fromAccountSlider).getByText('USD')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('EUR')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('GBP')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('UAH')).toBeInTheDocument()

      expect(within(toAccountSlider).getByText('USD')).toBeInTheDocument()
      expect(within(toAccountSlider).queryByText('EUR')).not.toBeInTheDocument()
      expect(within(toAccountSlider).getByText('GBP')).toBeInTheDocument()
      expect(within(toAccountSlider).getByText('UAH')).toBeInTheDocument()
    })

    it(`GBP is default`, async () => {
      accountsStore = AccountsStore.create({
        accounts: [
          { currency: 'GBP', sum: 0 },
          { currency: 'EUR', sum: 0 },
          { currency: 'USD', sum: 100 },
          { currency: 'UAH', sum: 0 },
        ],
      })

      renderCurrencyExchangeWidget({
        accountsStore,
        fetcher,
      })

      let fromAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-from'
      )
      let toAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-to'
      )

      expect(within(fromAccountSlider).getByText('USD')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('EUR')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('GBP')).toBeInTheDocument()
      expect(within(fromAccountSlider).getByText('UAH')).toBeInTheDocument()

      expect(within(toAccountSlider).getByText('USD')).toBeInTheDocument()
      expect(within(toAccountSlider).getByText('EUR')).toBeInTheDocument()
      expect(within(toAccountSlider).queryByText('GBP')).not.toBeInTheDocument()
      expect(within(toAccountSlider).getByText('UAH')).toBeInTheDocument()
    })
  })

  describe.only(`USD to GBP`, () => {
    let fromAccountSlider
    let toAccountSlider

    beforeEach(async () => {
      renderCurrencyExchangeWidget({
        accountsStore: AccountsStore.create({
          accounts: [
            { currency: 'USD', sum: 100 },
            { currency: 'EUR', sum: 0 },
            { currency: 'GBP', sum: 0 },
            { currency: 'UAH', sum: 0 },
          ],
        }),
        fetcher,
      })

      fromAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-from'
      )

      toAccountSlider = await screen.findByTestId(
        'ac-currency-exchange-widget-slider-to'
      )
    })

    it(`should be active GBP`, async () => {
      expect(toAccountSlider).toBeInTheDocument()

      const fromAccountSlide = await screen.findByTestId(
        'ac-currency-exchange-widget-slide-from-account-USD'
      )
      const toAccountSlide = await screen.findByTestId(
        'ac-currency-exchange-widget-slide-to-account-GBP'
      )

      const input = within(fromAccountSlide).getByTestId(
        'ac-currency-exchange-widget-input'
      )

      expect(input).toBeInTheDocument()
    })
  })
})
