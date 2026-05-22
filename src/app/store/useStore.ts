import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Customer, Debt, Payment, AppSettings } from '../types';
import { getSeedCustomers, getSeedDebts, getSeedPayments } from '../utils/seedData';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Debts
  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;

  // Payments
  payments: Payment[];
  addPayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;

  // Data
  loadSeedData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Settings
      settings: {
        theme: 'light',
        notifications: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Customers
      customers: [],
      addCustomer: (customer) =>
        set((state) => ({ customers: [...state.customers, customer] })),
      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      // Debts
      debts: [],
      addDebt: (debt) => set((state) => ({ debts: [...state.debts, debt] })),
      updateDebt: (id, updates) =>
        set((state) => ({
          debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDebt: (id) =>
        set((state) => ({ debts: state.debts.filter((d) => d.id !== id) })),

      // Payments
      payments: [],
      addPayment: (payment) =>
        set((state) => ({ payments: [...state.payments, payment] })),
      deletePayment: (id) =>
        set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),

      // Data
      loadSeedData: () =>
        set({
          customers: getSeedCustomers(),
          debts: getSeedDebts(),
          payments: getSeedPayments(),
        }),
    }),
    {
      name: 'digidebt-storage',
    }
  )
);
