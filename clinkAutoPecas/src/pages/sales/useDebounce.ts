import { useEffect, useState } from 'react'

/**
 * Retorna uma versão debounced do valor fornecido.
 * Útil para evitar recálculos caros a cada keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debouncedValue
}
