import { applySnapshot, detach, flow, getEnv, types } from 'mobx-state-tree'
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
    valueFrom: 0,
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
    get accountsFrom() {
      return this.accounts
    },
    get accountsTo() {
      return this.accounts
    },
    get formattedValueFrom() {
      return String(self.valueFrom)
    },
    get formattedValueTo() {
      // TODO: add converting function
      return String(0.5 * self.valueFrom)
    },
    get toAccountCurrentSum() {
      // TODO: update

      return this.accountsStore.accounts.find(
        (item) => item.currency === self.activeAccountTo
      )
    },
    get fromAccountCurrentSum() {
      // TODO: update

      return this.accountsStore.accounts.find(
        (item) => item.currency === self.activeAccountFrom
      )
    },
  }))
  .actions((self) => ({
    getCurrencyRates: flow(function* () {
      const response = yield fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_OPENEXCHANGERATES_API_KEY}&symbols=GBP%2CEUR`
      ).then((response) => response.json())

      applySnapshot(self.ratesData, response)
    }),
    handleChangeFromValue({
      target: { value },
    }: {
      target: { name: string; value: string }
    }) {
      self.valueFrom = Number(value)
    },
    init() {
      this.getCurrencyRates()
    },
    reset() {
      applySnapshot(self, {})
      detach(self)
    },
  }))
