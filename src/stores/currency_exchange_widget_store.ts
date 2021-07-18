import { applySnapshot, detach, flow, getEnv, types } from 'mobx-state-tree'
import { LoadingStatus } from './models/loading_status'
import { IAccountsStore } from '../types/accounts_store'
import { formatValueInCurrency } from './helpers'
import { CURRENCIES } from '../constants'

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
      return (
        (self.ratesData.rates.get(self.activeAccountTo) || 1) /
        (self.ratesData.rates.get(self.activeAccountFrom) || 1)
      )
    },
    get accountFromRate() {
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
  }))
  .actions((self) => ({
    getCurrencyRates: flow(function* () {
      try {
        self.networkStatus.update('in_progress')

        const response = yield fetch(
          `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_OPENEXCHANGERATES_API_KEY}&symbols=GBP%2CEUR`
        ).then((response) => response.json())

        self.networkStatus.update('success')

        applySnapshot(self.ratesData, response)
      } catch (e) {
        self.networkStatus.update('error')
        console.error(e)
      }
    }),
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
      this.getCurrencyRates()
    },
    reset() {
      applySnapshot(self, {})
      detach(self)
    },
  }))
