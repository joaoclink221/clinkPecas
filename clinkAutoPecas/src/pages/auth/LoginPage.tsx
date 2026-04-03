import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { signIn, SignInError } from '@/features/auth/login/model/signIn'
import { ROUTES } from '@/shared/constants/routes'
import { Button, TextField } from '@/shared/ui'

type LoginFormState = {
  identifier: string
  password: string
}

type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>

function validateLoginForm(values: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.identifier.trim()) {
    errors.identifier = 'Informe o Employee ID ou e-mail.'
  }

  if (!values.password) {
    errors.password = 'Informe a senha.'
  }

  return errors
}

export function LoginPage() {
  const navigate = useNavigate()

  const [values, setValues] = useState<LoginFormState>({ identifier: '', password: '' })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitError(null)

    const nextErrors = validateLoginForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await signIn({ identifier: values.identifier, password: values.password })
      setValues({ identifier: '', password: '' })
      navigate(ROUTES.home)
    } catch (error) {
      if (error instanceof SignInError) {
        setSubmitError(error.message)
      } else {
        setSubmitError('Falha inesperada ao autenticar. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-surface px-4 py-10 text-on-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(78,222,163,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(210,187,255,0.10),transparent_55%)]"
      />

      <section
        className="relative w-full max-w-md rounded-2xl border border-outline-variant/15 bg-surface-container-low p-8 shadow-ambient"
        aria-labelledby="login-title"
      >
        <header className="flex flex-col gap-2">
          <p className="text-label-technical text-secondary">Obsidian Gear</p>
          <h1 id="login-title" className="text-headline-sm font-semibold text-on-surface">
            Intelligence Portal
          </h1>
          <p className="text-body-sm text-on-surface-variant">Encrypted enterprise access</p>
        </header>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Employee ID or Email"
            name="identifier"
            autoComplete="username"
            placeholder="Enter your credentials"
            value={values.identifier}
            error={errors.identifier}
            disabled={isSubmitting}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, identifier: e.target.value }))
              if (errors.identifier) {
                setErrors((prev) => ({ ...prev, identifier: undefined }))
              }
            }}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-medium text-on-surface-variant" aria-hidden>
              
              </span>
              <a
                href="#"
                className="text-body-sm font-medium text-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Forgot Password?
              </a>
            </div>

            <TextField
              label="Password"
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              error={errors.password}
              disabled={isSubmitting}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, password: e.target.value }))
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }
              }}
            />
          </div>

          {submitError ? (
            <p className="rounded-lg bg-error-container/50 px-4 py-3 text-body-sm text-on-error-container" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={!canSubmit} aria-busy={isSubmitting}>
            {isSubmitting ? 'Signing In…' : 'Sign In'}
          </Button>

          <p className="text-center text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-full bg-secondary" />
              Encrypted enterprise access
            </span>
          </p>
        </form>
      </section>
    </div>
  )
}
