export type SignInInput = {
  identifier: string
  password: string
}

export type SignInResult = {
  userName: string
}

export class SignInError extends Error {
  readonly code: 'INVALID_CREDENTIALS' | 'UNKNOWN'

  constructor(message: string, code: SignInError['code']) {
    super(message)
    this.name = 'SignInError'
    this.code = code
  }
}

export async function signIn({ identifier, password }: SignInInput): Promise<SignInResult> {
  try {
    const normalizedIdentifier = identifier.trim()

    if (!normalizedIdentifier) {
      throw new SignInError('Informe o Employee ID ou e-mail.', 'INVALID_CREDENTIALS')
    }

    if (!password) {
      throw new SignInError('Informe a senha.', 'INVALID_CREDENTIALS')
    }

    if (normalizedIdentifier !== 'admin' || password !== 'admin') {
      throw new SignInError('Credenciais inválidas.', 'INVALID_CREDENTIALS')
    }

    return { userName: 'Admin' }
  } catch (error) {
    if (error instanceof SignInError) {
      throw error
    }

    throw new SignInError('Falha inesperada ao autenticar. Tente novamente.', 'UNKNOWN')
  }
}
