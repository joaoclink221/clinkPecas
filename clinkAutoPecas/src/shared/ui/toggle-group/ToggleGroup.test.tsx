import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ToggleGroup } from './ToggleGroup'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TIPO_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'fornecedor', label: 'Fornecedor' },
] as const

const PESSOA_OPTIONS = [
  { value: 'pf', label: 'Pessoa Física' },
  { value: 'pj', label: 'Pessoa Jurídica' },
] as const

function renderToggle(
  overrides: Partial<Parameters<typeof ToggleGroup>[0]> = {},
) {
  const onChange = vi.fn()
  render(
    <ToggleGroup
      label="Tipo de vínculo"
      options={TIPO_OPTIONS}
      value="cliente"
      onChange={onChange}
      {...overrides}
    />,
  )
  return { onChange }
}

// ── Renderização ──────────────────────────────────────────────────────────────

describe('ToggleGroup — renderização', () => {
  it('renderiza todos os rótulos das opções', () => {
    renderToggle()
    expect(screen.getByRole('button', { name: 'Cliente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fornecedor' })).toBeInTheDocument()
  })

  it('renderiza o grupo com aria-label correto', () => {
    renderToggle()
    expect(screen.getByRole('group', { name: 'Tipo de vínculo' })).toBeInTheDocument()
  })

  it('renderiza com três ou mais opções sem erros', () => {
    renderToggle({
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ],
      value: 'a',
    })
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })
})

// ── Estado ativo (aria-pressed) ───────────────────────────────────────────────

describe('ToggleGroup — estado ativo', () => {
  it('opção com value igual ao prop value tem aria-pressed="true"', () => {
    renderToggle({ value: 'cliente' })
    expect(screen.getByRole('button', { name: 'Cliente' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('opção inativa tem aria-pressed="false"', () => {
    renderToggle({ value: 'cliente' })
    expect(screen.getByRole('button', { name: 'Fornecedor' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('trocar value muda qual botão está pressionado', () => {
    const { rerender } = render(
      <ToggleGroup
        label="Tipo"
        options={TIPO_OPTIONS}
        value="cliente"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Cliente' })).toHaveAttribute('aria-pressed', 'true')

    rerender(
      <ToggleGroup
        label="Tipo"
        options={TIPO_OPTIONS}
        value="fornecedor"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Fornecedor' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Cliente' })).toHaveAttribute('aria-pressed', 'false')
  })
})

// ── Interação do usuário ──────────────────────────────────────────────────────

describe('ToggleGroup — interação', () => {
  it('clicar numa opção inativa chama onChange com o value correto', async () => {
    const { onChange } = renderToggle({ value: 'cliente' })
    await userEvent.click(screen.getByRole('button', { name: 'Fornecedor' }))
    expect(onChange).toHaveBeenCalledWith('fornecedor')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('clicar na opção já ativa não chama onChange', async () => {
    const { onChange } = renderToggle({ value: 'cliente' })
    await userEvent.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('funciona corretamente com opções de Pessoa Física/Jurídica', async () => {
    const onChange = vi.fn()
    render(
      <ToggleGroup
        label="Tipo de pessoa"
        options={PESSOA_OPTIONS}
        value="pf"
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Pessoa Jurídica' }))
    expect(onChange).toHaveBeenCalledWith('pj')
  })
})

// ── Estado disabled ───────────────────────────────────────────────────────────

describe('ToggleGroup — disabled', () => {
  it('disabled=true desabilita todos os botões', () => {
    renderToggle({ disabled: true })
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('botão desabilitado globalmente não chama onChange ao clicar', async () => {
    const { onChange } = renderToggle({ disabled: true })
    await userEvent.click(screen.getByRole('button', { name: 'Fornecedor' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opção com disabled individual fica desabilitada; outras continuam ativas', async () => {
    const { onChange } = renderToggle({
      options: [
        { value: 'cliente', label: 'Cliente' },
        { value: 'fornecedor', label: 'Fornecedor', disabled: true },
      ],
      value: 'cliente',
    })

    expect(screen.getByRole('button', { name: 'Fornecedor' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cliente' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Fornecedor' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opção ativa permanece com aria-pressed="true" mesmo quando desabilitada', () => {
    renderToggle({ disabled: true, value: 'cliente' })
    expect(screen.getByRole('button', { name: 'Cliente' })).toHaveAttribute('aria-pressed', 'true')
  })
})

// ── Tamanhos (size) ───────────────────────────────────────────────────────────

describe('ToggleGroup — size', () => {
  it('size="sm" aplica classe px-3 nos botões', () => {
    renderToggle({ size: 'sm' })
    const btn = screen.getByRole('button', { name: 'Cliente' })
    expect(btn.className).toMatch(/px-3/)
  })

  it('size="md" aplica classe px-4 nos botões (padrão)', () => {
    renderToggle({ size: 'md' })
    const btn = screen.getByRole('button', { name: 'Cliente' })
    expect(btn.className).toMatch(/px-4/)
  })

  it('size padrão é "md" quando não especificado', () => {
    renderToggle()
    const btn = screen.getByRole('button', { name: 'Cliente' })
    expect(btn.className).toMatch(/px-4/)
  })
})

// ── Acessibilidade ────────────────────────────────────────────────────────────

describe('ToggleGroup — acessibilidade', () => {
  it('o grupo tem role="group"', () => {
    renderToggle()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('cada opção tem type="button" para não submeter formulários acidentalmente', () => {
    renderToggle()
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button')
    })
  })

  it('label diferente é refletido no aria-label do grupo', () => {
    renderToggle({ label: 'Selecione o perfil' })
    expect(screen.getByRole('group', { name: 'Selecione o perfil' })).toBeInTheDocument()
  })

  it('navegação por teclado — Tab move o foco entre os botões', async () => {
    renderToggle()
    // Foca no primeiro botão
    screen.getByRole('button', { name: 'Cliente' }).focus()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cliente' }))

    // Tab avança para o próximo botão
    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fornecedor' }))
  })
})
