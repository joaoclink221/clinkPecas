export const ROUTES = {
  home: '/',
  login: '/login',
  sales: '/vendas',
  purchases: '/compras',
  stock: '/estoque',
  customers: '/clientes',
  suppliers: '/fornecedores',
  finance: '/financeiro',
  logistics: '/logistica',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
