import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MaskedTextField } from './MaskedTextField'

// ── Renderização ──────────────────────────────────────────────────────────────

describe('MaskedTextField — renderização', () => {
  it('renderiza o campo com label acessível', () => {
    render(<MaskedTextField label="CPF" mask="cpf" />)
    expect(screen.getByRole('textbox', { name: /cpf/i })).toBeInTheDocument()
  })

  it('renderiza com valor inicial formatado', () => {
    render(<MaskedTextField label="CPF" mask="cpf" value="123.456.789-01" readOnly />)
    expect(screen.getByRole('textbox', { name: /cpf/i })).toHaveValue('123.456.789-01')
  })

  it('exibe erro com role=alert e aria-invalid', () => {
    render(<MaskedTextField label="CPF" mask="cpf" error="CPF inválido." />)
    expect(screen.getByRole('alert')).toHaveTextContent(/cpf inválido/i)
    expect(screen.getByRole('textbox', { name: /cpf/i })).toHaveAttribute('aria-invalid', 'true')
  })

  it('tipo do input é sempre "text"', () => {
    render(<MaskedTextField label="Telefone" mask="telefone" />)
    expect(screen.getByRole('textbox', { name: /telefone/i })).toHaveAttribute('type', 'text')
  })
})

// ── Máscara CPF ───────────────────────────────────────────────────────────────

describe('MaskedTextField — máscara CPF', () => {
  it('formata CPF com 11 dígitos quando valor é passado diretamente', () => {
    const onChange = vi.fn()
    render(<MaskedTextField label="CPF" mask="cpf" value="" onChange={onChange} />)
    // fireEvent.change simula o valor completo que chegaria ao handler (sem acumulação controlada)
    fireEvent.change(screen.getByRole('textbox', { name: /cpf/i }), {
      target: { value: '12345678901' },
    })
    expect(onChange).toHaveBeenCalledWith('123.456.789-01')
  })

  it('chama onChange com valor formatado parcialmente', () => {
    const onChange = vi.fn()
    render(<MaskedTextField label="CPF" mask="cpf" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox', { name: /cpf/i }), {
      target: { value: '123' },
    })
    expect(onChange).toHaveBeenCalledWith('123')
  })
})

// ── Máscara CNPJ ──────────────────────────────────────────────────────────────

describe('MaskedTextField — máscara CNPJ', () => {
  it('formata CNPJ completo corretamente', () => {
    const onChange = vi.fn()
    render(<MaskedTextField label="CNPJ" mask="cnpj" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox', { name: /cnpj/i }), {
      target: { value: '12345678000195' },
    })
    expect(onChange).toHaveBeenCalledWith('12.345.678/0001-95')
  })
})

// ── Máscara Telefone ──────────────────────────────────────────────────────────

describe('MaskedTextField — máscara telefone', () => {
  it('formata celular (11 dígitos) corretamente', () => {
    const onChange = vi.fn()
    render(<MaskedTextField label="Telefone" mask="telefone" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox', { name: /telefone/i }), {
      target: { value: '11987654321' },
    })
    expect(onChange).toHaveBeenCalledWith('(11) 98765-4321')
  })

  it('inputMode é "numeric" para teclado numérico em mobile', () => {
    render(<MaskedTextField label="Telefone" mask="telefone" />)
    expect(screen.getByRole('textbox', { name: /telefone/i })).toHaveAttribute(
      'inputmode',
      'numeric',
    )
  })
})

// ── Máscara Moeda ─────────────────────────────────────────────────────────────

describe('MaskedTextField — máscara moeda', () => {
  it('formata valor monetário corretamente', () => {
    const onChange = vi.fn()
    render(<MaskedTextField label="Valor" mask="moeda" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox', { name: /valor/i }), {
      target: { value: '100' },
    })
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('R$'))
  })

  it('inputMode é "decimal" para moeda', () => {
    render(<MaskedTextField label="Valor" mask="moeda" />)
    expect(screen.getByRole('textbox', { name: /valor/i })).toHaveAttribute(
      'inputmode',
      'decimal',
    )
  })
})

// ── Estado disabled ───────────────────────────────────────────────────────────

describe('MaskedTextField — disabled', () => {
  it('campo desabilitado não chama onChange', async () => {
    const onChange = vi.fn()
    render(
      <MaskedTextField label="CPF" mask="cpf" value="123" onChange={onChange} disabled />,
    )
    await userEvent.type(screen.getByRole('textbox', { name: /cpf/i }), '456')
    expect(onChange).not.toHaveBeenCalled()
  })
})
