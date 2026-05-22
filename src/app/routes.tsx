import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { DashboardScreen } from './screens/DashboardScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { CustomerDetailsScreen } from './screens/CustomerDetailsScreen';
import { DebtsScreen } from './screens/DebtsScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginScreen,
  },
  {
    path: '/register',
    Component: RegisterScreen,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardScreen },
      { path: 'customers', Component: CustomersScreen },
      { path: 'customers/:id', Component: CustomerDetailsScreen },
      { path: 'debts', Component: DebtsScreen },
      { path: 'payments', Component: PaymentsScreen },
      { path: 'reports', Component: ReportsScreen },
      { path: 'settings', Component: SettingsScreen },
      { path: '*', Component: NotFoundScreen },
    ],
  },
]);
