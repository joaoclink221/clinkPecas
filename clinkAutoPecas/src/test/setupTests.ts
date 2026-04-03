import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import '@testing-library/jest-dom/vitest'

// Recharts usa `new ResizeObserver(cb)` — arrow functions não são construtoras,
// por isso o mock precisa ser uma classe.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
})

afterEach(() => {
  cleanup()
})
