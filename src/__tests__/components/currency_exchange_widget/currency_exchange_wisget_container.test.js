import '../../matchMedia'
import 'raf/polyfill'

import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'

import { renderCurrencyExchangeWidget } from './helpers'
import { AccountsStore } from '../../../stores/accounts_store'
import { FakeFetcher } from '../../../stores/helpers/fake_fetcher'
import userEvent from '@testing-library/user-event'

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

  describe(`USD to EUR`, () => {
    let accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'EUR', sum: 0 },
        { currency: 'GBP', sum: 0 },
        { currency: 'UAH', sum: 0 },
      ],
    })

    it(`should be empty inputs by default`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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
    })

    it(`should calculate value from USD to GBP and GBP to USD`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8.47"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '8')

      await waitFor(() => expect(document.activeElement).toEqual(inputTo))

      expect(inputFrom.value).toMatchInlineSnapshot(`"-9.44"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8"`)
    })
  })

  describe(`USD to GBP`, () => {
    let accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'GBP', sum: 0 },
        { currency: 'EUR', sum: 0 },
        { currency: 'UAH', sum: 0 },
      ],
    })

    it(`should be empty inputs by default`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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
    })

    it(`should calculate direct value and revers`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+7.26"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '8')

      await waitFor(() => expect(document.activeElement).toEqual(inputTo))

      expect(inputFrom.value).toMatchInlineSnapshot(`"-11.02"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8"`)
    })
  })

  describe(`USD to UAH`, () => {
    let accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'USD', sum: 100 },
        { currency: 'UAH', sum: 0 },
        { currency: 'GBP', sum: 0 },
        { currency: 'EUR', sum: 0 },
      ],
    })

    it(`should be empty inputs by default`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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
    })

    it(`should calculate direct value and reversed`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+272.17"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '8')

      await waitFor(() => expect(document.activeElement).toEqual(inputTo))

      expect(inputFrom.value).toMatchInlineSnapshot(`"-0.29"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8"`)
    })
  })

  describe(`GBP to USD`, () => {
    let accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'GBP', sum: 0 },
        { currency: 'USD', sum: 100 },
        { currency: 'EUR', sum: 0 },
      ],
    })

    it(`should be empty inputs by default`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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
    })

    it(`should calculate direct value and reversed`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+13.77"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '8')

      await waitFor(() => expect(document.activeElement).toEqual(inputTo))

      expect(inputFrom.value).toMatchInlineSnapshot(`"-5.81"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8"`)
    })
  })

  describe(`EUR to USD`, () => {
    let accountsStore = AccountsStore.create({
      accounts: [
        { currency: 'EUR', sum: 0 },
        { currency: 'USD', sum: 100 },
        { currency: 'GBP', sum: 0 },
      ],
    })

    it(`should calculate direct value and reversed`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '10')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+11.81"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '8')

      await waitFor(() => expect(document.activeElement).toEqual(inputTo))

      expect(inputFrom.value).toMatchInlineSnapshot(`"-6.78"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+8"`)
    })

    it(`should format value in accountFrom input`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputFrom, '01')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-1"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+1.18"`)

      userEvent.clear(inputFrom)
      userEvent.type(inputFrom, 'test_string')

      expect(inputFrom.value).toMatchInlineSnapshot(`""`)
      expect(inputTo.value).toMatchInlineSnapshot(`""`)

      userEvent.clear(inputFrom)
      userEvent.type(inputFrom, '90...101.')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-90.10"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+106.37"`)

      userEvent.clear(inputFrom)
      userEvent.type(inputFrom, '--1000')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-1000"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+1180.54"`)

      userEvent.clear(inputFrom)
      userEvent.type(inputFrom, '+1000')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-1000"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+1180.54"`)
    })

    it(`should format value in accountTo input`, async () => {
      const { fromAccountSlider, toAccountSlider } =
        await renderCurrencyExchangeWidget({
          accountsStore,
          fetcher,
        })

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

      userEvent.type(inputTo, '01')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-0.85"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+001"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, 'test_string')

      expect(inputFrom.value).toMatchInlineSnapshot(`""`)
      expect(inputTo.value).toMatchInlineSnapshot(`""`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '90...101.')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-76.32"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+90.10"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '--1000')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-847.07"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+1000"`)

      userEvent.clear(inputTo)
      userEvent.type(inputTo, '+1000')

      expect(inputFrom.value).toMatchInlineSnapshot(`"-847.07"`)
      expect(inputTo.value).toMatchInlineSnapshot(`"+1000"`)
    })
  })
})
