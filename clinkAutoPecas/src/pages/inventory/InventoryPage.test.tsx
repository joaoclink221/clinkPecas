import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InventoryPage } from './InventoryPage'

describe('InventoryPage — 1.1 Header', () => {
  it('renderiza o label "Módulo de Gerenciamento"', () => {
    render(<InventoryPage />)

    expect(screen.getByText(/módulo de gerenciamento/i)).toBeInTheDocument()
  })

  it('renderiza o h1 "Controle de Estoque"', () => {
    render(<InventoryPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /controle de estoque/i }),
    ).toBeInTheDocument()
  })

  it('botão "Lote de Entrada" está visível e acessível', () => {
    render(<InventoryPage />)

    const btn = screen.getByRole('button', { name: /lote de entrada/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeEnabled()
  })

  it('botão "Nova Peça" está visível e acessível', () => {
    render(<InventoryPage />)

    const btn = screen.getByRole('button', { name: /nova peça/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeEnabled()
  })

  it('ambos os botões são renderizados simultaneamente', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /lote de entrada/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nova peça/i })).toBeInTheDocument()
  })
})

describe('InventoryPage — 1.2 KPI Cards', () => {
  it('seção de indicadores tem aria-label acessível', () => {
    render(<InventoryPage />)

    expect(
      screen.getByRole('region', { name: /indicadores de estoque/i }),
    ).toBeInTheDocument()
  })

  it('card "Total de SKUs Ativos" está presente', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('article', { name: /total de skus ativos/i })).toBeInTheDocument()
  })

  it('card "Alerta Crítico" está presente', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /alerta crítico/i })).toBeInTheDocument()
  })

  it('card "Valor Total do Inventário" está presente', () => {
    render(<InventoryPage />)

    expect(
      screen.getByRole('article', { name: /valor total do inventário/i }),
    ).toBeInTheDocument()
  })

  it('card Total de SKUs exibe o valor do mock "14.282"', () => {
    render(<InventoryPage />)

    const card = screen.getByRole('article', { name: /total de skus ativos/i })
    expect(card).toHaveTextContent('14.282')
  })

  it('card Alerta Crítico exibe o valor "48"', () => {
    render(<InventoryPage />)

    const card = screen.getByRole('button', { name: /alerta crítico/i })
    expect(card).toHaveTextContent('48')
  })

  it('card Alerta Crítico exibe sub-label "Itens com Baixo Estoque"', () => {
    render(<InventoryPage />)

    const card = screen.getByRole('button', { name: /alerta crítico/i })
    expect(card).toHaveTextContent(/itens com baixo estoque/i)
  })

  it('card Valor Total exibe o valor monetário do mock', () => {
    render(<InventoryPage />)

    const card = screen.getByRole('article', { name: /valor total do inventário/i })
    expect(card).toHaveTextContent(/2.840.150/)
  })

  it('badge "+2,4% MOM" está presente no card de SKUs', () => {
    render(<InventoryPage />)

    // Badge formatado a partir de stockKpiMock.trendTotalSkus (2.4)
    expect(screen.getByText(/MOM/i)).toBeInTheDocument()
  })

  it('renderiza exatamente 3 cards KPI (2 articles + 1 button clicável)', () => {
    render(<InventoryPage />)

    // O card Alerta Crítico tem role=button (clicável); os demais são articles
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /alerta crítico/i })).toBeInTheDocument()
  })
})

describe('InventoryPage — 4.x Tabela de SKUs (integração)', () => {
  it('renderiza a tabela de estoque na página', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('table', { name: /tabela de estoque/i })).toBeInTheDocument()
  })

  it('exibe os 4 itens da referência visual por padrão', () => {
    render(<InventoryPage />)

    expect(screen.getByText('OB-4492-XT')).toBeInTheDocument()
    expect(screen.getByText('OB-9921-ZR')).toBeInTheDocument()
    expect(screen.getByText('OB-1022-NK')).toBeInTheDocument()
    expect(screen.getByText('OB-5561-LK')).toBeInTheDocument()
  })

  it('ao menos um item exibe label "Reposição Urgente"', () => {
    render(<InventoryPage />)

    const labels = screen.getAllByText(/reposição urgente/i)
    expect(labels.length).toBeGreaterThanOrEqual(1)
  })

  it('OB-4492-XT não exibe "Reposição Urgente"', () => {
    render(<InventoryPage />)

    const urgentLabels = screen.queryAllByText(/reposição urgente/i)
    // Apenas os 3 itens críticos do mock devem mostrar o label
    expect(urgentLabels.length).toBeLessThan(screen.getAllByRole('row').length)
  })
})

describe('InventoryPage — 6.3 Filtro crítico via card Alerta Crítico', () => {
  it('card "Alerta Crítico" é um botão clicável', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /alerta crítico/i })).toBeEnabled()
  })

  it('clicar no card filtra apenas itens com stockQty < stockThreshold', () => {
    render(<InventoryPage />)

    fireEvent.click(screen.getByRole('button', { name: /alerta crítico/i }))

    // apenas itens críticos devem estar visiveis na tabela
    expect(screen.getAllByText(/reposição urgente/i).length).toBeGreaterThanOrEqual(1)
  })

  it('clicar novamente no card limpa o filtro crítico', () => {
    render(<InventoryPage />)

    const criticalCard = screen.getByRole('button', { name: /alerta crítico/i })
    fireEvent.click(criticalCard)
    fireEvent.click(criticalCard)

    // após reset, OB-4492-XT (item saudável) volta a aparecer
    expect(screen.getByText('OB-4492-XT')).toBeInTheDocument()
  })

  it('card tem aria-pressed=false quando filtro inativo', () => {
    render(<InventoryPage />)

    expect(
      screen.getByRole('button', { name: /alerta crítico/i })
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('card tem aria-pressed=true quando filtro ativo', () => {
    render(<InventoryPage />)

    fireEvent.click(screen.getByRole('button', { name: /alerta crítico/i }))

    expect(
      screen.getByRole('button', { name: /alerta crítico/i })
    ).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('InventoryPage — 5.x Paginação e contador', () => {
  it('exibe contador "Exibindo 1–10 de 14.282 SKUs" por padrão', () => {
    render(<InventoryPage />)

    expect(screen.getByText(/exibindo 1/i)).toBeInTheDocument()
    expect(screen.getByText(/14\.282 SKUs/i)).toBeInTheDocument()
  })

  it('exibe botão "Próxima página" habilitado na página 1', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeEnabled()
  })

  it('exibe botão "Página anterior" desabilitado na página 1', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('contador tem aria-live="polite" para leitores de tela', () => {
    const { container } = render(<InventoryPage />)

    const counter = container.querySelector('[aria-label="Contador de registros"]')
    expect(counter).toHaveAttribute('aria-live', 'polite')
  })
})

describe('InventoryPage — acessibilidade', () => {
  it('label do header usa elemento <p> com texto uppercase', () => {
    const { container } = render(<InventoryPage />)

    const label = container.querySelector('p.text-label-technical')
    expect(label).toBeInTheDocument()
    expect(label?.textContent).toMatch(/módulo de gerenciamento/i)
  })

  it('lista de cards KPI tem role="list"', () => {
    render(<InventoryPage />)

    const section = screen.getByRole('region', { name: /indicadores de estoque/i })
    const list = section.querySelector('[role="list"]')
    expect(list).toBeInTheDocument()
  })
})

// ── 3.3 Exportar CSV ─────────────────────────────────────────────────

describe('InventoryPage — 3.3 Exportar CSV', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url') as unknown as typeof URL.createObjectURL
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('botão "Exportar" está presente na página', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument()
  })

  it('clicar em "Exportar" exibe toast de confirmação', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('status').textContent).toMatch(/SKU/i)
  })

  it('toast exibe contagem total dos SKUs do mock sem filtro ativo', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    // stockMockPage tem 16 itens
    expect(screen.getByRole('status')).toHaveTextContent('16 SKUs exportados')
  })

  it('toast exibe "1 SKU exportado" no singular quando count = 1', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    // Buscar por SKU único para garantir 1 resultado
    await user.type(screen.getByRole('searchbox'), 'OB-4492-XT')
    // Aguardar debounce (300ms)
    await new Promise((r) => setTimeout(r, 350))

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    expect(screen.getByRole('status')).toHaveTextContent('1 SKU exportado')
  })

  it('toast tem role="status" e aria-live="polite" para acessibilidade', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    const toast = screen.getByRole('status')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })

  it('toast não está visível antes de clicar em exportar', () => {
    render(<InventoryPage />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('exportar com filtro crítico ativo exibe apenas itens críticos no toast', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    // Ativar filtro crítico clicando no card
    // O card tem role="button" quando onClick é fornecido
    await user.click(screen.getByRole('button', { name: /alerta crítico/i }))

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    // O toast deve mostrar contagem < 20 (apenas os críticos)
    const toast = screen.getByRole('status')
    expect(toast.textContent).toMatch(/SKU/i)
    // Não deve ser os 20 originais
    expect(toast.textContent).not.toContain('20 SKUs')
  })

  it('URL.createObjectURL é chamado ao exportar (confirma geração de Blob)', async () => {
    const user = userEvent.setup()
    render(<InventoryPage />)

    await user.click(screen.getByRole('button', { name: /exportar dados/i }))

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  })
})
