import { types } from 'mobx-state-tree'
import currencyFormatter from 'currency-formatter'

export const AccountStore = types
  .model({
    currency: types.string,
    sum: types.number,
  })
  .views((self) => ({
    get formattedSum() {
      return this.formatValueInCurrency({
        value: self.sum,
        currency: self.currency,
      })
    },
    formatValueInCurrency({
      value,
      currency,
    }: {
      value: number
      currency: string
    }) {
      return currencyFormatter.format(value, {
        code: currency,
        precision: 0,
        format: '%s%v'
      })
    },
  }))

export const AccountsStore = types.model({
  accounts: types.array(AccountStore),
})
