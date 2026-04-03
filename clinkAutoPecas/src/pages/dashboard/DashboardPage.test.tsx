import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DashboardPage } from './DashboardPage'

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  )
}

describe('DashboardPage', () => {
  describe('1.1 — Header e Live Feed badge', () => {
    it('renderiza heading "Overview." como h1', () => {
      renderDashboard()

      expect(screen.getByRole('heading', { level: 1, name: /overview/i })).toBeInTheDocument()
    })

    it('exibe subtítulo descritivo', () => {
      renderDashboard()

      expect(screen.getByText(/real-time telemetry/i)).toBeInTheDocument()
    })

    it('exibe o badge LIVE FEED', () => {
      renderDashboard()

      expect(screen.getByText(/live feed/i)).toBeInTheDocument()
    })
  })

  describe('1.2 — KPI cards', () => {
    it('renderiza a seção de indicadores principais', () => {
      renderDashboard()

      expect(screen.getByRole('region', { name: /indicadores principais/i })).toBeInTheDocument()
    })

    it('exibe os 4 cards KPI com seus rótulos', () => {
      renderDashboard()

      expect(screen.getByText(/monthly sales/i)).toBeInTheDocument()
      expect(screen.getByText(/pending orders/i)).toBeInTheDocument()
      expect(screen.getByText(/low stock sku/i)).toBeInTheDocument()
      expect(screen.getByText(/revenue growth/i)).toBeInTheDocument()
    })

    it('exibe os valores placeholder dos 4 cards', () => {
      renderDashboard()

      expect(screen.getByText('$124,592')).toBeInTheDocument()
      expect(screen.getByText('86')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('+$14.2k')).toBeInTheDocument()
    })

    it('exibe os badges dos 4 cards', () => {
      renderDashboard()

      expect(screen.getByText('+12.4%')).toBeInTheDocument()
      expect(screen.getByText('24 Active')).toBeInTheDocument()
      expect(screen.getByText('Critical')).toBeInTheDocument()
      expect(screen.getByText('84% Goal')).toBeInTheDocument()
    })
  })

  describe('1.3 — Widget slots', () => {
    it('renderiza a seção de widgets de análise', () => {
      renderDashboard()

      expect(screen.getByRole('region', { name: /widgets de análise/i })).toBeInTheDocument()
    })

    it('exibe os 4 widgets com seus rótulos', () => {
      renderDashboard()

      // Charts reais expõem rótulo como texto visível
      expect(screen.getByText(/^sales velocity$/i)).toBeInTheDocument()
      expect(screen.getByText(/^inventory mix$/i)).toBeInTheDocument()
      // Slots ainda placeholder mantêm aria-label no wrapper
      expect(screen.getByLabelText(/recent sales/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/stock movements/i)).toBeInTheDocument()
    })
  })
})
