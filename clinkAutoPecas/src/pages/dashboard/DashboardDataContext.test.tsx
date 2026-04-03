import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { kpiData, recentSales, salesVelocity, inventoryMix, stockMovements } from './mock-data'
import { DashboardDataProvider, useDashboardData } from './DashboardDataContext'

function DataConsumer() {
  const data = useDashboardData()
  return (
    <ul>
      <li data-testid="kpi-count">{data.kpiData.length}</li>
      <li data-testid="velocity-count">{data.salesVelocity.length}</li>
      <li data-testid="mix-count">{data.inventoryMix.length}</li>
      <li data-testid="sales-count">{data.recentSales.length}</li>
      <li data-testid="movements-count">{data.stockMovements.length}</li>
    </ul>
  )
}

describe('DashboardDataContext', () => {
  it('fornece os dados mockados padrão pelo provider', () => {
    render(
      <DashboardDataProvider>
        <DataConsumer />
      </DashboardDataProvider>,
    )

    expect(screen.getByTestId('kpi-count').textContent).toBe(String(kpiData.length))
    expect(screen.getByTestId('velocity-count').textContent).toBe(String(salesVelocity.length))
    expect(screen.getByTestId('mix-count').textContent).toBe(String(inventoryMix.length))
    expect(screen.getByTestId('sales-count').textContent).toBe(String(recentSales.length))
    expect(screen.getByTestId('movements-count').textContent).toBe(String(stockMovements.length))
  })

  it('aceita value customizado (injeção de dados externos)', () => {
    const customData = {
      kpiData: [],
      salesVelocity: [],
      inventoryMix: [],
      recentSales: [],
      stockMovements: [],
    }

    render(
      <DashboardDataProvider value={customData}>
        <DataConsumer />
      </DashboardDataProvider>,
    )

    expect(screen.getByTestId('kpi-count').textContent).toBe('0')
    expect(screen.getByTestId('sales-count').textContent).toBe('0')
  })

  it('useDashboardData usa mock data sem provider (defaultValue)', () => {
    render(<DataConsumer />)

    expect(screen.getByTestId('kpi-count').textContent).toBe(String(kpiData.length))
  })
})
