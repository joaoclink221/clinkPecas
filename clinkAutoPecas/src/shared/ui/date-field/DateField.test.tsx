import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DateField } from './DateField'

function renderDate(overrides: Partial<Parameters<typeof DateField>[0]> = {}) {
  const onChange = vi.fn()
  render(
    <DateField label="Data da venda" onChange={onChange} {...overrides} />,
  )
  return { onChange }
}

// ── Renderização ──────────────────────────────────────────────────────────────

describe('DateField — renderização', () => {
  it('renderiza o campo com label acessível', () => {
    renderDate()
    // <input type="date"> não é role="textbox" — usa getByLabelText
    expect(screen.getByLabelText(/data da venda/i)).toBeInTheDocument()
  })

  it('type do input é "date"', () => {
    renderDate()
    expect(screen.getByLabelText(/data da venda/i)).toHaveAttribute('type', 'date')
  })

  it('renderiza com valor inicial', () => {
    renderDate({ value: '2024-03-15', readOnly: true })
    expect(screen.getByLabelText(/data da venda/i)).toHaveValue('2024-03-15')
  })

  it('não renderiza alerta quando não há erro', () => {
    renderDate()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ── Estado de erro ────────────────────────────────────────────────────────────

describe('DateField — erro', () => {
  it('exibe mensagem de erro com role=alert', () => {
    renderDate({ error: 'Data inválida.' })
    expect(screen.getByRole('alert')).toHaveTextContent(/data inválida/i)
  })

  it('input tem aria-invalid=true quando há erro', () => {
    renderDate({ error: 'Obrigatório.' })
    expect(screen.getByLabelText(/data da venda/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('input tem aria-invalid=false quando não há erro', () => {
    renderDate()
    expect(screen.getByLabelText(/data da venda/i)).toHaveAttribute('aria-invalid', 'false')
  })

  it('erro tem id referenciado em aria-describedby do input', () => {
    renderDate({ error: 'Obrigatório.' })
    const input = screen.getByLabelText(/data da venda/i)
    const errorEl = screen.getByRole('alert')
    expect(input).toHaveAttribute('aria-describedby', errorEl.id)
  })
})

// ── Interação ─────────────────────────────────────────────────────────────────

describe('DateField — interação', () => {
  it('aceita input de data no formato YYYY-MM-DD via fireEvent', () => {
    // jsdom não implementa o date picker nativo — fireEvent.change é a forma correta de testar
    const onChange = vi.fn()
    render(<DateField label="Data da venda" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText(/data da venda/i), {
      target: { value: '2024-06-15' },
    })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

// ── Estado disabled ───────────────────────────────────────────────────────────

describe('DateField — disabled', () => {
  it('input desabilitado tem atributo disabled', () => {
    renderDate({ disabled: true })
    expect(screen.getByLabelText(/data da venda/i)).toBeDisabled()
  })
})

// ── Acessibilidade ────────────────────────────────────────────────────────────

describe('DateField — acessibilidade', () => {
  it('label está associada ao input via htmlFor/id', () => {
    renderDate()
    const input = screen.getByLabelText(/data da venda/i)
    const label = screen.getByText(/data da venda/i)
    expect(label).toHaveAttribute('for', input.id)
  })
})
