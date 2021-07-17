import { Instance } from 'mobx-state-tree'
import { AccountsStore, AccountStore } from '../stores/accounts_store'

export interface IAccountsStore extends Instance<typeof AccountsStore> {}

export interface IAccountStore extends Instance<typeof AccountStore> {}
