import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import { mockUserProfile } from './employee-profile.mock'
import {
  PROFILE_STORAGE_KEY,
  UserProfileProvider,
  loadProfileFromStorage,
  useUserProfile,
} from './UserProfileContext'

// ── Fixture ───────────────────────────────────────────────────────────────────

/** Componente auxiliar para expor o contexto ao DOM nos testes. */
function ProfileDisplay() {
  const { profile, saveProfile } = useUserProfile()
  return (
    <div>
      <span data-testid="full-name">{profile.fullName}</span>
      <button onClick={() => saveProfile({ ...profile, fullName: 'Novo Nome' })}>
        Salvar
      </button>
    </div>
  )
}

function renderWithProvider() {
  render(
    <UserProfileProvider>
      <ProfileDisplay />
    </UserProfileProvider>,
  )
}

// ── 6.2 loadProfileFromStorage ─────────────────────────────────────────────────

describe('loadProfileFromStorage', () => {
  beforeEach(() => localStorage.clear())

  it('retorna mockUserProfile quando localStorage está vazio', () => {
    const profile = loadProfileFromStorage()
    expect(profile).toEqual(mockUserProfile)
  })

  it('retorna o perfil salvo quando a chave existe no localStorage', () => {
    const saved = { ...mockUserProfile, fullName: 'Joana Silva' }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(saved))

    const profile = loadProfileFromStorage()
    expect(profile.fullName).toBe('Joana Silva')
  })

  it('retorna mockUserProfile quando o JSON está corrompido', () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, 'JSON_INVALIDO{{{')
    const profile = loadProfileFromStorage()
    expect(profile).toEqual(mockUserProfile)
  })
})

// ── 6.2 UserProfileProvider — estado inicial ───────────────────────────────────

describe('UserProfileProvider — estado inicial', () => {
  beforeEach(() => localStorage.clear())

  it('exibe o fullName do mock quando localStorage está vazio', () => {
    renderWithProvider()
    expect(screen.getByTestId('full-name').textContent).toBe(mockUserProfile.fullName)
  })

  it('exibe o fullName salvo quando localStorage tem dado válido', () => {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ ...mockUserProfile, fullName: 'Carlos Drummond' }),
    )
    renderWithProvider()
    expect(screen.getByTestId('full-name').textContent).toBe('Carlos Drummond')
  })
})

// ── 6.2 saveProfile — persistência ────────────────────────────────────────────

describe('UserProfileProvider — saveProfile', () => {
  beforeEach(() => localStorage.clear())

  it('atualiza o fullName no contexto após salvar', async () => {
    renderWithProvider()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))
    expect(screen.getByTestId('full-name').textContent).toBe('Novo Nome')
  })

  it('persiste o perfil em localStorage com a chave correta', async () => {
    renderWithProvider()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) ?? '{}')
    expect(stored.fullName).toBe('Novo Nome')
  })

  it('localStorage.setItem é chamado com o JSON correto', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    renderWithProvider()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(spy).toHaveBeenCalledWith(
      PROFILE_STORAGE_KEY,
      expect.stringContaining('"fullName":"Novo Nome"'),
    )
    spy.mockRestore()
  })

  it('múltiplos saves sobrescrevem corretamente', async () => {
    function MultiSaveDisplay() {
      const { profile, saveProfile } = useUserProfile()
      return (
        <div>
          <span data-testid="full-name">{profile.fullName}</span>
          <button onClick={() => saveProfile({ ...profile, fullName: 'Nome A' })}>A</button>
          <button onClick={() => saveProfile({ ...profile, fullName: 'Nome B' })}>B</button>
        </div>
      )
    }
    render(<UserProfileProvider><MultiSaveDisplay /></UserProfileProvider>)

    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(screen.getByTestId('full-name').textContent).toBe('Nome A')

    await userEvent.click(screen.getByRole('button', { name: 'B' }))
    expect(screen.getByTestId('full-name').textContent).toBe('Nome B')

    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) ?? '{}')
    expect(stored.fullName).toBe('Nome B')
  })
})

// ── 6.2 Hook fora do Provider — valor padrão ──────────────────────────────────

describe('useUserProfile — fora do Provider', () => {
  it('retorna o perfil mock como valor padrão (context default value)', () => {
    function Standalone() {
      const { profile } = useUserProfile()
      return <span data-testid="name">{profile.fullName}</span>
    }
    render(<Standalone />)
    // Contexto padrão usa mockUserProfile
    expect(screen.getByTestId('name').textContent).toBe(mockUserProfile.fullName)
  })
})
