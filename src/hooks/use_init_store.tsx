import { useEffect, useState, useRef } from 'react'

export function useInitStore<T = void>(
  initStore: () => T | Promise<T>,
  resetStore: (store: T) => void
): [shouldRender: boolean, store: T] {
  const [shouldRender, setShouldRender] = useState(false)
  const storeRef: any = useRef()
  const storePromiseRef: any = useRef()

  const asyncHandler = async <T,>(storePromise: Promise<T>): Promise<void> => {
    storePromiseRef.current = storePromise
    storeRef.current = await storePromiseRef.current
    setShouldRender(true)
  }

  useEffect((): (() => void) => {
    const result = initStore()

    if (result instanceof Promise) {
      asyncHandler(result)
    } else {
      storeRef.current = result

      setShouldRender(true)
    }

    return (): void => {
      if (storePromiseRef.current instanceof Promise) {
        storePromiseRef.current.then((store: T) => {
          resetStore(store)
        })
      } else {
        resetStore(storeRef.current)
      }
    }
  }, [initStore, resetStore])

  return [shouldRender, storeRef.current]
}
