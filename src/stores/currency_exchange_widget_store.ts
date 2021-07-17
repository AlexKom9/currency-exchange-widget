import { applySnapshot, detach, flow, getEnv, types } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
import { IAccountsStore } from '../types/accounts_store'
import { LoadingStatus } from './models/loading_status'

const CurrencyExchangeRatesResponseData = types.model({
  base: 'USD',
  rates: types.maybeNull(types.model({ EUR: types.number, GBP: types.number })),
})

export const CurrencyExchangeWidgetStore = types
  .model({
    activeAccountFrom: types.union(
      ...['GBP', 'EUR', 'USD'].map((item) => types.literal(item))
    ),
    activeAccountTo: types.union(
      ...['GBP', 'EUR', 'USD'].map((item) => types.literal(item))
    ),
    valueFrom: '',
    ratesData: types.optional(CurrencyExchangeRatesResponseData, {}),
    networkStatus: types.optional(LoadingStatus, {}),
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
    get formattedValueFrom() {
      return String(self.valueFrom)
    },
    get formattedValueTo() {
      if (!self.ratesData.rates) return null

      let valueInBase = 0

      switch (self.activeAccountFrom) {
        case 'USD':
          valueInBase = Number(self.valueFrom)
          break
        case 'EUR':
          valueInBase = Number(self.valueFrom) / self.ratesData.rates?.EUR
          break
        case 'GBP':
          valueInBase = Number(self.valueFrom) / self.ratesData.rates?.GBP
          break
      }

      let result = 0

      switch (self.activeAccountTo) {
        case 'USD':
          result = valueInBase
          break
        case 'EUR':
          result = valueInBase * self.ratesData.rates?.EUR
          break
        case 'GBP':
          result = valueInBase * self.ratesData.rates?.GBP
          break
        default:
          return 0
      }

      return Number(result.toFixed(2))
    },
    get shouldShowFormattedValueTo() {
      return Boolean(this.formattedValueTo)
    },
  }))
  .actions((self) => ({
    getCurrencyRates: flow(function* () {
      // const response = yield fetch(
      //   `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_OPENEXCHANGERATES_API_KEY}&symbols=GBP%2CEUR`
      // ).then((response) => response.json())
      // applySnapshot(self.ratesData, response)
    }),
    updateActiveFromAccount(currency: string) {
      self.activeAccountFrom = currency
    },
    updateActiveToAccount(currency: string) {
      self.activeAccountTo = currency
    },
    updateFromValue({ value }: { value: string }) {
      self.valueFrom = value
    },
    init() {
      this.getCurrencyRates()
    },
    reset() {
      applySnapshot(self, {})
      detach(self)
    },
  }))
