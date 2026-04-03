import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renderiza o dashboard com título principal no conteúdo', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { level: 1, name: /overview/i })).toBeInTheDocument()
  })

  it('mantém um landmark main para o conteúdo da rota', () => {
    renderApp('/')

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('mostra o perfil com Manager e Authorized na topbar', () => {
    renderApp('/')

    expect(screen.getByText(/manager/i)).toBeInTheDocument()
    expect(screen.getByText(/authorized/i)).toBeInTheDocument()
  })
})
