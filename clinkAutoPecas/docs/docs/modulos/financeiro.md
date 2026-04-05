# Módulo: Gestão Financeira

**Rota:** `/financeiro`  
**Componente raiz:** `FinancialPage.tsx`

Módulo de controladoria digital da empresa. Centraliza indicadores financeiros, tendências mensais, meios de pagamento e movimentações. A fase 1.x entrega o esqueleto visual completo — sem dados reais, sem lógica de estado.

## Estrutura do módulo

```
src/pages/financial/
├── FinancialPage.tsx            ← Componente raiz
├── FinancialPage.test.tsx       ← Testes dos critérios 1.1–1.4
├── financial.types.ts           ← Interfaces e unions do domínio
├── mock-data.ts                 ← Transações, tendência mensal e meios de pagamento
├── mock-data.test.ts            ← Testes de integridade dos dados mock
├── MonthlyTrendChart.tsx          ← Widget gráfico de linha dupla (fases 3.x)
├── MonthlyTrendChart.test.tsx     ← Testes do widget
├── PaymentMethodsPanel.tsx          ← Widget barras de progresso + mini-cards (fases 4.x)
├── PaymentMethodsPanel.test.tsx     ← Testes do widget
├── TransactionsTable.tsx            ← Tabela de movimentações com toggle e badges (fases 5.x)
└── TransactionsTable.test.tsx       ← Testes do componente
```

---

## Componente `FinancialPage`

Página 100% estática na fase 1.x. Nenhum estado, nenhum dado externo.

### 1.1 — Header

- **Label:** `"CONTROLADORIA DIGITAL"` — uppercase 11px, muted
- **H1:** `"Gestão Financeira"` — display-lg bold
- **Navbar secundária:** abas `Overview | Relatórios | Conciliação` com `role="tablist"`. "Overview" ativa por padrão (`aria-selected="true"`). Apenas visuais nesta fase.
- **Filtros globais (visuais):**
  - Botão `"Últimos 30 Dias"` com ícone calendário + chevron
  - Botão `"Centro de Custo"` com ícone building + chevron
  - Botão de filtros avançados com ícone sliders

### 1.2 — Grid dos 4 KPI cards

Quatro cards em `grid-cols-4` com `border-l-4` colorida como accent. Dados hardcoded.

| Card | Valor | Indicador | Sub | Accent |
|---|---|---|---|---|
| RECEITA TOTAL | R$ 1.240.500 | `+12.5%` trend verde | Expectativa: R$ 1.1M | `border-l-primary` (teal) |
| DESPESAS | R$ 845.200 | `+4.2%` trend roxo | Previsto: R$ 820K | `border-l-secondary` (roxo) |
| FLUXO DE CAIXA | R$ 395.300 | badge `"Estável"` azul | Saldo em conta corrente | `border-l-blue-500` |
| INADIMPLÊNCIA | R$ 34.700 | `▲ 2.8%` alerta coral | Atrasos > 30 dias | `border-l-tertiary` (coral) |

#### Tipo `KpiIndicator` (discriminated union)

```typescript
type KpiIndicator =
  | { kind: 'trend'; label: string; positive: boolean }
  | { kind: 'badge'; label: string }
  | { kind: 'alert'; label: string }
```

- `trend` → ícone trending-up + texto colorido (verde se `positive`, roxo se `!positive`)
- `badge` → pill azul `bg-blue-500/15 text-blue-400`
- `alert` → ícone triângulo `text-tertiary`

### 1.3 — Slots de widgets

Layout `grid-cols-[65fr_35fr]` (responsivo: `grid-cols-1` em mobile).

| Slot | Proporção | Conteúdo |
|---|---|---|
| Tendência Mensal | ~65% | Placeholder com borda dashed, `min-h-[280px]` |
| Meios de Pagamento | ~35% | Placeholder com borda dashed, `min-h-[280px]` |

Ambos têm `aria-label` para acessibilidade.

### 1.4 — Rodapé de segurança

```
OBSIDIAN GEAR SYSTEMS © 2024 | SECURE FINTECH LAYER V2.1.0
```

Faixa com `border-t`, texto centralizado uppercase 11px muted. Hardcoded — sem lógica.

---

---

## Tipos — `financial.types.ts`

### 2.1 — Interface `Transaction`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único (ex: "TR-8812") |
| `ref` | `string` | Referência ao documento de origem (ex: "ORD-94021", "INV-2201") |
| `entityName` | `string` | Nome da entidade |
| `entityAvatarType` | `EntityAvatarType` | Ícone SVG do avatar |
| `dueDate` | `string` | Data de vencimento ISO 8601 (YYYY-MM-DD) |
| `method` | `PaymentMethod` | Método de pagamento |
| `value` | `number` | Valor em reais |
| `status` | `TransactionStatus` | Status do pagamento |
| `type` | `TransactionType` | Direção: receber ou pagar |

### Unions exportadas

```typescript
type EntityAvatarType  = 'person' | 'building' | 'workshop' | 'gear'
type PaymentMethod     = 'pix' | 'boleto' | 'cartao'
type TransactionStatus = 'pago' | 'pendente' | 'atrasado'   // 3 badges da tela
type TransactionType   = 'receber' | 'pagar'
```

### Interface `MonthlyTrendData`

```typescript
interface MonthlyTrendData {
  months: string[]    // labels do eixo X
  realizado: number[] // linha sólida teal
  projetado: number[] // linha tracejada cinza
}
```

### Interface `PaymentMethodItem` e `FinancialStatCard`

```typescript
type PaymentMethodColor = 'teal' | 'purple' | 'green'

interface PaymentMethodItem  { label: string; percent: number; color: PaymentMethodColor }
interface FinancialStatCard  { label: string; value: string }
```

---

## Mock data — `mock-data.ts`

### 2.2 — `transactionsMock`

Array de 16 transações cobrindo todos os valores possíveis dos unions.

**Invariantes garantidas por testes:**
- Todos os 3 status (`pago`, `pendente`, `atrasado`) presentes
- Todos os 3 métodos (`pix`, `boleto`, `cartao`) presentes
- Ambos os types (`receber`, `pagar`) presentes
- Todos os 4 avatarTypes presentes
- IDs únicos; valores > 0; datas no formato `YYYY-MM-DD`

**`TOTAL_SIMULATED_TRANSACTIONS = 128`** — usado pelo componente de paginação.

**Registros obrigatórios (visíveis na imagem de referência):**

| REF | Entidade | Método | Valor | Status |
|---|---|---|---|---|
| ORD-94021 | Distribuidora Autopeças Sul | pix | R$ 12.450,00 | pago |
| TR-8812 | Logística TransGlobal S.A. | boleto | R$ 3.120,50 | pendente |
| ORD-93998 | Oficina Mecânica Centro | cartao | R$ 890,00 | atrasado |
| INV-2201 | Engrenagens Titan Ltda | pix | R$ 45.000,00 | pago |

### 2.3 — `trendMock`

```typescript
trendMock = {
  months:    ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  realizado: [820000, 890000, 950000, 1020000, 1100000, 1240500], // crescente
  projetado: [900000, 950000, 1000000, 1050000, 1100000, 1100000],
}
```

### 2.4 — `paymentMethodsMock` e `financialStatsMock`

```typescript
paymentMethodsMock = [
  { label: 'PIX INSTANTÂNEO',  percent: 45, color: 'teal'   },
  { label: 'BOLETO BANCÁRIO',  percent: 30, color: 'purple' },
  { label: 'CARTÃO DE CRÉDITO', percent: 25, color: 'green' },
] // sum(percent) === 100 ✓

financialStatsMock = [
  { label: 'TAXA DE CONVERSÃO', value: '94.2%'   },
  { label: 'TICKET MÉDIO',      value: 'R$ 1.4k' },
]
```

---

## Componente `MonthlyTrendChart`

### 3.1 — Gráfico de linhas (Recharts)

Usa `<LineChart>` + `<ResponsiveContainer>` do Recharts `^3.8.1`.

| Série | Cor | Estilo | Dot |
|---|---|---|---|
| Realizado | `#10B981` (primary teal) | Sólida, `strokeWidth=2` | `r=3` ativo |
| Projetado | `#6B7280` (gray) | Tracejada `strokeDasharray="5 5"` | Sem dot |

- `XAxis`: labels dos meses, sem linha de eixo, ticks desativados
- `YAxis`: `tickFormatter` formata em `K` / `M` (ex: `820K`, `1.2M`), largura fixa 42px
- `CartesianGrid`: apenas horizontal, opacidade ~15%
- `Tooltip`: formatado em BRL (`Intl.NumberFormat`) com fundo `surface-container-highest`

### 3.2 — Cabeçalho e legenda

- **Título:** `<h2>` `"Tendência Mensal"` — `font-bold text-on-surface`
- **Subtítulo:** `"Comparativo de faturamento vs meta anual"` — `text-on-surface-variant`
- **Legenda** (`role="list"`, `aria-label="Legenda do gráfico"`): dois `<li>` com dot colorido + label uppercase 11px
  - Ponto verde `#10B981` + `"Realizado"`
  - Ponto cinza `#6B7280` + `"Projetado"`

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `data` | `MonthlyTrendData` | `trendMock` | Dados do gráfico |

### Nota de teste

`ResponsiveContainer` renderiza com `width=0` no JSDOM — os ticks SVG do `XAxis` não são gerados. Os testes verificam apenas elementos DOM que controlamos: heading, subtítulo, legenda e presença do `.recharts-responsive-container`.

---

## Componente `PaymentMethodsPanel`

### 4.1 — Barras de progresso por método

Lista `role="list"` com três itens (`paymentMethodsMock`). Cada item:
- Label uppercase 11px muted à esquerda + percentual colorido à direita
- Track cinza `bg-surface-container-highest`, preenchimento colorido com `style={{ width: "%" }}`
- `role="progressbar"` com `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`

| Método | Cor da barra | Classe Tailwind |
|---|---|---|
| PIX INSTANTÂNEO | Teal | `bg-primary` |
| BOLETO BANCÁRIO | Roxo | `bg-secondary` |
| CARTÃO DE CRÉDITO | Verde | `bg-green-500` |

### 4.2 — Mini-cards de estatísticas

Grid `grid-cols-2` com os 2 itens de `financialStatsMock`:
- Fundo `bg-surface-container-highest` (mais escuro que o card pai)
- Label uppercase 11px muted
- Valor grande: `text-primary` para Taxa de Conversão, `text-on-surface` para Ticket Médio

| Card | Valor | Cor do valor |
|---|---|---|
| TAXA DE CONVERSÃO | 94.2% | `text-primary` (teal) |
| TICKET MÉDIO | R$ 1.4k | `text-on-surface` (branco) |

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `methods` | `PaymentMethodItem[]` | `paymentMethodsMock` | Dados das barras |
| `stats` | `FinancialStatCard[]` | `financialStatsMock` | Dados dos mini-cards |

---

## Componente `TransactionsTable`

### 5.1 — Toggle Contas a Receber / Contas a Pagar

`useState<TransactionType>('receber')` controla qual subset do array é exibido. Dois botões pill com `aria-pressed` dentro de `role="group"`. Clicar reseta o filtro imediatamente (paginacão futura na fase 6.x).

### 5.2 — Estrutura da tabela (6 colunas)

| Coluna | Conteúdo |
|---|---|
| CLIENTE/BENEFICIÁRIO | Avatar SVG colorido + nome bold + REF muted |
| VENCIMENTO | Data `DD Mmm YYYY`; `color: #FC7C78` se `status === 'atrasado'` |
| MÉTODO | Ícone SVG 16px + label texto |
| VALOR | BRL via `Intl.NumberFormat` bold |
| STATUS | Badge 3 variantes |
| AÇÕES | Botão `+` outlined na 1ª linha; kebab nas demais |

**Avatar** — círculo colorido com ícone SVG branco interno:

| `entityAvatarType` | Cor |
|---|---|
| `person` | `#10B981` (teal) |
| `building` | `#7C3AED` (roxo) |
| `workshop` | `#FC7C78` (coral) |
| `gear` | `#4B5563` (cinza) |

### 5.3 — Badges de status

| Status | Fundo | Texto |
|---|---|---|
| `pago` | `rgba(16,185,129,0.15)` | `#10B981` (teal) |
| `pendente` | `rgba(124,58,237,0.15)` | `#a78bfa` (lilás) |
| `atrasado` | `#FC7C78` sólido | `#ffffff` (branco) |

Padding 8px horizontal, `border-radius: 20px`, uppercase 11px.

### 5.4 — Ícones de método de pagamento

| Método | Ícone SVG | Cor |
|---|---|---|
| `pix` | Grade 2×2 de quadrados | `text-primary` (teal) |
| `boleto` | Barras verticais de espessura variável | `text-on-surface-variant` |
| `cartao` | Retângulo com chip e listra | `text-on-surface-variant` |

Nunca emoji ou texto puro como substituto (critério da spec 5.4).

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `transactions` | `Transaction[]` | `transactionsMock` | Dados exibidos na tabela |

### 6.1 — Paginação

Dois estados locais: `currentPage` (default 1) e `PAGE_SIZE = 4` (constante). Pipeline de dados: `filter → slice`. `handleTypeChange` reseta `currentPage` para 1.

- **Contador**: `Mostrando {rangeStart}–{rangeEnd} de 128 transações`
- **`PaginationBar`**: `<nav aria-label="Paginação de transações">` com botões prev/next + números de página
- Página ativa: `bg-primary text-white` + `aria-current="page"`
- Prev desabilitado em pág 1; next desabilitado na última
- Não renderizado quando `totalPages ≤ 1`

### 6.2 — Highlight de linha atrasada

`<tr style={{ background: 'rgba(252,124,120,0.05)' }}>` aplicado condicionalmente quando `tx.status === 'atrasado'`. Opacidade 5% para não sobrepor o hover, reforçando urgência visual além do badge coral.

### 6.3 — Dropdown mock do kebab

`ActionsCell` usa `useState(false)` para `isOpen`. Botão kebab recebe `aria-expanded` e `aria-haspopup="menu"`. Ao clicar: dropdown `role="menu"` com 3 `role="menuitem"`:

| Item | Ação |
|---|---|
| Visualizar detalhes | Fecha dropdown |
| Marcar como pago | Fecha dropdown |
| Cancelar transação | Fecha dropdown |

---

## Evolução planejada

| Fase | Descrição | Status |
|---|---|---|
| 1.1–1.4 | Esqueleto visual: header, KPI cards, slots de widget, rodapé | ✅ Concluído |
| 2.1–2.4 | Tipos TypeScript + mock de transações, tendência e meios de pagamento | ✅ Concluído |
| 3.1–3.2 | Widget `MonthlyTrendChart`: linha dupla Recharts + cabeçalho + legenda | ✅ Concluído |
| 4.1–4.2 | Widget `PaymentMethodsPanel`: barras de progresso + mini-cards | ✅ Concluído |
| 5.1–5.4 | Componente `TransactionsTable`: toggle, tabela 6 colunas, badges, ícones | ✅ Concluído |
| 6.1–6.3 | Paginação, highlight de linha atrasada, dropdown mock do kebab | ✅ Concluído |
| 7.x | Export CSV das movimentações filtradas | 🔲 Pendente |
