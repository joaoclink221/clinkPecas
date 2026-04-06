import type { UserProfile } from './employee-profile.types'

// ── 2.2 Mock inicial do perfil ────────────────────────────────────────────────
// Dados hardcoded que populam o formulário na ausência de API.
// Correspondem à imagem de referência do design.

export const mockUserProfile: UserProfile = {
  fullName:   'Ricardo Oliveira',
  email:      'ricardo.o@obsidiangear.com',
  department: 'Logística',
  role:       'Fleet Coordinator',
  avatarUrl:  null,
  preferences: {
    highContrast:      false,
    pushNotifications: true,
  },
}
