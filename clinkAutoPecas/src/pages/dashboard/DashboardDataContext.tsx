/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'

import {
  inventoryMix,
  kpiData,
  recentSales,
  salesVelocity,
  stockMovements,
  type InventoryMixItem,
  type KpiData,
  type RecentSaleRow,
  type SalesVelocityPoint,
  type StockMovementRow,
} from './mock-data'

export type DashboardData = {
  kpiData: KpiData[]
  salesVelocity: SalesVelocityPoint[]
  inventoryMix: InventoryMixItem[]
  recentSales: RecentSaleRow[]
  stockMovements: StockMovementRow[]
}

const defaultValue: DashboardData = {
  kpiData,
  salesVelocity,
  inventoryMix,
  recentSales,
  stockMovements,
}

const DashboardDataContext = createContext<DashboardData>(defaultValue)

export function DashboardDataProvider({
  children,
  value = defaultValue,
}: {
  children: ReactNode
  value?: DashboardData
}) {
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData(): DashboardData {
  return useContext(DashboardDataContext)
}
