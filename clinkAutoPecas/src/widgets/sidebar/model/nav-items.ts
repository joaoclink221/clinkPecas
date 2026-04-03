import { ROUTES } from '@/shared/constants/routes'

export type NavItem = {
  to: string
  label: string
}

export const primaryNavItems: NavItem[] = [
  { to: ROUTES.home, label: 'Dashboard' },
  { to: ROUTES.sales, label: 'Vendas' },
  { to: ROUTES.purchases, label: 'Compras' },
  { to: ROUTES.stock, label: 'Estoque' },
  { to: ROUTES.customers, label: 'Clientes' },
  { to: ROUTES.suppliers, label: 'Fornecedores' },
  { to: ROUTES.finance, label: 'Financeiro' },
  { to: ROUTES.logistics, label: 'Logística' },
]
