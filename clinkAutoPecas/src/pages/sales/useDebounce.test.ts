import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 300))

    expect(result.current).toBe('inicial')
  })

  it('não atualiza o valor antes do delay expirar', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'primeiro' },
    })

    rerender({ value: 'segundo' })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('primeiro')
  })

  it('atualiza o valor após o delay expirar', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'primeiro' },
    })

    rerender({ value: 'segundo' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('segundo')
  })

  it('reinicia o timer a cada mudança de valor (trailing debounce)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => { vi.advanceTimersByTime(200) })

    rerender({ value: 'abc' })
    act(() => { vi.advanceTimersByTime(200) })

    expect(result.current).toBe('a')

    act(() => { vi.advanceTimersByTime(100) })

    expect(result.current).toBe('abc')
  })

  it('funciona com tipos não-string (number)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 0 },
    })

    rerender({ value: 42 })

    act(() => { vi.advanceTimersByTime(100) })

    expect(result.current).toBe(42)
  })
})
