import { types } from 'mobx-state-tree'
import { formatValueInCurrency } from './helpers/format_value_in_currency'

export const AccountStore = types
  .model({
    currency: types.string,
    sum: types.number,
  })
  .views((self) => ({
    get formattedSum() {
      return formatValueInCurrency({
        value: self.sum,
        currency: self.currency,
      })
    },
  }))

export const AccountsStore = types.model({
  accounts: types.array(AccountStore),
})
