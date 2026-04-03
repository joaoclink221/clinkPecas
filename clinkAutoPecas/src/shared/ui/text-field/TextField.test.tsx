import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TextField } from './TextField'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

describe('TextField', () => {
  it('associa label ao input e permite digitar', async () => {
    const user = userEvent.setup()
    render(<TextField label="Buscar SKU" placeholder="Ex.: OB-4492" />)

    const field = screen.getByRole('textbox', { name: /buscar sku/i })
    await user.type(field, 'OB-1')
    expect(field).toHaveValue('OB-1')
  })

  it('renderiza ícone decorativo sem expor como nome acessível do campo', () => {
    render(<TextField label="Filtro" leadingIcon={<SearchIcon />} />)

    expect(screen.getByRole('textbox', { name: /filtro/i })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  /**
   * Erro controlado: garante anúncio para leitores de tela e estado inválido explícito.
   */
  it('exibe erro com role=alert e marca aria-invalid', () => {
    render(<TextField label="E-mail" error="Formato inválido." defaultValue="x" />)

    const field = screen.getByRole('textbox', { name: /e-mail/i })
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent(/formato inválido/i)
  })

  it('não renderiza alerta quando error está vazio', () => {
    render(<TextField label="Nome" error="" />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
