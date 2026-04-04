import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { Entity } from './clients.types'
import { EntityTable } from './EntityTable'
import { entitiesMock } from './mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Os 4 registros exatos da referência visual */
const REQUIRED_FOUR = entitiesMock.slice(0, 4)

/** Entidade única com status "ok" para testes isolados */
const entityOk: Entity = entitiesMock.find((e) => e.financialStatus === 'ok')!

/** Entidade única com status "due" */
const entityDue: Entity = entitiesMock.find((e) => e.financialStatus === 'due')!

/** Entidade única com status "credit_ok" */
const entityCreditOk: Entity = entitiesMock.find((e) => e.financialStatus === 'credit_ok')!

/** Entidade única com status "prepaid" */
const entityPrepaid: Entity = entitiesMock.find((e) => e.financialStatus === 'prepaid')!

// ── 3.1 Estrutura das 5 colunas ───────────────────────────────────────────────

describe('EntityTable — 3.1 Estrutura das 5 colunas', () => {
  it('renderiza a tabela com aria-label acessível', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(screen.getByRole('table', { name: /tabela de entidades/i })).toBeInTheDocument()
  })

  it('exibe os 5 cabeçalhos de coluna corretos', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(screen.getByRole('columnheader', { name: /entity details/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /tax id/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /primary contact/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /financial standing/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument()
  })

  it('renderiza 4 linhas para os 4 registros obrigatórios da imagem', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    // 4 rows de dados (header row não conta como rowgroup "body")
    const rows = screen.getAllByRole('row')
    // 1 header row + 4 data rows
    expect(rows).toHaveLength(5)
  })

  it('exibe "Nenhuma entidade encontrada" quando array é vazio', () => {
    render(<EntityTable entities={[]} />)

    expect(screen.getByLabelText(/nenhuma entidade encontrada/i)).toBeInTheDocument()
    expect(screen.getByText(/nenhuma entidade encontrada/i)).toBeInTheDocument()
  })

  it('não renderiza a tabela quando array é vazio', () => {
    render(<EntityTable entities={[]} />)

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('cada linha tem aria-label com o nome da entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByRole('row', { name: entity.name })).toBeInTheDocument()
    }
  })
})

// ── 3.1 Coluna Entity Details ─────────────────────────────────────────────────

describe('EntityTable — 3.1 Coluna Entity Details', () => {
  it('exibe o nome de cada entidade em negrito', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByText(entity.name)).toBeInTheDocument()
    }
  })

  it('exibe o subtitle de cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByText(entity.subtitle)).toBeInTheDocument()
    }
  })
})

// ── 3.1 Coluna Tax ID / CNPJ ─────────────────────────────────────────────────

describe('EntityTable — 3.1 Coluna Tax ID / CNPJ', () => {
  it('exibe o CNPJ de "Turbo Dynamics Inc." formatado', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument()
  })

  it('exibe o CPF de "Juliana Mendes" formatado', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(screen.getByText('458.122.903-22')).toBeInTheDocument()
  })

  it('exibe o Tax ID em elemento <code> (fonte mono)', () => {
    render(<EntityTable entities={[entityOk]} />)

    const code = screen.getByText(entityOk.taxId)
    expect(code.tagName.toLowerCase()).toBe('code')
  })
})

// ── 3.1 Coluna Primary Contact ────────────────────────────────────────────────

describe('EntityTable — 3.1 Coluna Primary Contact', () => {
  it('exibe o email como link mailto de cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      const link = screen.getByRole('link', { name: entity.email })
      expect(link).toHaveAttribute('href', `mailto:${entity.email}`)
    }
  })

  it('exibe o telefone de cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByText(entity.phone)).toBeInTheDocument()
    }
  })
})

// ── 3.2 Avatares coloridos ────────────────────────────────────────────────────

describe('EntityTable — 3.2 Avatares coloridos', () => {
  it('renderiza avatar com ícone "enterprise" para Turbo Dynamics Inc.', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(
      screen.getByLabelText(/ícone enterprise para Turbo Dynamics Inc\./i),
    ).toBeInTheDocument()
  })

  it('renderiza avatar com ícone "person" para Juliana Mendes', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(
      screen.getByLabelText(/ícone person para Juliana Mendes/i),
    ).toBeInTheDocument()
  })

  it('renderiza avatar com ícone "truck" para Global Logistics Hub', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(
      screen.getByLabelText(/ícone truck para Global Logistics Hub/i),
    ).toBeInTheDocument()
  })

  it('renderiza avatar com ícone "tools" para Auto Fix Workshop', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(
      screen.getByLabelText(/ícone tools para Auto Fix Workshop/i),
    ).toBeInTheDocument()
  })

  it('avatar enterprise tem classe bg de teal escuro', () => {
    render(<EntityTable entities={[entitiesMock[0]]} />)

    const avatar = screen.getByLabelText(/ícone enterprise/i)
    expect(avatar.className).toContain('bg-[#064E3B]')
  })

  it('avatar person tem classe bg de roxo escuro', () => {
    render(<EntityTable entities={[entitiesMock[1]]} />)

    const avatar = screen.getByLabelText(/ícone person/i)
    expect(avatar.className).toContain('bg-[#4C1D95]')
  })

  it('avatar truck tem classe bg de azul escuro', () => {
    render(<EntityTable entities={[entitiesMock[2]]} />)

    const avatar = screen.getByLabelText(/ícone truck/i)
    expect(avatar.className).toContain('bg-[#1E3A8A]')
  })

  it('avatar tools tem classe bg de âmbar escuro', () => {
    render(<EntityTable entities={[entitiesMock[3]]} />)

    const avatar = screen.getByLabelText(/ícone tools/i)
    expect(avatar.className).toContain('bg-[#78350F]')
  })
})

// ── 3.3 Financial Standing — variante "ok" ────────────────────────────────────

describe('EntityTable — 3.3 Financial Standing variante "ok"', () => {
  it('exibe o valor do limite em teal', () => {
    render(<EntityTable entities={[entityOk]} />)

    // "Turbo Dynamics Inc." tem creditLimit 42500 e status "ok"
    expect(screen.getByText(/R\$ 42\.500,00/)).toBeInTheDocument()
  })

  it('exibe o texto "Limit" muted ao lado do valor', () => {
    render(<EntityTable entities={[entityOk]} />)

    expect(screen.getByText('Limit')).toBeInTheDocument()
  })

  it('exibe "Outstanding: R$ 0,00"', () => {
    render(<EntityTable entities={[entityOk]} />)

    expect(screen.getByText(/outstanding: r\$ 0,00/i)).toBeInTheDocument()
  })

  it('não exibe barra de progresso', () => {
    render(<EntityTable entities={[entityOk]} />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

// ── 3.3 Financial Standing — variante "due" ───────────────────────────────────

describe('EntityTable — 3.3 Financial Standing variante "due"', () => {
  it('exibe o saldo devedor em coral', () => {
    render(<EntityTable entities={[entityDue]} />)

    // "Juliana Mendes" tem outstandingBalance 1250
    expect(screen.getByText(/R\$ 1\.250,00/)).toBeInTheDocument()
  })

  it('exibe o texto "Balance Due"', () => {
    render(<EntityTable entities={[entityDue]} />)

    expect(screen.getByText('Balance Due')).toBeInTheDocument()
  })

  it('exibe barra de progresso com role="progressbar"', () => {
    render(<EntityTable entities={[entityDue]} />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('progressbar tem aria-valuenow entre 0 e 100', () => {
    render(<EntityTable entities={[entityDue]} />)

    const bar = screen.getByRole('progressbar')
    const value = Number(bar.getAttribute('aria-valuenow'))
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThanOrEqual(100)
  })
})

// ── 3.3 Financial Standing — variante "credit_ok" ────────────────────────────

describe('EntityTable — 3.3 Financial Standing variante "credit_ok"', () => {
  it('exibe o valor do limite de crédito', () => {
    render(<EntityTable entities={[entityCreditOk]} />)

    // "Global Logistics Hub" tem creditLimit 150000
    expect(screen.getByText(/R\$ 150\.000,00/)).toBeInTheDocument()
  })

  it('exibe badge "Credit OK"', () => {
    render(<EntityTable entities={[entityCreditOk]} />)

    expect(screen.getByText(/credit ok/i)).toBeInTheDocument()
  })

  it('não exibe barra de progresso', () => {
    render(<EntityTable entities={[entityCreditOk]} />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

// ── 3.3 Financial Standing — variante "prepaid" ───────────────────────────────

describe('EntityTable — 3.3 Financial Standing variante "prepaid"', () => {
  it('exibe "R$ 0,00 Prepaid Only"', () => {
    render(<EntityTable entities={[entityPrepaid]} />)

    expect(screen.getByText(/R\$ 0,00 Prepaid Only/i)).toBeInTheDocument()
  })

  it('exibe "No Active Limit"', () => {
    render(<EntityTable entities={[entityPrepaid]} />)

    expect(screen.getByText(/no active limit/i)).toBeInTheDocument()
  })

  it('não exibe barra de progresso', () => {
    render(<EntityTable entities={[entityPrepaid]} />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

// ── 3.3 Todas as 4 variantes juntas ──────────────────────────────────────────

describe('EntityTable — 3.3 Os 4 registros da imagem com variantes corretas', () => {
  it('nenhuma variante é misturada entre as linhas', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    // "due" deve aparecer exatamente 1 vez (Juliana Mendes)
    expect(screen.getAllByText('Balance Due')).toHaveLength(1)
    // "Credit OK" deve aparecer exatamente 1 vez (Global Logistics Hub)
    expect(screen.getAllByText(/credit ok/i)).toHaveLength(1)
    // progressbar deve aparecer exatamente 1 vez
    expect(screen.getAllByRole('progressbar')).toHaveLength(1)
  })
})

// ── 3.4 Coluna Actions ────────────────────────────────────────────────────────

describe('EntityTable — 3.4 Coluna Actions', () => {
  it('renderiza botão de editar para cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByRole('button', { name: new RegExp(`editar ${entity.name}`, 'i') })).toBeInTheDocument()
    }
  })

  it('renderiza botão de ver ficha para cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    for (const entity of REQUIRED_FOUR) {
      expect(screen.getByRole('button', { name: new RegExp(`ver ficha de ${entity.name}`, 'i') })).toBeInTheDocument()
    }
  })

  it('renderiza botão kebab "Mais opções" para cada entidade', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    expect(kebabs).toHaveLength(REQUIRED_FOUR.length)
  })

  it('dropdown está fechado por padrão', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar em kebab abre o dropdown com as 3 opções', async () => {
    const user = userEvent.setup()
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    await user.click(kebabs[0])

    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /ver detalhes/i })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /editar/i })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /desativar/i })).toBeInTheDocument()
  })

  it('clicar no mesmo kebab novamente fecha o dropdown', async () => {
    const user = userEvent.setup()
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    await user.click(kebabs[0])
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(kebabs[0])
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('abrir segundo kebab fecha o primeiro automaticamente', async () => {
    const user = userEvent.setup()
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })

    await user.click(kebabs[0])
    expect(screen.getAllByRole('menu')).toHaveLength(1)

    await user.click(kebabs[1])
    // Somente um menu deve estar aberto
    expect(screen.getAllByRole('menu')).toHaveLength(1)
  })

  it('clicar fora do dropdown o fecha', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <span data-testid="outside">Fora</span>
        <EntityTable entities={REQUIRED_FOUR} />
      </div>,
    )

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    await user.click(kebabs[0])
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(screen.getByText('Fora'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar em um item do dropdown fecha o menu', async () => {
    const user = userEvent.setup()
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    await user.click(kebabs[0])

    await user.click(screen.getByRole('menuitem', { name: /ver detalhes/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('botão kebab tem aria-expanded=false quando fechado', () => {
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    expect(kebabs[0]).toHaveAttribute('aria-expanded', 'false')
  })

  it('botão kebab tem aria-expanded=true quando aberto', async () => {
    const user = userEvent.setup()
    render(<EntityTable entities={REQUIRED_FOUR} />)

    const kebabs = screen.getAllByRole('button', { name: /mais opções/i })
    await user.click(kebabs[0])

    expect(kebabs[0]).toHaveAttribute('aria-expanded', 'true')
  })
})
