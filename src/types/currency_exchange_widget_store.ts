import { Instance } from 'mobx-state-tree'
import { CurrencyExchangeWidgetStore } from '../stores/currency_exchange_widget_store'

export interface ICurrencyExchangeWidgetStore
  extends Instance<typeof CurrencyExchangeWidgetStore> {}
