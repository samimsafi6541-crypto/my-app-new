import { useState } from 'react';
import { Plus, Calendar, User, CreditCard, MessageCircle, Wallet, Trash2, X, Banknote, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/currency';
import { generateWhatsAppMessage, shareViaWhatsApp } from '../utils/export';
import type { Payment } from '../types';

const methodIcon = (method: string) => {
  if (method === 'Cash') return <Banknote className="w-3.5 h-3.5" />;
  if (method === 'Mobile Money') return <Smartphone className="w-3.5 h-3.5" />;
  return <CreditCard className="w-3.5 h-3.5" />;
};

export function PaymentsScreen() {
  const { payments, debts, customers, addPayment, updateDebt, deletePayment } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    debtId: '',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
  });

  const resetForm = () => setFormData({ debtId: '', amount: '', paymentMethod: 'Cash', notes: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const debt = debts.find((d) => d.id === formData.debtId);
    if (!debt) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      debtId: formData.debtId,
      customerId: debt.customerId,
      amount,
      currency: debt.currency,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      createdAt: Date.now(),
    };
    addPayment(newPayment);

    const newPaidAmount = debt.paidAmount + amount;
    const newRemainingAmount = debt.totalAmount - newPaidAmount;
    const newStatus = newRemainingAmount <= 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : 'unpaid';
    updateDebt(debt.id, {
      paidAmount: newPaidAmount,
      remainingAmount: newRemainingAmount,
      status: newStatus,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDelete = (payment: Payment) => {
    // Reverse the debt update
    const debt = debts.find((d) => d.id === payment.debtId);
    if (debt) {
      const newPaidAmount = Math.max(0, debt.paidAmount - payment.amount);
      const newRemainingAmount = debt.totalAmount - newPaidAmount;
      const newStatus = newRemainingAmount <= 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : 'unpaid';
      updateDebt(debt.id, { paidAmount: newPaidAmount, remainingAmount: newRemainingAmount, status: newStatus });
    }
    deletePayment(payment.id);
    setDeleteConfirmId(null);
  };

  const getCustomerName = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name || 'Unknown';

  const unpaidDebts = debts.filter((d) => d.status !== 'paid');

  const handleWhatsAppReceipt = (payment: Payment) => {
    const customer = customers.find((c) => c.id === payment.customerId);
    if (customer) {
      const message = generateWhatsAppMessage(customer, undefined, payment);
      shareViaWhatsApp(customer.phone, message);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Payments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Record and track all payments</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddDialogOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      {/* Summary strip */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-800/50 p-2.5 rounded-xl">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Payments</p>
              <p className="font-bold text-lg text-slate-900 dark:text-white">{payments.length}</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-800/50 p-2.5 rounded-xl">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
              <p className="font-bold text-lg text-slate-900 dark:text-white">{payments.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 border-l-4 border-l-emerald-500 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="p-4 lg:p-5">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-lg">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {getCustomerName(payment.customerId)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {payment.currency}
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                        {methodIcon(payment.paymentMethod)}
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(payment.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete payment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Amount + date */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleWhatsAppReceipt(payment)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Receipt
                </button>
              </div>

              {payment.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{payment.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {payments.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Wallet className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">No payments recorded yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Record payments to track your cash flow</p>
          <button
            onClick={() => { resetForm(); setIsAddDialogOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Plus className="w-4 h-4" />
            Add your first payment
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
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1.5">Delete Payment?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              This will also reverse the payment from the linked debt.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const payment = payments.find((p) => p.id === deleteConfirmId);
                  if (payment) handleDelete(payment);
                }}
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
                <h2 className="font-semibold text-slate-900 dark:text-white">Add Payment</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record a payment against a debt</p>
              </div>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Debt</label>
                <select
                  value={formData.debtId}
                  onChange={(e) => setFormData({ ...formData, debtId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
                  required
                >
                  <option value="">Select Debt</option>
                  {unpaidDebts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {getCustomerName(d.customerId)} — {formatCurrency(d.remainingAmount, d.currency)} remaining ({d.currency})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white text-sm bg-white"
                >
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Mobile Money</option>
                </select>
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
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
