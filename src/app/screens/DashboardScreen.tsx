import { Users, Wallet, Receipt, ArrowUpRight, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import { useStore } from '../store/useStore';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Currency } from '../types';

export function DashboardScreen() {
  const { customers, debts, payments } = useStore();

  const currencies: Currency[] = ['USD', 'EUR', 'AFN', 'PKR'];
  const totalCustomers = customers.length;

  const weeklyData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 1900 },
    { day: 'Wed', amount: 800 },
    { day: 'Thu', amount: 2100 },
    { day: 'Fri', amount: 1500 },
    { day: 'Sat', amount: 2400 },
    { day: 'Sun', amount: 1000 },
  ];

  const debtByCurrency = currencies
    .map((currency) => {
      const total = debts
        .filter((d) => d.currency === currency)
        .reduce((sum, d) => sum + d.remainingAmount, 0);
      return { name: currency, value: total };
    })
    .filter((item) => item.value > 0);

  const colors = ['#10b981', '#14b8a6', '#f59e0b', '#ef4444'];

  const totalOutstanding = debts
    .filter((d) => d.status !== 'paid')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const quickActions = [
    { label: 'Customers', sublabel: 'Add / view', icon: Users, path: '/customers', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Add Debt', sublabel: 'Record debt', icon: Receipt, path: '/debts', gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Payment', sublabel: 'Log payment', icon: Wallet, path: '/payments', gradient: 'from-violet-500 to-purple-600' },
    { label: 'Reports', sublabel: 'View reports', icon: TrendingUp, path: '/reports', gradient: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back — here's your business overview
        </p>
      </div>

      {/* Hero KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
        {/* Customers */}
        <div
          className="rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold mb-0.5">{totalCustomers}</p>
            <p className="text-emerald-200 text-sm">Total Customers</p>
          </div>
        </div>

        {/* Outstanding */}
        <div
          className="rounded-2xl p-5 text-white shadow-lg shadow-red-500/20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <p className="text-xl font-bold mb-0.5 truncate">
              {debts.length === 0 ? '—' : `${debts.filter((d) => d.status !== 'paid').length} debts`}
            </p>
            <p className="text-red-200 text-sm">Outstanding</p>
          </div>
        </div>

        {/* Collected */}
        <div
          className="rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xl font-bold mb-0.5">
              {payments.length === 0 ? '—' : `${payments.length} payments`}
            </p>
            <p className="text-blue-200 text-sm">Collected</p>
          </div>
        </div>
      </div>

      {/* Currency Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {currencies.map((currency, i) => {
          const totalCredit = debts
            .filter((d) => d.currency === currency)
            .reduce((sum, d) => sum + d.remainingAmount, 0);
          const totalPaid = payments
            .filter((p) => p.currency === currency)
            .reduce((sum, p) => sum + p.amount, 0);

          const accentColors = [
            'border-t-emerald-500',
            'border-t-teal-500',
            'border-t-amber-500',
            'border-t-violet-500',
          ];

          return (
            <div
              key={currency}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 border-t-4 ${accentColors[i]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{currency}</span>
                <span className="text-base text-slate-400 font-mono">{getCurrencySymbol(currency)}</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Outstanding</p>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalCredit, currency)}
                  </p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Collected</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalPaid, currency)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        {/* Weekly Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Weekly Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Payment trends this week</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="amount" fill="url(#emeraldGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Debt Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Outstanding by Currency</h2>
              <p className="text-xs text-slate-400 mt-0.5">Remaining debt distribution</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg">
              <CreditCard className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          {debtByCurrency.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={debtByCurrency}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {debtByCurrency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {debtByCurrency.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2 py-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 ml-auto">
                      {getCurrencySymbol(item.name as Currency)}{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-400 dark:text-slate-500">
              <div className="bg-slate-100 dark:bg-slate-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No outstanding debts</p>
              <p className="text-xs mt-1">Add debts to see distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`bg-gradient-to-br ${action.gradient} w-11 h-11 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{action.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{action.sublabel}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
