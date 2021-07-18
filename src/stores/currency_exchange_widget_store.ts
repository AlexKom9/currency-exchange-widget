import { applySnapshot, detach, flow, getEnv, types } from 'mobx-state-tree'
import { LoadingStatus } from './models/loading_status'
import { IAccountsStore } from '../types/accounts_store'
import { formatValueInCurrency } from './helpers/format_value_in_currency'
import { CURRENCIES } from '../constants'
import { FakeFetcher } from './helpers/fake_fetcher'

const CurrencyExchangeRatesResponseData = types.model({
  base: 'USD',
  rates: types.map(types.number),
})

const CurrencyUnionType = types.union(
  ...CURRENCIES.map((item) => types.literal(item))
)

export const CurrencyExchangeWidgetStore = types
  .model({
    activeAccountFrom: CurrencyUnionType,
    activeAccountTo: CurrencyUnionType,
    valueFrom: '',
    ratesData: types.optional(CurrencyExchangeRatesResponseData, {}),
    networkStatus: types.optional(LoadingStatus, {}),
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
      if (self.activeAccountFrom === 'USD') {
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
    get formattedValueFrom() {
      return String(self.valueFrom)
    },
    get valueTo() {
      if (!self.ratesData.rates) {
        return 0
      }

      return this.accountFromRate * Number(self.valueFrom)
    },
    get formattedValueTo() {
      return this.valueTo.toFixed(2)
    },
    get shouldShowFormattedValueTo() {
      return Boolean(this.valueTo)
    },
    get fetcher(): FakeFetcher {
      return getEnv(self).fetcher
    },
  }))
  .actions((self) => {
    let fetchTimer: ReturnType<typeof setTimeout>

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
      monitorCurrencyRates() {
        this.fetchCurrencyRates().then(() => {
          if (fetchTimer) {
            clearTimeout(fetchTimer)
          }

          fetchTimer = setTimeout(() => {
            this.monitorCurrencyRates()
          }, 1000)
        })
      },
      updateActiveFromAccount(currency: string) {
        self.activeAccountFrom = currency
      },
      updateActiveToAccount(currency: string) {
        self.activeAccountTo = currency
      },
      updateFromValue({ value }: { value: string }) {
        self.valueFrom = value.replace(/-/, '')
      },
      init() {
        this.monitorCurrencyRates()
      },
      reset() {
        applySnapshot(self, {})
        detach(self)
        clearTimeout(fetchTimer)
      },
    }
  })
