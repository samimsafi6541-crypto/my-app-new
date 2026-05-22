import type { Currency } from '../types';

export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    AFN: '؋',
    PKR: '₨',
  };
  return symbols[currency];
}

export function formatCurrency(amount: number, currency: Currency): string {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString()}`;
}
