import { useState } from 'react';
import { Plus, Calendar, User, MessageCircle, Receipt, TrendingDown, CheckCircle2, Clock, Pencil, Trash2, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/currency';
import { generateWhatsAppMessage, shareViaWhatsApp } from '../utils/export';
import type { Debt, Currency } from '../types';

export function DebtsScreen() {
  const { debts, customers, addDebt, updateDebt, deleteDebt } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    totalAmount: '',
    currency: 'USD' as Currency,
    dueDate: '',
    notes: '',
  });

  const resetForm = () =>
    setFormData({ customerId: '', totalAmount: '', currency: 'USD', dueDate: '', notes: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.totalAmount);
    const newDebt: Debt = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      totalAmount: amount,
      paidAmount: 0,
      remainingAmount: amount,
      currency: formData.currency,
      dueDate: formData.dueDate,
      notes: formData.notes,
      status: 'unpaid',
      createdAt: Date.now(),
    };
    addDebt(newDebt);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebt) return;
    const amount = parseFloat(formData.totalAmount);
    const newPaid = Math.min(editingDebt.paidAmount, amount);
    const newRemaining = amount - newPaid;
    const newStatus = newRemaining <= 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';
    updateDebt(editingDebt.id, {
      customerId: formData.customerId,
      totalAmount: amount,
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      currency: formData.currency,
      dueDate: formData.dueDate,
      notes: formData.notes,
      status: newStatus,
    });
    setEditingDebt(null);
    resetForm();
  };

  const openEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      customerId: debt.customerId,
      totalAmount: debt.totalAmount.toString(),
      currency: debt.currency,
      dueDate: debt.dueDate || '',
      notes: debt.notes || '',
    });
  };

  const getCustomerName = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name || 'Unknown';

  const statusConfig = {
    paid: {
      label: 'Paid',
      classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      borderColor: 'border-l-emerald-500',
      icon: CheckCircle2,
    },
    unpaid: {
      label: 'Unpaid',
      classes: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      borderColor: 'border-l-red-500',
      icon: TrendingDown,
    },
    partial: {
      label: 'Partial',
      classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      borderColor: 'border-l-amber-400',
      icon: Clock,
    },
  };

  const handleWhatsAppShare = (debt: Debt) => {
    const customer = customers.find((c) => c.id === debt.customerId);
    if (customer) {
      const message = generateWhatsAppMessage(customer, debt);
      shareViaWhatsApp(customer.phone, message);
    }
  };

  const paidPercent = (debt: Debt) =>
    debt.totalAmount > 0 ? Math.round((debt.paidAmount / debt.totalAmount) * 100) : 0;

  const summaryStats = {
    total: debts.length,
    unpaid: debts.filter((d) => d.status === 'unpaid').length,
    partial: debts.filter((d) => d.status === 'partial').length,
    paid: debts.filter((d) => d.status === 'paid').length,
  };

  const DebtFormFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Customer</label>
        <select
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AFN">AFN</option>
            <option value="PKR">PKR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount</label>
          <input
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white resize-none"
          rows={2}
          placeholder="Optional notes..."
        />
      </div>
    </>
  );

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Debts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track all customer debts and credits</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddDialogOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <Plus className="w-4 h-4" />
          Add Debt
        </button>
      </div>

      {/* Summary Strip */}
      {debts.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: summaryStats.total, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700' },
            { label: 'Unpaid', value: summaryStats.unpaid, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: 'Partial', value: summaryStats.partial, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Paid', value: summaryStats.paid, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
              <p className={`font-bold text-lg leading-tight ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Debts List */}
      <div className="space-y-3">
        {debts.map((debt) => {
          const config = statusConfig[debt.status];
          const StatusIcon = config.icon;
          const progress = paidPercent(debt);
          const isOverdue = debt.dueDate && debt.status !== 'paid' && new Date(debt.dueDate) < new Date();

          return (
            <div
              key={debt.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 border-l-4 ${config.borderColor} overflow-hidden transition-all hover:shadow-md`}
            >
              <div className="p-4 lg:p-5">
                {/* Top row: customer + status + actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-lg">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {getCustomerName(debt.customerId)}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          {debt.currency}
                        </span>
                        {isOverdue && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.classes}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                    {/* Action buttons */}
                    <button
                      onClick={() => openEdit(debt)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                      title="Edit debt"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(debt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete debt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount row */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {formatCurrency(debt.totalAmount, debt.currency)}
                    </p>
                    {debt.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                          Due {new Date(debt.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-0.5">Paid</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(debt.paidAmount, debt.currency)}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-600" />
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-0.5">Left</p>
                      <p className="font-semibold text-red-500 dark:text-red-400">
                        {formatCurrency(debt.remainingAmount, debt.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Payment progress</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-gradient-to-r from-amber-400 to-emerald-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.max(progress, progress > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>

                {/* Notes + WhatsApp */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {debt.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{debt.notes}</p>
                    )}
                  </div>
                  {debt.status !== 'paid' && (
                    <button
                      onClick={() => handleWhatsAppShare(debt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-lg transition-colors text-xs font-medium ml-2 flex-shrink-0 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {debts.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Receipt className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">No debts recorded yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Start tracking customer debts and payments</p>
          <button
            onClick={() => { resetForm(); setIsAddDialogOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Plus className="w-4 h-4" />
            Add your first debt
          </button>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="bg-red-50 dark:bg-red-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1.5">Delete Debt?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteDebt(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Add New Debt</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record a customer debt entry</p>
              </div>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <DebtFormFields />
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-white rounded-xl transition-all text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  Save Debt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingDebt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Edit Debt</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Update debt details</p>
              </div>
              <button
                onClick={() => { setEditingDebt(null); resetForm(); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <DebtFormFields />
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setEditingDebt(null); resetForm(); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-white rounded-xl transition-all text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
