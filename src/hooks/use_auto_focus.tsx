import { useEffect, useRef } from 'react'

export function useAutoFocus() {
  const ref = useRef<HTMLInputElement>(null)

  const focus = () => {
    if (ref.current?.focus instanceof Function) {
      ref.current.focus()
    }
  }

  useEffect(() => {
    focus()
  }, [ref])

  return [ref, focus]
}
