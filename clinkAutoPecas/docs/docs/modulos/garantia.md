# Módulo: Garantia (Pós-Venda & Qualidade)

Rota: `/garantia`

## Estrutura de arquivos

```
src/pages/warranty/
├── WarrantyPage.tsx       ← Componente raiz da página (fases 1.x)
├── WarrantyPage.test.tsx  ← Testes do esqueleto visual
├── warranty.types.ts      ← Interfaces e unions do domínio (fases 2.x)
├── mock-data.ts           ← Devoluções e protocolos mock (fases 2.x)
├── mock-data.test.ts      ← Testes de integridade dos dados mock
├── ReturnsTable.tsx              ← Tabela "Devoluções Recentes" (fases 3.x)
├── ReturnsTable.test.tsx         ← Testes da tabela
├── WarrantyTrackingPanel.tsx      ← Painel "Tracking de Garantia" (fases 4.x)
├── WarrantyTrackingPanel.test.tsx ← Testes do painel
├── PredictiveInsightsCard.tsx     ← Card "Inteligência Preditiva" (fase 5.1)
├── PredictiveInsightsCard.test.tsx
├── PolicyGuideCard.tsx            ← Card "Guia de Políticas" (fase 5.2)
├── PolicyGuideCard.test.tsx
├── OpenTicketModal.tsx            ← Modal "Abrir Chamado" (fase 6.1)
└── OpenTicketModal.test.tsx
```

---

## Componente `WarrantyPage`

Página 100% estática na fase 1.x. Nenhum estado, nenhum dado externo.

### 1.1 — Header

Estrutura de duas linhas:

**Linha 1:** H1 bicolor + botão primário
- `<h1>` com três `<span>` inline: `text-on-surface` + `color: #10B981` para o `&` + `text-on-surface`
- Subtítulo em `text-on-surface-variant`
- Botão "Abrir Chamado": `bg-primary`, ícone `+` SVG inline, `aria-label="Abrir chamado de garantia"`

**Linha 2:** Navbar secundária (`role="tablist"`)
- Aba `POST-SALES`: `aria-selected="true"`, `border-b-2 border-primary text-primary`
- Aba `COMPLIANCE`: `aria-selected="false"`, estilo muted

### 1.2 — Grid dos 3 KPI Cards

`<section aria-label="Indicadores de garantia">` com `grid-cols-3`.

Cada card (`<article aria-label={label}>`) tem:
- Círculo colorido com ícone SVG branco (32×32 `rounded-full`)
- Badge no canto superior direito com `inline style` para precisão de cor

| Card | Ícone | Valor | Badge | Cor |
|---|---|---|---|---|
| Garantias Ativas | Shield (teal `#10B981`) | 142 | +12% VS LAST MONTH | teal |
| Devoluções Pendentes | Package (roxo `#7C3AED`) | 28 | AWAITING LOGISTICS | lilás |
| Total em Reembolsos | Dollar (coral `#FC7C78`) | R$ 14.2k | CURRENT CYCLE | coral |

### 1.3 — Slots de Widgets

**Linha do meio** (`grid-cols-[60fr_38fr]`):

| Slot | `aria-label` | Fase de preenchimento |
|---|---|---|
| Largo (~60%) | "Devoluções Recentes" | 2.x |
| Menor (~38%) | "Tracking de Garantia" | 3.x |

**Linha inferior** (mesma proporção `60fr_38fr`):

| Slot | `aria-label` | Conteúdo futuro |
|---|---|---|
| Largo | "Inteligência Preditiva de Falhas" | Análise preditiva 4.x |
| Menor | "Guia de Políticas" | DOWNLOAD PDF estático |

Cada slot tem `min-h` definido e um placeholder `border-dashed` indicando a fase futura. Os slots "Devoluções Recentes" e "Tracking de Garantia" expõem botões de ação (VER TUDO / kebab) para futura integração sem quebrar acessibilidade.

---

## Tipos TypeScript (`warranty.types.ts`)

### 2.1 — Interface `Return`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único |
| `itemName` | `string` | Nome do item devolvido |
| `skuRef` | `string` | Referência do pedido (ex: `ORD-98231-X`) |
| `avatarIcon` | `AvatarIcon` | `'brake' \| 'alternator' \| 'filter' \| 'gear'` |
| `reason` | `string` | Motivo da devolução |
| `date` | `string` | Data ISO 8601 (`YYYY-MM-DD`) |
| `status` | `ReturnStatus` | `'analysing' \| 'approved' \| 'refunded'` |

### 2.2 — Interface `WarrantyProtocol`

| Campo | Tipo | Descrição |
|---|---|---|
| `protocolId` | `string` | Ex: `GAR-2290` |
| `itemName` | `string` | Nome do componente coberto |
| `description` | `string` | Diagnóstico técnico |
| `openDate` | `string` | Abertura ISO 8601 |
| `expirationDate` | `string` | Expiração ISO 8601 — sempre posterior a `openDate` |
| `linkedOrder` | `string` | Ex: `ORD-772` |
| `status` | `WarrantyProtocolStatus` | `'in_progress' \| 'completed'` |

### 2.3 — Mock data

**`returnsMock`** — 3 registros exatos da imagem:

| id | itemName | skuRef | status |
|---|---|---|---|
| RET-001 | Disco de Freio Vent. | ORD-98231-X | analysing |
| RET-002 | Alternador 120A | ORD-88122-Y | approved |
| RET-003 | Kit Filtros (4un) | ORD-99100-A | refunded |

**`warrantyProtocolsMock`** — 2 protocolos exatos da imagem:

| protocolId | itemName | linkedOrder | status |
|---|---|---|---|
| GAR-2290 | Transmissão Hidráulica X-9 | ORD-772 | in_progress |
| GAR-2144 | Módulo de Controle ECU | ORD-551 | completed |

---

## Componente `ReturnsTable`

### 3.1 — Estrutura das 4 colunas

`<table>` semântica com `<thead>/<tbody>`. Header do card: ícone escudo `text-secondary` (roxo) + `<h2>` + botão "VER TUDO" `text-primary`.

| Coluna | Conteúdo |
|---|---|
| ITEM / SKU | `ItemCell` — quadrado 32px `rounded-lg` fundo escuro + SVG 16px + nome bold + skuRef muted |
| MOTIVO | Texto simples `text-on-surface-variant` |
| DATA | `formatDate` → `DD Mmm, YYYY` |
| STATUS | `ReturnStatusBadge` — 3 variantes |

### 3.2 — Badges de status de devolução

| Status | Fundo | Texto |
|---|---|---|
| `analysing` | `#7C3AED` roxo sólido | `#ffffff` |
| `approved` | `#10B981` teal sólido | `#ffffff` |
| `refunded` | `rgba(255,255,255,0.10)` muted | `#9ca3af` |

Pill shape, uppercase 11px, `px-2.5 py-0.5`, `border-radius: 9999px`.

### 3.3 — Ícones de item por categoria

| `AvatarIcon` | Ícone SVG | Descrição |
|---|---|---|
| `brake` | Círculo com 4 linhas cruzadas + círculo interno | Rotor de freio |
| `alternator` | Raio / bolt de energia | Componente elétrico |
| `filter` | Grade 2×2 de quadrados outline | Kit de filtros |
| `gear` | Engrenagem com raios | Peça genérica |

O `ItemCell` envolve o ícone num `div` com `aria-label="Ícone {type}"` para acessibilidade.

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `returns` | `Return[]` | `returnsMock` | Registros de devolução exibidos |

---

## Componente `WarrantyTrackingPanel`

### 4.1 — Cards verticais de protocolo

Cada `ProtocolCard` é um `<article aria-label="Protocolo {protocolId}">` com:
- `borderLeft: 4px solid {cor}` via inline style: teal `#10B981` para `in_progress`, cinza `rgba(255,255,255,0.15)` para `completed`
- Header: `PROTOCOLO #{protocolId}` uppercase muted + `ProtocolStatusBadge` à direita
- `<p>` bold com `itemName`
- `<p>` 12px muted com `description`
- `ProtocolCardFooter` no rodapé

### 4.2 — Badges de status do protocolo

| Status | Fundo | Borda | Texto |
|---|---|---|---|
| `in_progress` | `rgba(16,185,129,0.12)` | `rgba(16,185,129,0.4)` | `#10B981` teal |
| `completed` | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.12)` | `#9ca3af` muted |

Pill shape, uppercase 10px, `px-2.5 py-0.5`.

### 4.3 — Rodapé com metadados

`formatShortDate` converte `YYYY-MM-DD` → `DD/MM/YY`. Três itens em linha:

| Item | Ícone | Conteúdo |
|---|---|---|
| Abertura | CalendarIcon | `DD/MM/YY` |
| Expiração | CalendarIcon | `Exp: DD/MM/YY` (+ indicador 4.4 se vencida) |
| Ordem | LinkIcon | `ORD-xxx` em `text-primary` |

### 4.4 — Indicador visual de garantia vencida

`isExpired(expirationDate)` = `new Date(expirationDate) < new Date()`. Se verdadeiro:
- Span pai da data de expiração recebe `color: #FC7C78` (coral)
- Label `VENCIDA` em pill coral translúcido: `background: rgba(252,124,120,0.15)`, `color: #FC7C78`

Com os dados mock (expiração em 2024), **ambos os protocolos** aparecem como VENCIDA em 2026.

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `protocols` | `WarrantyProtocol[]` | `warrantyProtocolsMock` | Protocolos exibidos no painel |

---

## Componente `PredictiveInsightsCard`

### 5.1 — Card "Inteligência Preditiva de Falhas"

Card 100% estático (sem props). Layout horizontal em telas `sm+`:

- `<h2>` bold: "Inteligência Preditiva de Falhas"
- `<p>` com texto hardcoded sobre aumento de 15% em falhas de compressores série "T"
- `BarChartThumbnail` — SVG `viewBox="0 0 90 70"` com 7 barras `rgba(16,185,129,0.55)` + linha de tendência coral `#FC7C78`
- Botão outline `border-primary text-primary`: "VER RELATÓRIO ANALÍTICO" com `aria-label` completo

---

## Componente `PolicyGuideCard`

### 5.2 — Card "Guia de Políticas"

Card 100% estático (sem props), layout centralizado:

- `DocumentIcon` — SVG 40×40 `text-primary` (ícone de documento com dobra de página)
- `<h2>` bold: "Guia de Políticas"
- `<p>` com subtítulo incluindo versão "V2.4"
- Botão primário `bg-primary text-[#0D1117]`: "DOWNLOAD PDF"
- `onClick` chama `window.open('about:blank', '_blank', 'noopener,noreferrer')` — sem arquivo real, sem erro

> **Decisão de design:** `window.open('about:blank')` evita fetch de arquivo inexistente e satisfaz o critério de "clique não causa erro" sem criar dependência de asset externo.

---

## Componente `OpenTicketModal` (6.1)

Modal controlado por `WarrantyPage` via props `onClose` e `onSuccess`.

### Formulário

| Campo | Tipo HTML | Valores |
|---|---|---|
| Tipo | `<select>` | Garantia \| Devolução |
| Item / SKU | `<input type="text">` | livre |
| Motivo | `<textarea rows="3">` | livre |
| Prioridade | `<select>` | baixa \| média \| alta |

### Comportamento

- `role="dialog"` com `aria-modal="true"` e `aria-labelledby="modal-title"`
- Foco automático no primeiro campo via `useRef` + `useEffect`
- Fechar: botão `×`, botão "Cancelar" e tecla `Escape` — todos chamam `onClose`
- Submit (`form onSubmit`) chama `onSuccess` — sem validação, sem persistência
- `ModalBackdrop` (clicável) fecha ao clicar fora do card

### Toast `SuccessToast` (inline em `WarrantyPage`)

- `role="status"` / `aria-live="polite"` para acessibilidade
- Texto: "Chamado aberto com sucesso"
- Auto-dismiss após 4 s via `setTimeout` + cleanup no `useEffect`
- Botão manual para fechar antecipadamente

---

## Kebab Dropdown — `WarrantyTrackingPanel` (6.2)

Estado local `dropdownOpen` (useState) + `kebabRef` (useRef) no componente principal.

- Botão kebab: `aria-expanded` e `aria-haspopup="menu"` refletem estado
- `<ul role="menu">` com 3 `<button role="menuitem">`: "Ver Todos os Protocolos", "Exportar Relatório", "Configurar Alertas"
- Fechar ao clicar fora: `mousedown` listener no `document`, registrado apenas quando `dropdownOpen === true` (cleanup automático)
- Todas as opções são visuais — sem navegação real

---

## Auditoria de Design — Consistência (6.3)

| Critério | Status | Observação |
|---|---|---|
| Ícones de item 32px (`h-8 w-8`) | ✅ | `ItemCell` em `ReturnsTable.tsx:69` — idêntico ao `EntityAvatar` do módulo Financeiro |
| Hex colors = tokens do design system | ✅ | `#10B981` (Primary), `#FC7C78` (Tertiary), `#7C3AED` (Secondary), `#9ca3af` (muted) — padrão consistente com todos os módulos |
| Coral em data vencida | ✅ | `#FC7C78` aplicado em `WarrantyTrackingPanel.tsx:96,105` (4.4) |
| `text-[#0D1117]` em botões primários | ✅ | Padrão de todos os módulos para contraste no fundo teal |
| Dark mode | ✅ | Apenas tokens semânticos Tailwind para backgrounds e textos; hex apenas para acentos dinâmicos |

---

---

## Componente `WarrantyClaimModal`

Novo modal de abertura de chamado de garantia/devolução. Substitui funcionalmente o `OpenTicketModal` legado com design compatível com o design system, rodapé tripartido e persistência de rascunho via `localStorage`.

Arquivo: `src/pages/warranty/WarrantyClaimModal.tsx`

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `open` | `boolean` | Controla visibilidade do modal |
| `onClose` | `() => void` | Fechamento sem salvar (X, Cancelar, overlay, Escape) |
| `onSuccess` | `() => void` | Chamado após confirmação válida (validação real na fase 2.x) |

### Constante pública

`WARRANTY_CLAIM_DRAFT_KEY = 'warranty_claim_draft'` — chave do `localStorage` para rascunhos.

### 1.1 — Modal, overlay e header

- Overlay: `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm` com `role="presentation"` e `onClick` guardado
- Dialog: `max-w-[640px]`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby="wcm-title"`
- Header: `<h2 id="wcm-title">` bold `"Abrir Novo Chamado"` + `<p>` uppercase muted `"WARRANTY & RETURN PROTOCOL"`
- Botão X: `aria-label="Fechar modal"`, chama `onClose`
- Fechar com Escape: `useEffect` registra `keydown` apenas quando `open=true`
- Corpo: 3 `SectionSlot` placeholders (`Identificação do Item`, `Motivo da Solicitação`, `Evidências e Observações`) a serem substituídos nas fases 2.x

### 1.2 — Rodapé com 3 botões

Layout `justify-between`: Cancelar (esquerda) + grupo `Salvar Rascunho` / `Confirmar Abertura` (direita).

| Botão | Estilo | Comportamento |
|---|---|---|
| **Cancelar** | Ghost — `text-on-surface-variant` sem fundo | Chama `onClose`; não persiste nada |
| **Salvar Rascunho** | Secundário — `bg-surface-container-highest` | Persiste `Chamado` completo (sem `attachments`) + `savedAt` em `localStorage[CHAMADO_DRAFT_KEY]`; chama `onClose` |
| **Confirmar Abertura** | Primário — `bg-primary text-[#0D1117]` | Chama `onSuccess`; sem persistência (stub fase 1.x, validação real na fase 2.x) |

> **Decisão de design:** `Confirmar Abertura` não chama `onClose` diretamente — é responsabilidade do componente pai fechar o modal após receber `onSuccess`.

### 2.1 — Interface TypeScript e mocks

Arquivo: `src/pages/warranty/warrantyClaimMocks.ts`

#### `interface Chamado`

| Campo | Tipo | Descrição |
|---|---|---|
| `skuId` | `string \| null` | SKU selecionado; `null` enquanto não preenchido |
| `incidentDate` | `string` | Data ISO 8601 (`YYYY-MM-DD`) ou string vazia |
| `reason` | `ChamadoReason \| null` | `'avaria' \| 'incompativel' \| 'erro_pedido'`; `null` enquanto não selecionado |
| `description` | `string` | Descrição detalhada do ocorrido |
| `attachments` | `File[]` | Evidências anexadas — não serializável em JSON; reiniciado como `[]` ao restaurar rascunho |
| `status` | `'draft' \| 'open'` | Estado do chamado |

#### `INITIAL_CLAIM_STATE`

Todos os campos nulos/vazios: `{ skuId: null, incidentDate: '', reason: null, description: '', attachments: [], status: 'draft' }`.

#### `availableSkusMock`

Array de 5 `SkuOption` (`{ sku, name }`):

| SKU | Nome |
|---|---|
| `OG-TB-001` | Turbo Compressor T3 Titanium |
| `OG-IJ-992` | Kit Injeção Eletrônica RaceSpec |
| `ORD-98231-X` | Disco de Freio Ventilado |
| `ORD-88122-Y` | Alternador 120A |
| `ORD-99100-A` | Kit Filtros (4un) |

#### `CHAMADO_DRAFT_KEY`

`'chamado_draft'` — chave do `localStorage` para persistir o estado completo do formulário (substituiu o payload mínimo `{ status: 'draft' }` da fase WCM-1.2).

### 2.2 — Restaurar rascunho ao abrir

`useEffect` com dependência `[open]`: ao abrir o modal (`open=true`), lê `localStorage.getItem(CHAMADO_DRAFT_KEY)`.

| Cenário | Comportamento |
|---|---|
| Chave ausente | Inicializa com `INITIAL_CLAIM_STATE`; sem banner |
| JSON inválido | Capturado por `try/catch`; inicializa com `INITIAL_CLAIM_STATE`; sem banner |
| JSON válido | Hidrata `form` com campos salvos; `attachments` reiniciado como `[]`; exibe banner "Rascunho restaurado" |

**Banner:** `role="status"` com `aria-live="polite"`, estilo `bg-primary/10 text-primary`, posicionado entre o header e o corpo do modal.

**`handleSaveDraft` atualizado:** serializa `{ skuId, incidentDate, reason, description, status, savedAt: ISO }` em `CHAMADO_DRAFT_KEY` (campo `attachments` excluído por não ser serializável).

> **Decisão de design — estado unificado:** `form` e `draftRestored` são gerenciados num único `useState<ModalState>` para garantir que o `useEffect` de restore faça apenas uma chamada a `setModalState`, evitando renders em cascata.

### 3.1 — Header da seção "Identificação do Item"

Componente local `SectionHeader({ icon, label })` — mesmo contrato e classes de `EntityFormModal.tsx`.

- Ícone: `TagIcon` SVG inline 16×16px, `text-primary` (teal)
- Label: `text-[11px] font-semibold uppercase tracking-widest text-primary`

### 3.2 — Dropdown "Seleção de SKU / Produto"

| Detalhe | Valor |
|---|---|
| Element | `<select id="wcm-sku">` |
| Label | `<FieldLabel htmlFor="wcm-sku">` — uppercase muted 10px |
| Placeholder | `<option value="" disabled>` — "Selecione um item do pedido…" |
| Opções | `availableSkusMock` (5 itens) — formato `{sku} — {name}` |
| Estilo | `appearance-none` + `ChevronDownIcon` posicionado absolutamente à direita |
| Estado | `onChange` → `setField('skuId', value || null)` — `null` quando placeholder |

### 3.3 — Date picker "Data do Incidente"

| Detalhe | Valor |
|---|---|
| Element | `<input type="date" id="wcm-date">` |
| Label | `<FieldLabel htmlFor="wcm-date">` — uppercase muted 10px |
| Max | `new Date().toISOString().split('T')[0]` — datas futuras desabilitadas pelo browser |
| Estilo | `[color-scheme:dark]` para adaptar o ícone nativo ao tema escuro |
| Estado | `onChange` → `setField('incidentDate', value)` |

**Layout:** grid `grid-cols-2 gap-4` — SKU (esquerda) e data (direita), ambos ~50% da largura.

**Helper `setField`:** função genérica tipada `<K extends keyof Chamado>` que faz merge parcial em `ModalState.form` com um único `setModalState`.

### 4.1 — Grid de 3 cards de motivo

Arquivo: `src/pages/warranty/WarrantyClaimModal.tsx`

`SectionHeader` com `AlertCircleIcon` (h-4 w-4 teal) + `"MOTIVO DA SOLICITAÇÃO"`; grid `grid-cols-3 gap-3` de `ReasonCard`.

#### `ReasonCard`

| Prop | Tipo | Descrição |
|---|---|---|
| `value` | `ChamadoReason` | Identificador do motivo |
| `label` | `string` | Texto do card (renderizado uppercase via CSS) |
| `icon` | `ReactNode` | Ícone SVG 28px centralizado |
| `isActive` | `boolean` | Aplica borda teal + fundo mais claro |
| `onClick` | `() => void` | Toggle de seleção |

Acessibilidade: `type="button"` + `aria-pressed={isActive}`.

#### `REASON_CARDS` (constante de módulo)

| value | label | Ícone |
|---|---|---|
| `'avaria'` | Avaria | `ImageBrokenIcon` — h-7 w-7 `text-secondary` |
| `'incompativel'` | Incompatível | `AlertCircleIcon` — h-7 w-7 `text-secondary` |
| `'erro_pedido'` | Erro de Pedido | `CartXIcon` — h-7 w-7 `text-secondary` |

### 4.2 — Seleção exclusiva com toggle

Lógica de clique: `setField('reason', form.reason === card.value ? null : card.value)`

| Cenário | Resultado |
|---|---|
| Clicar em card inativo | Ativa o card clicado; todos os outros ficam inativos |
| Clicar no card já ativo | Desmarca (toggle — `reason` volta a `null`) |
| Apenas 1 card ativo por vez | Garantido pelo campo escalar `reason: ChamadoReason \| null` |

Visual ativo: `border-[1.5px] border-primary bg-surface-container`.
Visual inativo: `border border-outline-variant/20 bg-surface-container-low`.

---

## Evolução planejada

| Fase | Descrição | Status |
|---|---|---|
| 1.1–1.3 | Esqueleto visual: header, KPI cards, slots de widget | ✅ Concluído |
| 2.1–2.3 | Tipos TypeScript + mock de devoluções e protocolos | ✅ Concluído |
| 3.1–3.3 | Tabela `ReturnsTable`: 4 colunas, badges, ícones SVG | ✅ Concluído |
| 4.1–4.4 | Painel `WarrantyTrackingPanel`: cards, badges, expiração | ✅ Concluído |
| 5.1–5.2 | Cards `PredictiveInsightsCard` + `PolicyGuideCard` | ✅ Concluído |
| 6.1–6.3 | Modal Abrir Chamado, kebab Tracking, auditoria design | ✅ Concluído |
| WCM-1.1 | `WarrantyClaimModal`: overlay, header, Escape, re-render | ✅ Concluído |
| WCM-1.2 | `WarrantyClaimModal`: rodapé tripartido, localStorage draft | ✅ Concluído |
| WCM-2.1 | `warrantyClaimMocks.ts`: `Chamado`, `INITIAL_CLAIM_STATE`, `availableSkusMock` | ✅ Concluído |
| WCM-2.2 | `WarrantyClaimModal`: restore de rascunho + banner "Rascunho restaurado" | ✅ Concluído |
| WCM-3.1 | `WarrantyClaimModal`: `SectionHeader` + `TagIcon` — seção "Identificação do Item" | ✅ Concluído |
| WCM-3.2 | `WarrantyClaimModal`: dropdown SKU com `availableSkusMock` + `setField` helper | ✅ Concluído |
| WCM-3.3 | `WarrantyClaimModal`: `<input type="date">` estilizado, `max=today` | ✅ Concluído |
| WCM-4.1 | `WarrantyClaimModal`: `ReasonCard`, `REASON_CARDS`, 3 ícones SVG inline | ✅ Concluído |
| WCM-4.2 | `WarrantyClaimModal`: toggle exclusivo `reason`, visual ativo teal | ✅ Concluído |
| WCM-5.x | `WarrantyClaimModal`: seção "Evidências e Observações" (attachments) | 🔲 Pendente |
