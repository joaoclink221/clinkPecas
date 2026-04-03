import { describe, expect, it } from 'vitest'

import { SignInError, signIn } from './signIn'

describe('signIn', () => {
  it('retorna usuário quando credenciais são admin/admin', async () => {
    await expect(signIn({ identifier: 'admin', password: 'admin' })).resolves.toEqual({ userName: 'Admin' })
  })

  it('falha com erro tipado quando credenciais são inválidas', async () => {
    await expect(signIn({ identifier: 'x', password: 'y' })).rejects.toBeInstanceOf(SignInError)
  })

  it('normaliza identifier com trim', async () => {
    await expect(signIn({ identifier: '  admin  ', password: 'admin' })).resolves.toEqual({ userName: 'Admin' })
  })
})
