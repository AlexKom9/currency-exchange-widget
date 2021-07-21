// import 'core-js/es6/map'
// import 'core-js/es6/set'
import '../../matchMedia'
import 'raf/polyfill'

import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'

import { renderCurrencyExchangeWidget } from './helpers'
import { AccountsStore } from '../../../stores/accounts_store'
import { FakeFetcher } from '../../../stores/helpers/fake_fetcher'
import userEvent from '@testing-library/user-event'

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

  describe(`USD to GBP`, () => {
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
      const fromAccountSlide = await within(fromAccountSlider).findByTestId(
        'ac-currency-exchange-slide-active'
      )
      const toAccountSlide = await within(toAccountSlider).findByTestId(
        'ac-currency-exchange-slide-active'
      )

      const inputFrom = within(fromAccountSlide).getByTestId(
        'ac-currency-exchange-widget-input'
      )
      const inputTo = within(toAccountSlide).getByTestId(
        'ac-currency-exchange-widget-input'
      )

      expect(inputFrom).toBeInTheDocument()

      await waitFor(() => expect(document.activeElement).toEqual(inputFrom))

      expect(inputFrom.value).toMatchInlineSnapshot(`""`)
      expect(inputTo.value).toMatchInlineSnapshot(`""`)

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8.47"`)
    })
  })
})
