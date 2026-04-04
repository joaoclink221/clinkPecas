import { useRef, useState } from 'react'

import type { Category, StockItem } from './inventory.types'

type InventoryTableProps = {
  items: StockItem[]
}

// ── Formatação ────────────────────────────────────────────────────────────────

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// ── 4.2 Badges de categoria ───────────────────────────────────────────────────

const categoryBadgeClass: Record<Category, string> = {
  Motores:   'bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/30',
  Suspensão: 'bg-[#d97706]/15 text-[#fbbf24] border border-[#d97706]/30',
  Filtros:   'bg-[#2563eb]/15 text-[#60a5fa] border border-[#2563eb]/30',
  Freios:    'bg-[#065f46]/25 text-[#34d399] border border-[#065f46]/40',
  Elétrica:  'bg-[#0891b2]/15 text-[#22d3ee] border border-[#0891b2]/30',
  Outros:    'bg-[#6b7280]/15 text-[#9ca3af] border border-[#6b7280]/30',
}

function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-label-technical font-semibold ${categoryBadgeClass[category]}`}
    >
      {category}
    </span>
  )
}

// ── 4.3 Barra de progresso de nível de estoque ───────────────────────────────

function stockBarColor(pct: number): string {
  if (pct > 50) return 'bg-primary'
  if (pct >= 20) return 'bg-[#f59e0b]'
  return 'bg-[#fb923c]'
}

function StockLevelCell({ item }: { item: StockItem }) {
  const pct = Math.min(100, (item.stockQty / item.stockMax) * 100)
  const isCritical = item.stockQty < item.stockThreshold
  const barColor = stockBarColor(pct)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* 4.3 — barra fixa de ~120px */}
        <div
          className="h-1.5 w-[120px] shrink-0 overflow-hidden rounded-full bg-surface-container-highest"
          aria-hidden
        >
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-body-sm text-on-surface-variant">
          {item.stockQty} un.
        </span>
      </div>

      {/* 4.4 — label Reposição Urgente */}
      {isCritical && (
        <span
          className="text-label-technical font-semibold text-[#fb923c]"
          aria-label="Reposição Urgente"
        >
          Reposição Urgente
        </span>
      )}
    </div>
  )
}

// ── Ícones de ação ────────────────────────────────────────────────────────────

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-5" />
  </svg>
)

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
)

// ── Estilos de th / td ────────────────────────────────────────────────────────

const thClass =
  'px-4 py-3 text-left text-label-technical font-semibold text-on-surface-variant'

const tdClass = 'px-4 py-4 text-body-sm text-on-surface align-top'

const iconBtnClass =
  'inline-flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

// ── Opções do menu kebab ─────────────────────────────────────────────────────

const KEBAB_OPTIONS = ['Editar', 'Ajustar Estoque', 'Desativar SKU'] as const

// ── Componente principal ──────────────────────────────────────────────────────

export function InventoryTable({ items }: InventoryTableProps) {
  // 6.1 — estado do dropdown kebab e toast
  const [openMenuSkuId, setOpenMenuSkuId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = setTimeout(() => setToastMessage(null), 2000)
  }

  function handleHistory() {
    showToast('Histórico em breve')
  }

  function toggleMenu(skuId: string) {
    setOpenMenuSkuId((prev) => (prev === skuId ? null : skuId))
  }

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-surface-container-low py-16 text-body-sm text-on-surface-variant"
        role="status"
        aria-live="polite"
      >
        Nenhum item encontrado para os filtros aplicados.
      </div>
    )
  }

  return (
    <>
      {/* 6.1 — Toast transiente */}
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-lg bg-surface-container-highest px-4 py-2.5 text-body-sm font-medium text-on-surface shadow-ambient"
        >
          {toastMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl bg-surface-container-low shadow-ambient">
      <table
        className="w-full border-collapse text-left"
        aria-label="Tabela de estoque"
      >
        <thead>
          <tr className="border-b border-outline-variant/20">
            {/* 4.1 — 7 cabeçalhos */}
            <th className={thClass} scope="col">SKU ID</th>
            <th className={thClass} scope="col">Nome da Peça</th>
            <th className={thClass} scope="col">Categoria</th>
            <th className={thClass} scope="col">Nível de Estoque</th>
            <th className={thClass} scope="col">Fornecedor</th>
            <th className={`${thClass} text-right`} scope="col">Preço Unit.</th>
            <th className={`${thClass} text-center`} scope="col">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isCritical = item.stockQty < item.stockThreshold
            const isMenuOpen = openMenuSkuId === item.skuId

            return (
            <tr
              key={item.skuId}
              className={`border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-highest/30${
                isCritical ? ' bg-[#fb923c]/[0.06]' : ''
              }`}
            >
              {/* SKU ID — mono, muted */}
              <td className={tdClass}>
                <span className="font-mono text-on-surface-variant">
                  {item.skuId}
                </span>
              </td>

              {/* Nome + subtítulo */}
              <td className={tdClass}>
                <span className="block font-semibold text-on-surface">
                  {item.name}
                </span>
                <span className="block text-on-surface-variant">
                  {item.subtitle}
                </span>
              </td>

              {/* Categoria — 4.2 badge */}
              <td className={tdClass}>
                <CategoryBadge category={item.category} />
              </td>

              {/* Nível de estoque — 4.3 barra + 4.4 label crítico */}
              <td className={tdClass}>
                <StockLevelCell item={item} />
              </td>

              {/* Fornecedor */}
              <td className={tdClass}>
                <span className="text-on-surface-variant">{item.supplier}</span>
              </td>

              {/* Preço Unit. — BRL, alinhado à direita */}
              <td className={`${tdClass} text-right`}>
                <span className="font-semibold text-on-surface">
                  {brl.format(item.unitPrice)}
                </span>
              </td>

              {/* Ações — ícone histórico + 3 pontos */}
              <td className={`${tdClass} text-center`}>
                <div className="flex items-center justify-center gap-1">
                  {/* 6.1 — Histórico: exibe toast ao clicar */}
                  <button
                    type="button"
                    aria-label={`Histórico de ${item.skuId}`}
                    className={iconBtnClass}
                    onClick={handleHistory}
                  >
                    <HistoryIcon />
                  </button>

                  {/* 6.1 — Kebab: abre/fecha dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Mais ações para ${item.skuId}`}
                      aria-expanded={isMenuOpen}
                      aria-haspopup="menu"
                      className={iconBtnClass}
                      onClick={() => toggleMenu(item.skuId)}
                    >
                      <DotsIcon />
                    </button>

                    {isMenuOpen ? (
                      <ul
                        role="menu"
                        aria-label={`Menu de ações para ${item.skuId}`}
                        className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-low py-1 shadow-ambient"
                      >
                        {KEBAB_OPTIONS.map((option) => (
                          <li key={option} role="none">
                            <button
                              type="button"
                              role="menuitem"
                              className="w-full px-4 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container-highest"
                              onClick={() => setOpenMenuSkuId(null)}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </>
  )
}
