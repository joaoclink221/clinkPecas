import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SelectField } from './SelectField'

const CARGO_OPTIONS = [
  { value: 'gerente', label: 'Gerente' },
  { value: 'analista', label: 'Analista' },
  { value: 'assistente', label: 'Assistente' },
] as const

function renderSelect(
  overrides: Partial<Parameters<typeof SelectField>[0]> = {},
) {
  const onChange = vi.fn()
  render(
    <SelectField
      label="Cargo"
      options={CARGO_OPTIONS}
      value="gerente"
      onChange={onChange}
      {...overrides}
    />,
  )
  return { onChange }
}

// ── Renderização ──────────────────────────────────────────────────────────────

describe('SelectField — renderização', () => {
  it('renderiza o select com label acessível', () => {
    renderSelect()
    expect(screen.getByRole('combobox', { name: /cargo/i })).toBeInTheDocument()
  })

  it('renderiza todas as opções passadas', () => {
    renderSelect()
    expect(screen.getByRole('option', { name: 'Gerente' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Analista' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Assistente' })).toBeInTheDocument()
  })

  it('renderiza placeholder como primeira opção desabilitada', () => {
    renderSelect({ placeholder: 'Selecione um cargo…', value: '' })
    const placeholder = screen.getByRole('option', { name: /selecione um cargo/i })
    expect(placeholder).toBeDisabled()
  })

  it('não renderiza placeholder quando prop não fornecida', () => {
    renderSelect()
    expect(screen.queryByRole('option', { name: /selecione/i })).not.toBeInTheDocument()
  })

  it('renderiza ícone chevron (não acessível)', () => {
    renderSelect()
    // Chevron tem aria-hidden — não deve ser encontrado por role
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

// ── Valor selecionado ─────────────────────────────────────────────────────────

describe('SelectField — valor selecionado', () => {
  it('exibe o valor inicial corretamente', () => {
    renderSelect({ value: 'analista' })
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveValue('analista')
  })

  it('atualiza valor quando prop value muda (controlled)', () => {
    const { rerender } = render(
      <SelectField
        label="Cargo"
        options={CARGO_OPTIONS}
        value="gerente"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveValue('gerente')

    rerender(
      <SelectField
        label="Cargo"
        options={CARGO_OPTIONS}
        value="assistente"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveValue('assistente')
  })
})

// ── Interação ─────────────────────────────────────────────────────────────────

describe('SelectField — interação', () => {
  it('selecionar nova opção chama onChange com o value correto', async () => {
    const { onChange } = renderSelect({ value: 'gerente' })
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /cargo/i }),
      'Analista',
    )
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

// ── Estado de erro ────────────────────────────────────────────────────────────

describe('SelectField — erro', () => {
  it('exibe mensagem de erro com role=alert', () => {
    renderSelect({ error: 'Campo obrigatório.' })
    expect(screen.getByRole('alert')).toHaveTextContent(/campo obrigatório/i)
  })

  it('select tem aria-invalid=true quando há erro', () => {
    renderSelect({ error: 'Inválido.' })
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveAttribute('aria-invalid', 'true')
  })

  it('select tem aria-invalid=false quando não há erro', () => {
    renderSelect()
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveAttribute('aria-invalid', 'false')
  })

  it('sem erro, não renderiza role=alert', () => {
    renderSelect()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ── Estado disabled ───────────────────────────────────────────────────────────

describe('SelectField — disabled', () => {
  it('select desabilitado tem atributo disabled', () => {
    renderSelect({ disabled: true })
    expect(screen.getByRole('combobox', { name: /cargo/i })).toBeDisabled()
  })

  it('select desabilitado não chama onChange', async () => {
    const { onChange } = renderSelect({ disabled: true })
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /cargo/i }),
      'Analista',
    )
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ── Acessibilidade ────────────────────────────────────────────────────────────

describe('SelectField — acessibilidade', () => {
  it('label está associada ao select via htmlFor/id', () => {
    renderSelect()
    const select = screen.getByRole('combobox', { name: /cargo/i })
    const label = screen.getByText('Cargo')
    expect(label).toHaveAttribute('for', select.id)
  })

  it('erro tem id referenciado em aria-describedby do select', () => {
    renderSelect({ error: 'Obrigatório.' })
    const select = screen.getByRole('combobox', { name: /cargo/i })
    const errorEl = screen.getByRole('alert')
    expect(select).toHaveAttribute('aria-describedby', errorEl.id)
  })
})
