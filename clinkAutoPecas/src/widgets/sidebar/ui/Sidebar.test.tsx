import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('Sidebar (via shell)', () => {
  it('lista links de navegação principal com hrefs corretos', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: /principal/i })
    expect(nav).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /^dashboard$/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /^vendas$/i })).toHaveAttribute('href', '/vendas')
    expect(screen.getByRole('link', { name: /^estoque$/i })).toHaveAttribute('href', '/estoque')
  })
})
