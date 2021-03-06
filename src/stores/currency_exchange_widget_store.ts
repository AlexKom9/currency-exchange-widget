import { applySnapshot, detach, flow, getEnv, types } from 'mobx-state-tree'
import { LoadingStatus } from './models/loading_status'
import { IAccountsStore } from '../types/accounts_store'
import { formatValueInCurrency } from './helpers/format_value_in_currency'
import { CURRENCIES } from '../constants'
import { FakeFetcher } from './helpers/fake_fetcher'
import { nanoid } from 'nanoid'
import { formatNumberToStore } from './helpers/format_number_to_store'
import { addSymbol } from './helpers/add_symbol'
import { EMode } from '../types/mode'

const BASE_CURRENCY = 'USD'

const CurrencyExchangeRatesResponseData = types.model({
  base: BASE_CURRENCY,
  rates: types.map(types.number),
})

const CurrencyUnionType = types.union(
  ...CURRENCIES.map((currency) => types.literal(currency))
)

export const CurrencyExchangeWidgetStore = types
  .model({
    activeAccountFrom: types.maybeNull(CurrencyUnionType),
    activeAccountTo: types.maybeNull(CurrencyUnionType),
    valueFrom: '',
    valueTo: '',
    ratesData: types.optional(CurrencyExchangeRatesResponseData, {}),
    networkStatus: types.optional(LoadingStatus, {}),
    activeMode: types.optional(
      types.union(types.literal(EMode.from), types.literal(EMode.to)),
      EMode.from
    ),
    key: nanoid(),
  })
  .views((self) => ({
    get accountsStore(): IAccountsStore {
      return getEnv(self).accountsStore
    },
    get accounts() {
      return this.accountsStore.accounts
    },
    get accountsTo() {
      return this.accounts.filter(
        (item) => item.currency !== self.activeAccountFrom
      )
    },
    get accountToRate() {
      const accountToRate =
        (self.ratesData.rates.get(self.activeAccountFrom) || 1) /
        (self.ratesData.rates.get(self.activeAccountTo) || 1)

      return accountToRate
    },
    get accountFromRate() {
      if (self.activeAccountFrom === BASE_CURRENCY) {
        return self.ratesData.rates.get(self.activeAccountTo) || 0
      }

      return 1 / this.accountToRate
    },
    get formattedAccountFromRate() {
      const first = formatValueInCurrency({
        value: 1,
        currency: self.activeAccountFrom,
      })

      const second = formatValueInCurrency({
        value: this.accountFromRate,
        currency: self.activeAccountTo,
        precision: 4,
      })

      return `${first}= ${second}`
    },
    get formattedAccountToRate() {
      const first = formatValueInCurrency({
        value: 1,
        currency: self.activeAccountTo,
      })

      const second = formatValueInCurrency({
        value: this.accountToRate,
        currency: self.activeAccountFrom,
        precision: 2,
      })

      return `${first}= ${second}`
    },
    get calculatedValueFrom() {
      if (!self.ratesData.rates) {
        return 0
      }

      return Number(self.valueTo) / this.accountFromRate || 0
    },
    get calculatedValueTo() {
      if (!self.ratesData.rates) {
        return 0
      }

      return this.accountFromRate * Number(self.valueFrom) || 0
    },
    get formattedValueFrom() {
      if (self.activeMode === EMode.from) {
        return addSymbol(self.valueFrom, '-')
      }

      return addSymbol(this.calculatedValueFrom, '-', (value) =>
        value.toFixed(2)
      )
    },
    get formattedValueTo() {
      if (self.activeMode === EMode.to) {
        return addSymbol(self.valueTo, '+')
      }

      return addSymbol(this.calculatedValueTo, '+', (value) => value.toFixed(2))
    },
    get shouldShowFormattedValueTo() {
      return Boolean(self.valueTo)
    },
    get fetcher(): FakeFetcher {
      return getEnv(self).fetcher
    },
  }))
  .actions((self) => {
    let fetchInterval: ReturnType<typeof setInterval>

    return {
      fetchCurrencyRates: flow(function* () {
        try {
          self.networkStatus.update('in_progress')

          const response = yield self.fetcher.apiGet(
            `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_OPENEXCHANGERATES_API_KEY}`
          )

          self.networkStatus.update('success')

          applySnapshot(self.ratesData, response)
        } catch (e) {
          self.networkStatus.update('error')
          console.error(e)
        }
      }),
      startToMonitorCurrencyRates() {
        fetchInterval = setInterval(() => {
          this.fetchCurrencyRates()
        }, 1000)
      },
      updateActiveFromAccount(index: number) {
        self.activeAccountFrom = self.accounts[index].currency
        self.key = nanoid()
      },
      updateActiveToAccount(index: number) {
        const newActiveCurrency = self.accountsTo[index].currency

        self.activeAccountTo = newActiveCurrency
      },
      updateFromValue(value: number | string) {
        self.valueFrom = formatNumberToStore(value)
      },
      updateToValue(value: number | string) {
        self.valueTo = formatNumberToStore(value)
      },
      updateActiveMode(mode: EMode) {
        if (self.activeMode === mode) return

        if (mode === EMode.to) {
          this.updateToValue(Number(self.calculatedValueTo.toFixed(2)))
        } else {
          this.updateFromValue(Number(self.calculatedValueFrom.toFixed(2)))
        }

        self.activeMode = mode
      },
      init() {
        this.startToMonitorCurrencyRates()
      },
      reset() {
        clearInterval(fetchInterval)
        detach(self)
      },
    }
  })
