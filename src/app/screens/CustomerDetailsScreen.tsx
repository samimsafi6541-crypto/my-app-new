import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Phone, MapPin, Receipt, Wallet, MessageCircle, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { exportCustomerStatementPDF, generateWhatsAppMessage, shareViaWhatsApp } from '../utils/export';
import type { Currency } from '../types';

export function CustomerDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, debts, payments } = useStore();

  const customer = customers.find((c) => c.id === id);
  const customerDebts = debts.filter((d) => d.customerId === id);
  const customerPayments = payments.filter((p) => p.customerId === id);

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Customer not found</p>
          <button
            onClick={() => navigate('/customers')}
            className="mt-4 text-emerald-600 hover:text-emerald-700"
          >
            Go back to customers
          </button>
        </div>
      </div>
    );
  }

  const currencies: Currency[] = ['USD', 'EUR', 'AFN', 'PKR'];

  const handleExportPDF = () => {
    exportCustomerStatementPDF(customer, customerDebts, customerPayments);
  };

  const handleWhatsAppShare = () => {
    const latestDebt = customerDebts.find((d) => d.status !== 'paid');
    if (latestDebt) {
      const message = generateWhatsAppMessage(customer, latestDebt);
      shareViaWhatsApp(customer.phone, message);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 lg:mb-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm lg:text-base">Back to Customers</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm lg:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm lg:text-base"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">WA</span>
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900 dark:text-white mb-2">
              {customer.name}
            </h1>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.address && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
            {customer.notes && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 italic">
                {customer.notes}
              </p>
            )}
          </div>
        </div>

        {/* Stats by Currency */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {currencies.map((currency) => {
            const totalDebt = customerDebts
              .filter(d => d.currency === currency)
              .reduce((sum, d) => sum + d.totalAmount, 0);
            const totalPaid = customerPayments
              .filter(p => p.currency === currency)
              .reduce((sum, p) => sum + p.amount, 0);
            const totalRemaining = customerDebts
              .filter(d => d.currency === currency)
              .reduce((sum, d) => sum + d.remainingAmount, 0);

            if (totalDebt === 0 && totalPaid === 0) return null;

            return (
              <div key={currency} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  {currency} {getCurrencySymbol(currency)}
                </p>
                <div className="space-y-1">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(totalDebt, currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400">Paid</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {formatCurrency(totalPaid, currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-red-700 dark:text-red-400">Remaining</p>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                      {formatCurrency(totalRemaining, currency)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Debts</h2>
        </div>
        <div className="space-y-2">
          {customerDebts.map((debt) => (
            <div
              key={debt.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(debt.totalAmount, debt.currency)} ({debt.currency})
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {debt.dueDate && `Due: ${new Date(debt.dueDate).toLocaleDateString()}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Remaining: {formatCurrency(debt.remainingAmount, debt.currency)}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    debt.status === 'paid'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : debt.status === 'partial'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {debt.status}
                </span>
              </div>
            </div>
          ))}
          {customerDebts.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No debts recorded
            </p>
          )}
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Payment History</h2>
        </div>
        <div className="space-y-2">
          {customerPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">
                  +{formatCurrency(payment.amount, payment.currency)} ({payment.currency})
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod}
                </p>
              </div>
            </div>
          ))}
          {customerPayments.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No payments recorded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
