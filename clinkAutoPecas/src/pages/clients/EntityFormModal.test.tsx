import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EntityFormModal } from './EntityFormModal'

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderModal(open = true, onClose = vi.fn()) {
  render(<EntityFormModal open={open} onClose={onClose} />)
  return { onClose }
}

// ── 1.1 — Container + Overlay + Botão X ──────────────────────────────────────

describe('EntityFormModal 1.1 — container e overlay', () => {
  it('não renderiza nada quando open=false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza o dialog quando open=true', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog tem aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('dialog tem aria-labelledby apontando para título acessível', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toBeInTheDocument()
  })

  it('botão X está presente com aria-label correto', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /fechar modal/i })).toBeInTheDocument()
  })

  it('botão X chama onClose ao clicar', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicar no overlay (fora do modal) chama onClose', async () => {
    const { onClose } = renderModal()
    // O overlay é o elemento com role="presentation"
    const overlay = screen.getByRole('presentation')
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicar dentro do modal NÃO chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })
})

// ── 1.2 — Sidebar esquerda ────────────────────────────────────────────────────

describe('EntityFormModal 1.2 — sidebar esquerda', () => {
  it('sidebar está presente com role="complementary" ou aria-label', () => {
    renderModal()
    expect(
      screen.getByRole('complementary', { name: /informações do formulário/i }),
    ).toBeInTheDocument()
  })

  it('exibe o título "Registro de Entidade"', () => {
    renderModal()
    expect(
      screen.getByRole('heading', { name: /registro de entidade/i }),
    ).toBeInTheDocument()
  })

  it('exibe o parágrafo descritivo sobre integridade de dados', () => {
    renderModal()
    expect(screen.getByText(/integridade da base de dados/i)).toBeInTheDocument()
  })

  it('exibe o texto "OBSIDIAN INTELLIGENCE" no rodapé da sidebar', () => {
    renderModal()
    expect(screen.getByText(/obsidian intelligence/i)).toBeInTheDocument()
  })
})

// ── 1.3 — Área do formulário e rodapé de ações ────────────────────────────────

describe('EntityFormModal 1.3 — área do formulário e rodapé', () => {
  it('exibe os slots de seção como placeholders visuais', () => {
    renderModal()
    expect(screen.getByText(/tipo de vínculo/i)).toBeInTheDocument()
    expect(screen.getByText(/natureza jurídica/i)).toBeInTheDocument()
    expect(screen.getByText(/canais de contato/i)).toBeInTheDocument()
    expect(screen.getByText(/logradouro principal/i)).toBeInTheDocument()
    expect(screen.getByText(/parâmetros comerciais/i)).toBeInTheDocument()
  })

  it('botão "Cancelar" está presente', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('botão "Salvar Cadastro" está presente', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeInTheDocument()
  })

  it('botão "Salvar Cadastro" está desabilitado nesta fase', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeDisabled()
  })

  it('botão "Cancelar" chama onClose ao clicar', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('os dois botões estão alinhados no rodapé (ambos visíveis)', () => {
    renderModal()
    const buttons = screen.getAllByRole('button')
    // Esperado: X (fechar) + Cancelar + Salvar Cadastro = pelo menos 3 botões
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })
})

// ── Acessibilidade geral ──────────────────────────────────────────────────────

describe('EntityFormModal — acessibilidade', () => {
  it('modal reaparece ao abrir após ter sido fechado (re-mount)', () => {
    const { rerender } = render(
      <EntityFormModal open={false} onClose={vi.fn()} />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<EntityFormModal open={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('botão X tem type="button" para evitar submit acidental', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /fechar modal/i })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('botão Cancelar tem type="button" para evitar submit acidental', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /cancelar/i })).toHaveAttribute(
      'type',
      'button',
    )
  })
})

// ── 2.1 — Toggle Tipo de Vínculo ─────────────────────────────────────────────

describe('EntityFormModal 2.1 — Toggle Tipo de Vínculo', () => {
  it('renderiza o grupo "Tipo de Vínculo" com as duas opções', () => {
    renderModal()
    const group = screen.getByRole('group', { name: /tipo de vínculo/i })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cliente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fornecedor/i })).toBeInTheDocument()
  })

  it('"Cliente" está ativo por padrão (aria-pressed="true")', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /^cliente$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('"Fornecedor" está inativo por padrão (aria-pressed="false")', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /fornecedor/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('clicar em "Fornecedor" o torna ativo e desativa "Cliente"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /fornecedor/i }))
    expect(screen.getByRole('button', { name: /fornecedor/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /^cliente$/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('apenas um botão com aria-pressed="true" por vez no grupo de vínculo', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /fornecedor/i }))
    const group = screen.getByRole('group', { name: /tipo de vínculo/i })
    const pressedButtons = Array.from(group.querySelectorAll('[aria-pressed="true"]'))
    expect(pressedButtons).toHaveLength(1)
  })

  it('clicar no botão já ativo não o desativa', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^cliente$/i }))
    expect(screen.getByRole('button', { name: /^cliente$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

// ── 2.2 — Toggle Natureza Jurídica ───────────────────────────────────────────

describe('EntityFormModal 2.2 — Toggle Natureza Jurídica', () => {
  it('renderiza o grupo "Natureza Jurídica" com as duas opções', () => {
    renderModal()
    const group = screen.getByRole('group', { name: /natureza jurídica/i })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pessoa física/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pessoa jurídica/i })).toBeInTheDocument()
  })

  it('"Pessoa Jurídica" está ativa por padrão (aria-pressed="true")', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /pessoa jurídica/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('"Pessoa Física" está inativa por padrão (aria-pressed="false")', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /pessoa física/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('clicar em "Pessoa Física" a torna ativa e desativa "Pessoa Jurídica"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByRole('button', { name: /pessoa física/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /pessoa jurídica/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('apenas um botão com aria-pressed="true" por vez no grupo de natureza', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    const group = screen.getByRole('group', { name: /natureza jurídica/i })
    const pressedButtons = Array.from(group.querySelectorAll('[aria-pressed="true"]'))
    expect(pressedButtons).toHaveLength(1)
  })

  it('os dois toggles são independentes — mudar vínculo não afeta natureza', async () => {
    renderModal()
    // natureza começa em jurídica
    expect(screen.getByRole('button', { name: /pessoa jurídica/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // altera vínculo para fornecedor
    await userEvent.click(screen.getByRole('button', { name: /fornecedor/i }))
    // natureza permanece jurídica
    expect(screen.getByRole('button', { name: /pessoa jurídica/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('os dois toggles são independentes — mudar natureza não afeta vínculo', async () => {
    renderModal()
    // vínculo começa em cliente
    expect(screen.getByRole('button', { name: /^cliente$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // altera natureza para física
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    // vínculo permanece cliente
    expect(screen.getByRole('button', { name: /^cliente$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

// ── 3.1 — Campo Razão Social / Nome Completo ─────────────────────────────────

describe('EntityFormModal 3.1 — Campo nome com label dinâmico', () => {
  it('exibe label "Razão Social / Nome Completo" quando natureza é jurídica (padrão)', () => {
    renderModal()
    expect(
      screen.getByLabelText(/razão social \/ nome completo/i),
    ).toBeInTheDocument()
  })

  it('exibe placeholder para pessoa jurídica por padrão', () => {
    renderModal()
    expect(
      screen.getByPlaceholderText(/logística avançada/i),
    ).toBeInTheDocument()
  })

  it('label muda para "Nome Completo" ao alternar para Pessoa Física', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByLabelText(/^nome completo$/i)).toBeInTheDocument()
  })

  it('placeholder muda para pessoa física ao alternar', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByPlaceholderText(/joão da silva/i)).toBeInTheDocument()
  })

  it('aceita digitação e mantém o valor', async () => {
    renderModal()
    const input = screen.getByLabelText(/razão social/i)
    await userEvent.type(input, 'Empresa XYZ')
    expect(input).toHaveValue('Empresa XYZ')
  })

  it('alternar natureza NÃO limpa o campo nome', async () => {
    renderModal()
    const input = screen.getByLabelText(/razão social/i)
    await userEvent.type(input, 'Empresa XYZ')
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByLabelText(/^nome completo$/i)).toHaveValue('Empresa XYZ')
  })
})

// ── 3.2 — Campo CNPJ / CPF com máscara dinâmica ──────────────────────────────

describe('EntityFormModal 3.2 — Campo documento com máscara dinâmica', () => {
  it('exibe label "CNPJ" quando natureza é jurídica (padrão)', () => {
    renderModal()
    expect(screen.getByLabelText(/^cnpj$/i)).toBeInTheDocument()
  })

  it('exibe placeholder CNPJ por padrão', () => {
    renderModal()
    expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument()
  })

  it('label muda para "CPF" ao alternar para Pessoa Física', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByLabelText(/^cpf$/i)).toBeInTheDocument()
  })

  it('placeholder muda para CPF ao alternar', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument()
  })

  it('aplica máscara CNPJ ao digitar como pessoa jurídica', async () => {
    renderModal()
    const input = screen.getByLabelText(/^cnpj$/i)
    await userEvent.type(input, '11222333000181')
    expect(input).toHaveValue('11.222.333/0001-81')
  })

  it('aplica máscara CPF ao digitar como pessoa física', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    const input = screen.getByLabelText(/^cpf$/i)
    await userEvent.type(input, '12345678909')
    expect(input).toHaveValue('123.456.789-09')
  })

  it('limpa o campo documento ao trocar de jurídica para física', async () => {
    renderModal()
    const cnpjInput = screen.getByLabelText(/^cnpj$/i)
    await userEvent.type(cnpjInput, '11222333000181')
    expect(cnpjInput).toHaveValue('11.222.333/0001-81')

    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    expect(screen.getByLabelText(/^cpf$/i)).toHaveValue('')
  })

  it('limpa o campo documento ao trocar de física para jurídica', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    const cpfInput = screen.getByLabelText(/^cpf$/i)
    await userEvent.type(cpfInput, '12345678909')
    expect(cpfInput).toHaveValue('123.456.789-09')

    await userEvent.click(screen.getByRole('button', { name: /pessoa jurídica/i }))
    expect(screen.getByLabelText(/^cnpj$/i)).toHaveValue('')
  })
})

// ── 4.1 — Grupo Canais de Contato ────────────────────────────────────────────

describe('EntityFormModal 4.1 — Canais de Contato', () => {
  it('exibe o cabeçalho "CANAIS DE CONTATO"', () => {
    renderModal()
    expect(screen.getByText(/canais de contato/i)).toBeInTheDocument()
  })

  it('renderiza campo de e-mail com placeholder correto', () => {
    renderModal()
    expect(screen.getByLabelText(/^e-mail$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('email@exemplo.com.br')).toBeInTheDocument()
  })

  it('campo e-mail tem type="email"', () => {
    renderModal()
    expect(screen.getByLabelText(/^e-mail$/i)).toHaveAttribute('type', 'email')
  })

  it('renderiza campo de telefone com placeholder correto', () => {
    renderModal()
    expect(screen.getByLabelText(/^telefone$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('(00) 00000-0000')).toBeInTheDocument()
  })

  it('aplica máscara de telefone ao digitar', async () => {
    renderModal()
    const input = screen.getByLabelText(/^telefone$/i)
    await userEvent.type(input, '11987654321')
    expect(input).toHaveValue('(11) 98765-4321')
  })

  it('aceita digitação no campo e-mail', async () => {
    renderModal()
    const input = screen.getByLabelText(/^e-mail$/i)
    await userEvent.type(input, 'contato@empresa.com')
    expect(input).toHaveValue('contato@empresa.com')
  })
})

// ── 4.2 — Grupo Logradouro Principal ─────────────────────────────────────────

describe('EntityFormModal 4.2 — Logradouro Principal', () => {
  it('exibe o cabeçalho "LOGRADOURO PRINCIPAL"', () => {
    renderModal()
    expect(screen.getByText(/logradouro principal/i)).toBeInTheDocument()
  })

  it('renderiza campo "Rua, Avenida ou Alameda"', () => {
    renderModal()
    expect(screen.getByLabelText(/rua, avenida ou alameda/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/av\. paulista/i)).toBeInTheDocument()
  })

  it('renderiza campo "Número"', () => {
    renderModal()
    expect(screen.getByLabelText(/^número$/i)).toBeInTheDocument()
  })

  it('renderiza campo "CEP" com placeholder correto', () => {
    renderModal()
    expect(screen.getByLabelText(/^cep$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument()
  })

  it('aplica máscara de CEP ao digitar', async () => {
    renderModal()
    const input = screen.getByLabelText(/^cep$/i)
    await userEvent.type(input, '01310100')
    expect(input).toHaveValue('01310-100')
  })

  it('renderiza campo "Cidade"', () => {
    renderModal()
    expect(screen.getByLabelText(/^cidade$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/são paulo/i)).toBeInTheDocument()
  })

  it('renderiza campo "UF" com maxLength=2', () => {
    renderModal()
    const uf = screen.getByLabelText(/^uf$/i)
    expect(uf).toBeInTheDocument()
    expect(uf).toHaveAttribute('maxLength', '2')
  })

  it('campo UF converte para uppercase automaticamente', async () => {
    renderModal()
    const input = screen.getByLabelText(/^uf$/i)
    await userEvent.type(input, 'sp')
    expect(input).toHaveValue('SP')
  })

  it('todos os 5 campos de endereço estão presentes', () => {
    renderModal()
    expect(screen.getByLabelText(/rua, avenida ou alameda/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^número$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^cep$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^cidade$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^uf$/i)).toBeInTheDocument()
  })
})

// ── 5.1 — Parâmetros Comerciais (Cliente) ────────────────────────────────

describe('EntityFormModal 5.1 — Parâmetros Comerciais (Cliente)', () => {
  it('exibe o header "Parâmetros Comerciais (Cliente)" por padrão', () => {
    renderModal()
    expect(screen.getByText(/parâmetros comerciais \(cliente\)/i)).toBeInTheDocument()
  })

  it('exibe campo "Limite de Crédito Disponível" com prefixo R$', () => {
    renderModal()
    expect(screen.getByLabelText(/limite de crédito disponível/i)).toBeInTheDocument()
    expect(screen.getByText('R$')).toBeInTheDocument()
  })

  it('exibe campo "Prazo de Entrega" com sufixo DIAS', () => {
    renderModal()
    expect(screen.getByLabelText(/prazo de entrega/i)).toBeInTheDocument()
    const diasElements = screen.getAllByText(/^dias$/i)
    expect(diasElements.length).toBeGreaterThan(0)
  })

  it('aceita digitação no campo Prazo de Entrega', async () => {
    renderModal()
    const input = screen.getByLabelText(/prazo de entrega/i)
    await userEvent.type(input, '30')
    expect(input).toHaveValue('30')
  })
})

// ── 5.2 — Parâmetros Comerciais (Fornecedor) ───────────────────────────

describe('EntityFormModal 5.2 — Parâmetros Comerciais (Fornecedor)', () => {
  it('ao selecionar Fornecedor, header muda para "Parâmetros Comerciais (Fornecedor)"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    expect(screen.getByText(/parâmetros comerciais \(fornecedor\)/i)).toBeInTheDocument()
  })

  it('exibe campo "Prazo de Pagamento (Dias)" na variante fornecedor', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    expect(screen.getByLabelText(/prazo de pagamento/i)).toBeInTheDocument()
  })

  it('exibe campo "Desconto Padrão (%)" na variante fornecedor', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    expect(screen.getByLabelText(/desconto padrão/i)).toBeInTheDocument()
  })

  it('trocar para Fornecedor oculta campos do Cliente', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    expect(screen.queryByLabelText(/limite de crédito/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/prazo de entrega/i)).not.toBeInTheDocument()
  })

  it('trocar de volta para Cliente oculta campos do Fornecedor', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^cliente$/i }))
    expect(screen.queryByLabelText(/prazo de pagamento/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/desconto padrão/i)).not.toBeInTheDocument()
  })

  it('valores dos parâmetros são limpos ao trocar vínculo', async () => {
    renderModal()
    const prazoEntregaInput = screen.getByLabelText(/prazo de entrega/i)
    await userEvent.type(prazoEntregaInput, '15')
    expect(prazoEntregaInput).toHaveValue('15')
    // troca e volta
    await userEvent.click(screen.getByRole('button', { name: /^fornecedor$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^cliente$/i }))
    expect(screen.getByLabelText(/prazo de entrega/i)).toHaveValue('')
  })
})

// ── 5.3 — Validação e Submit ──────────────────────────────────────────

async function fillRequiredFields() {
  await userEvent.type(screen.getByLabelText(/razão social/i), 'Empresa XYZ')
  await userEvent.type(screen.getByLabelText(/^cnpj$/i), '11222333000181')
  await userEvent.type(screen.getByLabelText(/^e-mail$/i), 'contato@empresa.com')
  await userEvent.type(screen.getByLabelText(/^telefone$/i), '11987654321')
}

describe('EntityFormModal 5.3 — Validação e Submit', () => {
  it('botão "Salvar Cadastro" está desabilitado com formulário vazio', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeDisabled()
  })

  it('botão permanece desabilitado se apenas nome preenchido', async () => {
    renderModal()
    await userEvent.type(screen.getByLabelText(/razão social/i), 'Empresa XYZ')
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeDisabled()
  })

  it('botão permanece desabilitado com CNPJ incompleto', async () => {
    renderModal()
    await userEvent.type(screen.getByLabelText(/razão social/i), 'Empresa XYZ')
    await userEvent.type(screen.getByLabelText(/^cnpj$/i), '112223')
    await userEvent.type(screen.getByLabelText(/^e-mail$/i), 'test@test.com')
    await userEvent.type(screen.getByLabelText(/^telefone$/i), '11987654321')
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeDisabled()
  })

  it('botão é habilitado quando todos os obrigatórios estão válidos (CNPJ)', async () => {
    renderModal()
    await fillRequiredFields()
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeEnabled()
  })

  it('botão é habilitado com CPF completo (Pessoa Física)', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /pessoa física/i }))
    await userEvent.type(screen.getByLabelText(/^nome completo$/i), 'João da Silva')
    await userEvent.type(screen.getByLabelText(/^cpf$/i), '12345678909')
    await userEvent.type(screen.getByLabelText(/^e-mail$/i), 'joao@email.com')
    await userEvent.type(screen.getByLabelText(/^telefone$/i), '11987654321')
    expect(screen.getByRole('button', { name: /salvar cadastro/i })).toBeEnabled()
  })

  it('clicar em Salvar com dados válidos exibe toast de sucesso', async () => {
    renderModal()
    await fillRequiredFields()
    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /salvar cadastro/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/entidade cadastrada com sucesso/i)
    vi.useRealTimers()
  })

  it('onClose é chamado após 1500ms do submit', async () => {
    const { onClose } = renderModal()
    await fillRequiredFields()
    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /salvar cadastro/i }))
    act(() => { vi.advanceTimersByTime(1500) })
    expect(onClose).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
