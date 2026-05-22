import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/currency';
import { exportReportPDF, exportReportExcel } from '../utils/export';
import type { Currency } from '../types';

export function ReportsScreen() {
  const { customers, debts, payments } = useStore();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'all'>('all');

  const currencies: Currency[] = ['USD', 'EUR', 'AFN', 'PKR'];

  const reportTypes = [
    {
      title: 'Daily Report',
      description: 'Daily transactions and summary',
      icon: FileText,
      period: 'Today',
    },
    {
      title: 'Weekly Report',
      description: 'Last 7 days activity',
      icon: Calendar,
      period: 'This Week',
    },
    {
      title: 'Monthly Report',
      description: 'Current month overview',
      icon: Calendar,
      period: 'This Month',
    },
    {
      title: 'Customer Statement',
      description: 'Individual customer report',
      icon: FileText,
      period: 'All Time',
    },
  ];

  const handleExport = (reportType: string, format: string) => {
    const currency = selectedCurrency === 'all' ? undefined : selectedCurrency;

    if (format === 'PDF') {
      exportReportPDF(reportType, debts, payments, customers, currency);
    } else if (format === 'Excel') {
      exportReportExcel(reportType, debts, payments, customers, currency);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white mb-1">Reports</h1>
            <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
              Generate and export business reports
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Filter by Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency | 'all')}
              className="w-full lg:w-auto px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm lg:text-base"
            >
              <option value="all">All Currencies</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AFN">AFN</option>
              <option value="PKR">PKR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary by Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        {currencies.map((currency) => {
          const totalRevenue = payments
            .filter(p => p.currency === currency)
            .reduce((sum, p) => sum + p.amount, 0);
          const totalOutstanding = debts
            .filter(d => d.currency === currency)
            .reduce((sum, d) => sum + d.remainingAmount, 0);

          return (
            <div key={currency} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{currency}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Collected</p>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(totalRevenue, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Outstanding</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalOutstanding, currency)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Types */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.title}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {report.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {report.period}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(report.title, 'PDF')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport(report.title, 'Excel')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {payments.slice(-10).reverse().map((payment) => {
            const customer = customers.find((c) => c.id === payment.customerId);
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{customer?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    +{formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{payment.currency}</p>
                </div>
              </div>
            );
          })}
          {payments.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
