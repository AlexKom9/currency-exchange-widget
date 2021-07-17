import { types } from 'mobx-state-tree'

// const CurrencyExchangeRatesResponseData = types.model({
//   base: 'USD',
//   rates: types.maybeNull(types.model({ EUR: types.number, GBP: types.number })),
// })

export const AccountStore = types
  .model({
    currency: types.string,
    sum: types.number,
  })
  .views((self) => ({
    formattedSum(){
      // TODO: update
      return String(self.sum)
    }
  }))

export const AccountsStore = types.model({
  accounts: types.array(AccountStore),
})
// .views((self) => ({}))
// .actions((self) => ({}))
