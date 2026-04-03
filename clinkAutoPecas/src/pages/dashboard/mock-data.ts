import type { KpiCardProps } from './KpiCard'

// ── Tipos ─────────────────────────────────────────────────────────────────

export type KpiData = Required<Pick<KpiCardProps, 'label' | 'value' | 'badge' | 'badgeVariant'>> & {
  id: string
}

export type SalesVelocityPoint = {
  day: string
  volume: number
  value: number
}

export type InventoryMixItem = {
  category: string
  units: number
  color: string
}

export type RecentSaleRow = {
  id: string
  customer: string
  value: string
  status: 'completed' | 'pending' | 'cancelled'
}

export type StockMovementRow = {
  id: string
  part: string
  quantity: number
  action: 'in' | 'out' | 'adjustment'
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const kpiData: KpiData[] = [
  {
    id: 'monthly-sales',
    label: 'Monthly Sales',
    value: '$124,592',
    badge: '+12.4%',
    badgeVariant: 'positive',
  },
  {
    id: 'pending-orders',
    label: 'Pending Orders',
    value: '86',
    badge: '24 Active',
    badgeVariant: 'neutral',
  },
  {
    id: 'low-stock-sku',
    label: 'Low Stock SKU',
    value: '12',
    badge: 'Critical',
    badgeVariant: 'critical',
  },
  {
    id: 'revenue-growth',
    label: 'Revenue Growth',
    value: '+$14.2k',
    badge: '84% Goal',
    badgeVariant: 'positive',
  },
]

export const salesVelocity: SalesVelocityPoint[] = [
  { day: 'Mon', volume: 38, value: 18200 },
  { day: 'Tue', volume: 52, value: 24800 },
  { day: 'Wed', volume: 44, value: 21000 },
  { day: 'Thu', volume: 61, value: 29100 },
  { day: 'Fri', volume: 57, value: 27200 },
  { day: 'Sat', volume: 78, value: 37300 },
  { day: 'Sun', volume: 63, value: 30100 },
]

export const inventoryMix: InventoryMixItem[] = [
  { category: 'Engines', units: 2100, color: '#4edea3' },
  { category: 'Tires', units: 3200, color: '#d2bbff' },
  { category: 'Filters', units: 1500, color: '#9aa3b2' },
  { category: 'Others', units: 1600, color: '#10b981' },
]

export const recentSales: RecentSaleRow[] = [
  { id: '#ORD-90212', customer: 'Apex Auto', value: '$4,290.00', status: 'completed' },
  { id: '#ORD-90213', customer: 'Mecânica do Beto', value: '$2,120.50', status: 'pending' },
  { id: '#ORD-90214', customer: 'Transportes Rápido Ltda', value: '$940.00', status: 'cancelled' },
  { id: '#ORD-90215', customer: 'Elite Motors Service', value: '$5,890.90', status: 'completed' },
  { id: '#ORD-90216', customer: 'Garagem Central SP', value: '$1,380.00', status: 'pending' },
]

export const stockMovements: StockMovementRow[] = [
  { id: 'SKU-0012', part: 'V8 Cylinder Block', quantity: 4, action: 'in' },
  { id: 'SKU-0047', part: 'Brake Disc Ventilated', quantity: -12, action: 'out' },
  { id: 'SKU-0093', part: 'Oil Filter Synthetic', quantity: 50, action: 'in' },
  { id: 'SKU-0134', part: 'Front Shock Absorber', quantity: -3, action: 'out' },
  { id: 'SKU-0201', part: 'Alternator 120A', quantity: 2, action: 'adjustment' },
]
