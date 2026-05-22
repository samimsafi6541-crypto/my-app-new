export type Currency = 'USD' | 'EUR' | 'AFN' | 'PKR';

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  image?: string;
  notes?: string;
  createdAt: number;
}

export interface Debt {
  id: string;
  customerId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: Currency;
  dueDate?: string;
  notes?: string;
  status: 'paid' | 'unpaid' | 'partial';
  createdAt: number;
}

export interface Payment {
  id: string;
  debtId: string;
  customerId: string;
  amount: number;
  currency: Currency;
  paymentMethod: string;
  notes?: string;
  createdAt: number;
}

export interface AppSettings {
  theme: Theme;
  notifications: boolean;
}
