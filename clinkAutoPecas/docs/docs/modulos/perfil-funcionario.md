# Módulo: Perfil do Funcionário

Modal global acessível a partir de qualquer tela do portal via clique no avatar do usuário no `Topbar`.

---

## Estrutura de Arquivos

```
src/widgets/topbar/ui/
├── Topbar.tsx                    ← Topbar com gatilho de clique no avatar
├── Topbar.test.tsx               ← Testes do Topbar (incluindo 1.2)
├── EmployeeProfileModal.tsx      ← Modal de perfil (fases 1.x–N.x)
└── EmployeeProfileModal.test.tsx ← Testes do modal

src/widgets/main-layout/
├── MainLayout.tsx                ← Estado isProfileOpen + renderização condicional
└── topbar-defaults.ts            ← Dados estáticos do usuário padrão
```

---

## Arquitetura

O estado `isProfileOpen` é controlado pelo **`MainLayout`** — componente pai que envolve todo o portal. Isso garante que:

- O modal seja acessível de qualquer página sem prop-drilling
- O overlay use `position: absolute` dentro do container `relative` do layout (nunca `position: fixed`)
- O `Topbar` permanece stateless, recebendo apenas o callback `onAvatarClick`

---

## Componente `EmployeeProfileModal`

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onClose` | `() => void` | ✅ | Callback chamado ao fechar (X, overlay) |

### 1.1 — Overlay e Posicionamento

- Overlay: `absolute inset-0 z-40 bg-black/60 backdrop-blur-sm` — clicável, fecha o modal
- Container centralizador: `absolute inset-0 z-50 flex items-center justify-center`
- Modal: `max-w-[640px] w-full rounded-xl p-8` com `backgroundColor: '#181C22'`
- Botão X: `position: absolute` canto superior direito, `aria-label="Fechar perfil"`

### 1.2 — Gatilho de Abertura

O botão de avatar no `Topbar` tem:
- `aria-label="Abrir perfil do funcionário"`
- `aria-haspopup="dialog"`
- `onClick={onAvatarClick}` (prop opcional — sem erro se omitida)

O `MainLayout` passa `onAvatarClick={() => setIsProfileOpen(true)}`.

### 1.3 — Título e Divisão Interna

- `<h2 id="profile-modal-title">` — "Perfil do Funcionário", `fontSize: 20px`, `fontWeight: 500`
- `<section aria-label="Dados pessoais">` — placeholder para fases 2.x
- `<hr className="my-6 border-white/10">` — divisor visual sutil
- `<section aria-label="Preferências do Sistema">` + `<h3>` — placeholder para fases 3.x

---

## Componente `Topbar` — Alterações

| Prop | Tipo | Antes | Depois |
|---|---|---|---|
| `onAvatarClick` | `() => void` (opcional) | ausente | adicionada |
| Avatar container | `<div role="group">` | não clicável | `<button type="button">` |

---

## Model — Types e Mock (2.1 / 2.2)

**Localização:** `src/widgets/topbar/model/`

### `employee-profile.types.ts`

```ts
export const DEPARTMENTS = ['Logística','Vendas','Estoque','Financeiro','RH','Compras'] as const
export type Department = (typeof DEPARTMENTS)[number]

export interface UserPreferences {
  highContrast: boolean
  pushNotifications: boolean
}

export interface UserProfile {
  fullName: string
  email: string
  department: Department
  role: string          // somente leitura — não editável pelo usuário
  avatarUrl: string | null
  preferences: UserPreferences
}
```

### `employee-profile.mock.ts`

Dados hardcoded correspondentes à imagem de referência:

| Campo | Valor |
|---|---|
| `fullName` | `"Ricardo Oliveira"` |
| `email` | `"ricardo.o@obsidiangear.com"` |
| `department` | `"Logística"` |
| `role` | `"Fleet Coordinator"` |
| `avatarUrl` | `null` |
| `preferences.highContrast` | `false` |
| `preferences.pushNotifications` | `true` |

---

## Estado do Formulário (2.3)

### Props do modal

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onClose` | `() => void` | ✅ | Fecha o modal |
| `initialProfile` | `UserProfile` | ❌ | Perfil inicial; usa `mockUserProfile` como padrão |

### Lógica de estado

```ts
const [draft, setDraft] = useState<UserProfile>(() => ({
  ...initialProfile,
  preferences: { ...initialProfile.preferences },
}))

const isDirty = JSON.stringify(draft) !== JSON.stringify(initialProfile)
```

- **`draft`** — cópia independente de `initialProfile`; cada campo atualiza via `handleChange<K>(key, value)`
- **`isDirty`** — `true` quando algum campo difere do valor inicial; habilita o botão "Save Changes"
- A cópia de `preferences` é feita com spread explícito para evitar mutação do objeto original

### Campos do formulário

| Campo | Tipo HTML | Editável | Binding |
|---|---|---|---|
| Full Name | `<input type="text">` | ✅ | `draft.fullName` |
| Email Address | `<input type="email">` | ✅ | `draft.email` |
| Department | `<select>` | ✅ | `draft.department` (opções de `DEPARTMENTS`) |
| Role | `<input type="text" readOnly>` | ❌ | `draft.role` |

### Botões do rodapé

| Botão | Estado | Ação |
|---|---|---|
| Cancel | Sempre habilitado | Chama `onClose` |
| Save Changes | Habilitado apenas quando `isDirty` | Placeholder para fase 4.x |

---

## Avatar (3.1 / 3.2)

### 3.1 — Exibição condicional

O bloco de avatar é um container `80×80px` (`h-20 w-20`) com `rounded-xl` e `overflow-hidden`:

| `avatarUrl` | Renderiza |
|---|---|
| `null` | `<PersonIcon />` — SVG placeholder com silhueta genérica |
| `string` | `<img src={avatarUrl} alt="Avatar do funcionário" />` com `object-cover` |

O container tem `aria-label="Avatar do funcionário"` para acessibilidade de leitores de tela.

### 3.2 — Upload simulado (sem envio ao servidor)

Fluxo completo:
1. Botão **"Upload New"** (verde/primary, `aria-label="Fazer upload de nova foto de perfil"`) chama `fileInputRef.current?.click()`
2. `<input type="file" accept="image/*" className="hidden">` recebe o arquivo
3. `handleAvatarChange` instancia `FileReader`, chama `readAsDataURL(file)`
4. `reader.onload` extrai o `dataUrl` e chama `handleChange('avatarUrl', dataUrl)`
5. O estado `draft.avatarUrl` é atualizado → React re-renderiza o `<img>` substituindo o placeholder

> **Segurança:** nenhum dado é enviado ao servidor; o preview existe apenas na memória do navegador para a sessão atual.

Texto auxiliar abaixo do botão: `"Recommended: Square JPG or PNG, 400×400px."`

---

## Estilo dos campos do formulário (4.1 / 4.2 / 4.3)

### `FIELD_CLASS` — base compartilhada (4.1)

```
border border-transparent bg-[#31353C] rounded-lg px-4 py-2.5
text-body-sm text-on-surface transition-colors
focus:border-primary focus:outline-none
```

- Sem borda visível em repouso (`border-transparent`)
- Borda teal (`border-primary`) aparece ao entrar em foco — sem `outline`
- `transition-colors` suaviza a transição

### Select Department — chevron customizado (4.2)

```tsx
<div className="relative">
  <select className={`${FIELD_CLASS} appearance-none pr-10`}>...</select>
  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <ChevronIcon />  {/* SVG inline, aria-hidden */}
  </span>
</div>
```

- `appearance-none` remove a seta nativa do browser
- `pr-10` garante que o texto não sobreponha o ícone
- `pointer-events-none` no span impede que o chevron consuma o clique

### Campo Role — readonly visual (4.3)

| Propriedade | Valor | Motivo |
|---|---|---|
| `cursor` | `cursor-default` | Não sinaliza "proibido", apenas "não editável" |
| `user-select` | `select-none` | Impede seleção de texto acidental |
| `backgroundColor` | `#22262D` (inline style) | Mais escuro que `#31353C` dos campos editáveis |
| `opacity` | sem alteração | Muted via cor de fundo, não via opacidade |

> **Decisão de design:** usar `cursor-default` em vez de `cursor-not-allowed` segue a especificação — o campo não é proibido, apenas informativo. A cor de fundo mais escura comunica o estado sem degradar visualmente o texto.

---

## Componente `ToggleRow` (5.1)

**Localização:** `src/widgets/topbar/ui/ToggleRow.tsx`

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `icon` | `ReactNode` | ✅ | SVG exibido à esquerda |
| `label` | `string` | ✅ | Texto principal (bold) |
| `sublabel` | `string` | ✅ | Texto auxiliar (muted 12px) |
| `checked` | `boolean` | ✅ | Estado atual do toggle |
| `onChange` | `() => void` | ✅ | Callback — pai controla o estado |

### Visual

| Elemento | Especificação |
|---|---|
| Track (off) | `44×24px`, `border-radius: 12px`, `backgroundColor: #31353C` |
| Track (on) | `backgroundColor: #4EDEA3` |
| Thumb | `18×18px`, `borderRadius: 50%`, branco, `left: 3px` (off) / `left: 23px` (on) |
| Transição | `background-color 200ms ease` + `left 200ms ease` |
| Row | `backgroundColor: #1E2228`, `border-radius: 8px`, `padding: 16px` |

O botão usa `role="switch"` com `aria-checked` para conformidade WCAG.

---

## Toggles de Preferências (5.2 / 5.3)

Os dois toggles são instâncias de `ToggleRow` conectadas ao `draft.preferences`:

```tsx
handleChange('preferences', {
  ...draft.preferences,
  highContrast: !draft.preferences.highContrast,
})
```

O spread de `preferences` garante imutabilidade — cada toggle altera apenas o seu campo sem sobrescrever o outro.

### 5.2 — High Contrast Mode

| Campo | Valor |
|---|---|
| Estado inicial | `highContrast: false` → toggle Off (cinza) |
| Ícone | SVG meio-círculo (yin-yang simplificado) |
| Sublabel | "Enhance visibility for critical technical data." |

### 5.3 — Push Notifications

| Campo | Valor |
|---|---|
| Estado inicial | `pushNotifications: true` → toggle On (teal) |
| Ícone | SVG sino em `text-secondary` (roxo) |
| Sublabel | "Receive real-time alerts for critical stock changes." |

Ambos os toggles disparam o dirty check — alterar qualquer um habilita "Save Changes".

---

## Rodapé e persistência (6.1 / 6.2 / 6.3)

### 6.1 — Botões Cancel e Save Changes

| Botão | Comportamento |
|---|---|
| **Cancel** | Chama `setDraft({ ...effectiveInitialProfile })` para resetar o rascunho, depois `onClose()` |
| **Save Changes** | Desabilitado quando `isDirty = false`; chama `handleSave()` quando habilitado |

O reset explícito no Cancel é importante porque o RTL mantém o componente montado nos testes — garantindo que o draft seja limpo antes de fechar.

### 6.2 — Persistência em localStorage

**Chave:** `'userProfile'` (exportada como `PROFILE_STORAGE_KEY`)

**Fluxo do Save:**
1. `saveProfile(draft)` — `setProfile(draft)` + `localStorage.setItem('userProfile', JSON.stringify(draft))`
2. `setToastVisible(true)` → toast aparece no modal
3. `useEffect` detecta `toastVisible = true`, agenda `setTimeout(3000)` → `setToastVisible(false)` + `onClose()`

**Fluxo de abertura:**
- `loadProfileFromStorage()` lê o localStorage; se ausente ou JSON corrompido, retorna `mockUserProfile`
- `UserProfileProvider` inicializa o estado com `useState(loadProfileFromStorage)`

**Toast:**
- `role="status"` + `aria-live="polite"` para acessibilidade
- Cor `#4EDEA3` (teal claro), fundo `#1A3A2A`, borda `1px solid #4EDEA3`

### 6.3 — Reflexo do nome no Topbar (Context)

`UserProfileContext` é o elo entre modal e header:

```
UserProfileProvider (MainLayout)
  ├── MainLayoutInner
  │     └── <Topbar userName={profile.fullName} />   ← lê contexto
  └── EmployeeProfileModal
        └── saveProfile(draft)                        ← escreve contexto
```

**`MainLayout.tsx`** foi refatorado em dois componentes:
- `MainLayout` — Provider wrapper apenas
- `MainLayoutInner` — Consumer que lê `profile.fullName` e renderiza o layout

O `roleTitle` e `clearanceLabel` continuam vindo de `topbar-defaults.ts` (não editáveis no perfil).

**Arquivos criados/modificados:**

| Arquivo | Papel |
|---|---|
| `model/UserProfileContext.tsx` | Context + Provider + hook `useUserProfile` + `loadProfileFromStorage` |
| `ui/EmployeeProfileModal.tsx` | Consome `useUserProfile`, chama `saveProfile`, exibe toast |
| `main-layout/MainLayout.tsx` | Provê `UserProfileProvider`, passa `profile.fullName` ao Topbar |

---

## Evolução planejada

| Fase | Descrição | Status |
|---|---|---|
| 1.1–1.3 | Esqueleto visual: overlay, container, título, divisor | ✅ Concluído |
| 2.1–2.3 | Types, mock, campos controlados, dirty check, rodapé | ✅ Concluído |
| 3.1–3.2 | Avatar placeholder/img + Upload New com FileReader preview | ✅ Concluído |
| 4.1–4.3 | Estilo campos: bg #31353C, border teal focus, chevron select, role muted | ✅ Concluído |
| 5.1–5.3 | ToggleRow reutilizável + High Contrast Mode + Push Notifications | ✅ Concluído |
| 6.1–6.3 | Cancel reset + localStorage + toast + Context → Topbar | ✅ Concluído |
