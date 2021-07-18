import { types } from 'mobx-state-tree'

enum Status {
  blank = 'blank',
  in_progress = 'in_progress',
  success = 'success',
  error = 'error',
}

export const LoadingStatus = types
  .model('LoadingStatus', {
    status: types.optional(
      types.union(
        types.literal('blank'),
        types.literal('in_progress'),
        types.literal('success'),
        types.literal('error')
      ),
      'blank'
    ),
    isLoading: false,
    isLoaded: false,
  })
  .actions((self) => ({
    updateLoading: (state: boolean) => {
      self.isLoading = state
    },
    update(status: keyof typeof Status) {
      self.status = status
      if (status === 'in_progress') {
        this.updateLoading(true)

        return
      }
      if (self.status === 'success') {
        this.updateLoaded(true)
      }
      this.updateLoading(false)
    },
    updateLoaded: (state: boolean) => {
      self.isLoaded = state
    },
  }))
