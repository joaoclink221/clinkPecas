# Biblioteca de Componentes Compartilhados (`shared/ui`)

**Localização:** `src/shared/ui/`

Componentes reutilizáveis e sem lógica de domínio. São consumidos por qualquer página ou widget do projeto. Exportados via barrel em `src/shared/ui/index.ts`.

---

## `Button`

**Localização:** `src/shared/ui/button/Button.tsx`

Botão base do sistema com suporte a 3 variantes, 3 tamanhos e todos os estados interativos.

### Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `disabled` | `boolean` | `false` | Desabilita clique e aplica `opacity-50` |
| `type` | `HTMLButtonElement['type']` | `'button'` | Evita submit acidental em formulários |
| `...rest` | `ButtonHTMLAttributes` | — | Forwarded para o `<button>` nativo |

Aceita `ref` via `forwardRef`.

### Variantes

| Variante | Descrição | Cor de fundo | Texto |
|---|---|---|---|
| `primary` | Ação principal | `bg-primary-gradient` (teal) | `text-on-primary` (escuro) |
| `secondary` | Ação secundária | Transparente + border | `text-secondary` (roxo) |
| `ghost` | Ação terciária / cancelar | Transparente | `text-on-surface` |

Todos os estados: hover, `focus-visible` (outline 2px teal), disabled (`opacity-50 cursor-not-allowed`).

### Exemplo

```tsx
import { Button } from '@/shared/ui'

<Button variant="primary" size="lg" onClick={handleSave}>
  Salvar
</Button>

<Button variant="ghost" onClick={handleCancel}>
  Cancelar
</Button>
```

---

## `ToggleGroup`

**Localização:** `src/shared/ui/toggle-group/ToggleGroup.tsx`

Segmented control para **seleção exclusiva** entre duas ou mais opções. Equivale ao padrão de UI "toggle buttons" visto em seletores como "Cliente / Fornecedor" ou "Pessoa Física / Jurídica".

### Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `options` | `readonly ToggleOption[]` | ✅ | — | Lista de opções disponíveis |
| `value` | `string` | ✅ | — | Valor da opção atualmente ativa |
| `onChange` | `(value: string) => void` | ✅ | — | Callback ao selecionar nova opção |
| `label` | `string` | ✅ | — | `aria-label` do grupo (obrigatório para acessibilidade) |
| `disabled` | `boolean` | — | `false` | Desabilita todas as opções |
| `size` | `'sm' \| 'md'` | — | `'md'` | Tamanho dos botões |

#### `ToggleOption`

| Campo | Tipo | Descrição |
|---|---|---|
| `value` | `string` | Identificador interno |
| `label` | `string` | Texto exibido |
| `disabled` | `boolean?` | Desabilita individualmente esta opção |

### Visual

| Estado | Estilo |
|---|---|
| Ativo | `bg-primary` (teal) + `text-on-primary` + shadow sutil |
| Inativo | `bg-transparent` + `text-on-surface-variant` + hover teal claro |
| Desabilitado | `opacity-50 cursor-not-allowed` |
| Container | `bg-surface-container-highest`, `border-radius: xl`, `padding: 4px` |

### Acessibilidade

- Container usa `role="group"` + `aria-label` (prop `label`)
- Cada botão tem `aria-pressed="true|false"` — compatível com NVDA, VoiceOver e JAWS
- `type="button"` em todos os botões — evita submit acidental em formulários
- `focus-visible` com outline 2px teal

### Exemplos

```tsx
import { ToggleGroup } from '@/shared/ui'

// Seleção de tipo de vínculo
const [vinculo, setVinculo] = useState<'cliente' | 'fornecedor'>('cliente')

<ToggleGroup
  label="Tipo de vínculo"
  options={[
    { value: 'cliente', label: 'Cliente' },
    { value: 'fornecedor', label: 'Fornecedor' },
  ]}
  value={vinculo}
  onChange={(v) => setVinculo(v as typeof vinculo)}
/>

// Seleção de tipo de pessoa (tamanho sm)
<ToggleGroup
  label="Tipo de pessoa"
  size="sm"
  options={[
    { value: 'pf', label: 'Pessoa Física' },
    { value: 'pj', label: 'Pessoa Jurídica' },
  ]}
  value={tipoPessoa}
  onChange={setTipoPessoa}
/>
```

### Decisão de design

O padrão `role="group"` + `aria-pressed` foi escolhido sobre `role="radiogroup"` + `role="radio"` porque:
1. Permite renderização exclusivamente com `<button>` — sem `<input type="radio">` oculto
2. Maior compatibilidade com Tailwind (sem hacks de `appearance-none`)
3. Comportamento de teclado idêntico ao esperado: Tab navega entre opções, Enter/Space ativa

---

## `MaskedTextField`

**Localização:** `src/shared/ui/masked-text-field/MaskedTextField.tsx`

Wrapper do `TextField` que aplica formatação automática. Depende de `src/shared/lib/masks`.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `mask` | `'cpf' \| 'cnpj' \| 'telefone' \| 'moeda'` | ✅ | Tipo de máscara |
| `onChange` | `(maskedValue: string) => void` | — | Recebe o valor **já formatado** |
| `...rest` | `TextFieldProps` (sem `onChange`/`type`) | — | Repassado ao `TextField` |

O `value` armazenado no estado pai é sempre o valor **formatado**. Para persistir apenas dígitos, use `unmask(value)` da lib de máscaras antes de enviar ao backend.

### Máscaras disponíveis

| Tipo | Padrão | Exemplo |
|---|---|---|
| `cpf` | `000.000.000-00` | `123.456.789-01` |
| `cnpj` | `00.000.000/0000-00` | `12.345.678/0001-95` |
| `telefone` | `(00) 00000-0000` / `(00) 0000-0000` | `(11) 98765-4321` |
| `moeda` | `R$ 0,00` | `R$ 1.234,56` |

### Exemplo

```tsx
import { MaskedTextField } from '@/shared/ui'
import { unmask } from '@/shared/lib/masks'

const [cpf, setCpf] = useState('')
<MaskedTextField label="CPF" mask="cpf" value={cpf} onChange={setCpf} />
// Para enviar: unmask(cpf) → "12345678901"
```

---

## `SelectField`

**Localização:** `src/shared/ui/select-field/SelectField.tsx`

Select dropdown acessível com label vinculado, placeholder desabilitado, ícone chevron customizado e estado de erro.

### Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Rótulo acessível |
| `options` | `readonly SelectOption[]` | ✅ | — | Lista de opções |
| `placeholder` | `string` | — | — | Primeira opção desabilitada |
| `error` | `string` | — | — | Mensagem de erro |
| `disabled` | `boolean` | — | `false` | Desabilita o select |
| `...rest` | `SelectHTMLAttributes` | — | — | Repassado ao `<select>` |

#### `SelectOption`

```ts
interface SelectOption { value: string; label: string }
```

### Exemplo

```tsx
import { SelectField } from '@/shared/ui'

<SelectField
  label="Departamento"
  placeholder="Selecione…"
  options={[
    { value: 'comercial', label: 'Comercial' },
    { value: 'estoque', label: 'Estoque' },
  ]}
  value={dept}
  onChange={(e) => setDept(e.target.value)}
  error={errors.dept}
/>
```

---

## `DateField`

**Localização:** `src/shared/ui/date-field/DateField.tsx`

Campo de data usando `<input type="date">` nativo estilizado. Valor sempre em formato `YYYY-MM-DD`.

**Decisão de design:** date picker nativo (suporte > 97%) evita dependência de biblioteca de calendário (~50 kB+). Comportamento de calendário personalizado é responsabilidade futura se necessário.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `label` | `string` | ✅ | Rótulo acessível |
| `error` | `string` | — | Mensagem de erro |
| `disabled` | `boolean` | — | Desabilita o campo |
| `...rest` | `InputHTMLAttributes` (sem `type`) | — | Repassado ao `<input>` |

### Exemplo

```tsx
import { DateField } from '@/shared/ui'

const [date, setDate] = useState('')
<DateField
  label="Data da venda"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  error={errors.date}
/>
```

---

## `src/shared/lib/masks`

**Localização:** `src/shared/lib/masks/index.ts`

Funções puras de formatação — sem efeitos colaterais, sem dependências externas.

| Função | Descrição |
|---|---|
| `maskCpf(value)` | Formata CPF: `000.000.000-00` |
| `maskCnpj(value)` | Formata CNPJ: `00.000.000/0000-00` |
| `maskTelefone(value)` | Formata telefone fixo ou celular |
| `maskMoeda(value)` | Formata moeda em BRL: `R$ 0,00` |
| `applyMask(type, value)` | Dispatcher — escolhe a função pelo tipo |
| `unmask(value)` | Remove formatação, retorna só dígitos |

Todas as funções aceitam entrada com ou sem máscara e descartam caracteres inválidos defensivamente.

---

## `StatusBadge`

**Localização:** `src/shared/ui/status-badge/`

Badge de status com variantes de cor mapeadas semanticamente. Documentado em `vendas.md`.

---

## `SummaryCard`

**Localização:** `src/shared/ui/summary-card/`

Card de resumo com título, valor principal e trend indicator.

---

## `TextField`

**Localização:** `src/shared/ui/text-field/`

Campo de texto com label, `leadingIcon`, estado de erro e acessibilidade integrada. Base para `MaskedTextField`.

---

## Estrutura de arquivos

```
src/shared/
├── lib/
│   └── masks/
│       ├── index.ts             ← maskCpf, maskCnpj, maskTelefone, maskMoeda, unmask
│       └── masks.test.ts
└── ui/
    ├── index.ts                 ← barrel de exportações
    ├── button/
    ├── date-field/
    │   ├── DateField.tsx
    │   ├── DateField.test.tsx
    │   └── index.ts
    ├── masked-text-field/
    │   ├── MaskedTextField.tsx
    │   ├── MaskedTextField.test.tsx
    │   └── index.ts
    ├── select-field/
    │   ├── SelectField.tsx
    │   ├── SelectField.test.tsx
    │   └── index.ts
    ├── status-badge/
    ├── summary-card/
    ├── text-field/
    └── toggle-group/
```
