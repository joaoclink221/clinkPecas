 /* eslint-disable react-refresh/only-export-components -- Context files intentionally export hooks + helpers alongside the Provider component */
 
import { createContext, useContext, useState, type ReactNode } from 'react'

import { mockUserProfile } from './employee-profile.mock'
import type { UserProfile } from './employee-profile.types'

// ── Constantes ────────────────────────────────────────────────────────────────

/** Chave usada em localStorage para persistir o perfil. */
export const PROFILE_STORAGE_KEY = 'userProfile'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Carrega o perfil do localStorage.
 * Retorna o mock padrão se a chave não existir ou se o JSON estiver corrompido.
 */
export function loadProfileFromStorage(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserProfile
  } catch {
    // JSON inválido — silencia e usa o fallback
  }
  return mockUserProfile
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface ProfileContextValue {
  /** Perfil ativo — carregado do localStorage ou mock padrão. */
  profile: UserProfile
  /**
   * Persiste o perfil no localStorage e atualiza o estado em memória.
   * Não faz chamada de rede — persistência local apenas.
   */
  saveProfile: (next: UserProfile) => void
}

/** Valor padrão permite usar o hook fora do Provider (testes isolados). */
const ProfileContext = createContext<ProfileContextValue>({
  profile: mockUserProfile,
  saveProfile: () => undefined,
})

// ── Provider ──────────────────────────────────────────────────────────────────

export function UserProfileProvider({ children }: { children: ReactNode }): ReactNode {
  // Inicialização lazy — lê localStorage apenas na montagem
  const [profile, setProfile] = useState<UserProfile>(loadProfileFromStorage)

  function saveProfile(next: UserProfile): void {
    setProfile(next)
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/** Hook de acesso ao contexto de perfil do usuário. */
export function useUserProfile(): ProfileContextValue {
  return useContext(ProfileContext)
}
