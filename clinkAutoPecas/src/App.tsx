import { Route, Routes } from 'react-router-dom'

import { MainLayout } from '@/widgets/main-layout'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { InventoryPage } from '@/pages/inventory/InventoryPage'
import { ClientsPage } from '@/pages/clients/ClientsPage'
import { ModulePlaceholderPage } from '@/pages/ModulePlaceholderPage'
import { PurchasesPage } from '@/pages/purchases/PurchasesPage'
import { SalesPage } from '@/pages/sales/SalesPage'
import { ROUTES } from '@/shared/constants/routes'

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.login.slice(1)} element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.sales.slice(1)} element={<SalesPage />} />
        <Route path={ROUTES.purchases.slice(1)} element={<PurchasesPage />} />
        <Route path={ROUTES.stock.slice(1)} element={<InventoryPage />} />
        <Route
          path={ROUTES.customers.slice(1)}
          element={<ClientsPage />}
        />
        <Route
          path={ROUTES.suppliers.slice(1)}
          element={<ModulePlaceholderPage title="Fornecedores" />}
        />
        <Route
          path={ROUTES.finance.slice(1)}
          element={<ModulePlaceholderPage title="Financeiro" />}
        />
        <Route
          path={ROUTES.logistics.slice(1)}
          element={<ModulePlaceholderPage title="Logística" />}
        />
      </Route>
    </Routes>
  )
}
