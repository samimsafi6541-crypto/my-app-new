import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { Customer, Debt, Payment, Currency } from '../types';
import { formatCurrency } from './currency';

export function exportCustomerStatementPDF(
  customer: Customer,
  debts: Debt[],
  payments: Payment[]
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Customer Statement', 14, 20);

  // Customer Info
  doc.setFontSize(12);
  doc.text(`Customer: ${customer.name}`, 14, 35);
  doc.text(`Phone: ${customer.phone}`, 14, 42);
  if (customer.address) {
    doc.text(`Address: ${customer.address}`, 14, 49);
  }
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 56);

  // Debts Table
  const debtData = debts.map((debt) => [
    new Date(debt.createdAt).toLocaleDateString(),
    formatCurrency(debt.totalAmount, debt.currency),
    formatCurrency(debt.paidAmount, debt.currency),
    formatCurrency(debt.remainingAmount, debt.currency),
    debt.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['Date', 'Total', 'Paid', 'Remaining', 'Status']],
    body: debtData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Payments Table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Payment History', 14, finalY);

  const paymentData = payments.map((payment) => [
    new Date(payment.createdAt).toLocaleDateString(),
    formatCurrency(payment.amount, payment.currency),
    payment.paymentMethod,
    payment.notes || '-',
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['Date', 'Amount', 'Method', 'Notes']],
    body: paymentData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
  });

  // Summary
  const totalDebt = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalRemaining = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

  const summaryY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text(`Total Debt: ${totalDebt}`, 14, summaryY);
  doc.text(`Total Paid: ${totalPaid}`, 14, summaryY + 7);
  doc.text(`Total Remaining: ${totalRemaining}`, 14, summaryY + 14);

  doc.save(`${customer.name.replace(/\s+/g, '_')}_statement.pdf`);
}

export function exportReportPDF(
  title: string,
  debts: Debt[],
  payments: Payment[],
  customers: Customer[],
  currency?: Currency
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text(title, 14, 20);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
  if (currency) {
    doc.text(`Currency: ${currency}`, 14, 37);
  }

  // Summary Stats
  const filteredDebts = currency ? debts.filter(d => d.currency === currency) : debts;
  const filteredPayments = currency ? payments.filter(p => p.currency === currency) : payments;

  const totalOutstanding = filteredDebts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalCollected = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  doc.setFontSize(14);
  doc.text('Summary', 14, 50);
  doc.setFontSize(12);
  doc.text(`Total Outstanding: ${totalOutstanding}`, 14, 60);
  doc.text(`Total Collected: ${totalCollected}`, 14, 67);

  // Recent Transactions Table
  const transactionData = filteredPayments.slice(-20).reverse().map((payment) => {
    const customer = customers.find((c) => c.id === payment.customerId);
    return [
      customer?.name || 'Unknown',
      new Date(payment.createdAt).toLocaleDateString(),
      formatCurrency(payment.amount, payment.currency),
      payment.paymentMethod,
    ];
  });

  autoTable(doc, {
    startY: 75,
    head: [['Customer', 'Date', 'Amount', 'Method']],
    body: transactionData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

export function exportReportExcel(
  title: string,
  debts: Debt[],
  payments: Payment[],
  customers: Customer[],
  currency?: Currency
) {
  const filteredDebts = currency ? debts.filter(d => d.currency === currency) : debts;
  const filteredPayments = currency ? payments.filter(p => p.currency === currency) : payments;

  // Debts Sheet
  const debtsData = filteredDebts.map((debt) => {
    const customer = customers.find((c) => c.id === debt.customerId);
    return {
      Customer: customer?.name || 'Unknown',
      'Total Amount': debt.totalAmount,
      'Paid Amount': debt.paidAmount,
      'Remaining Amount': debt.remainingAmount,
      Currency: debt.currency,
      'Due Date': debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : '-',
      Status: debt.status,
      Notes: debt.notes || '-',
      'Created Date': new Date(debt.createdAt).toLocaleDateString(),
    };
  });

  // Payments Sheet
  const paymentsData = filteredPayments.map((payment) => {
    const customer = customers.find((c) => c.id === payment.customerId);
    return {
      Customer: customer?.name || 'Unknown',
      Amount: payment.amount,
      Currency: payment.currency,
      Method: payment.paymentMethod,
      Notes: payment.notes || '-',
      Date: new Date(payment.createdAt).toLocaleDateString(),
    };
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  const debtsWs = XLSX.utils.json_to_sheet(debtsData);
  const paymentsWs = XLSX.utils.json_to_sheet(paymentsData);

  XLSX.utils.book_append_sheet(wb, debtsWs, 'Debts');
  XLSX.utils.book_append_sheet(wb, paymentsWs, 'Payments');

  // Save file
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
}

export function generateWhatsAppMessage(
  customer: Customer,
  debt?: Debt,
  payment?: Payment
): string {
  if (debt) {
    const message = `Hello ${customer.name},\n\n` +
      `This is a reminder about your debt:\n` +
      `Total Amount: ${formatCurrency(debt.totalAmount, debt.currency)}\n` +
      `Paid: ${formatCurrency(debt.paidAmount, debt.currency)}\n` +
      `Remaining: ${formatCurrency(debt.remainingAmount, debt.currency)}\n` +
      `${debt.dueDate ? `Due Date: ${new Date(debt.dueDate).toLocaleDateString()}\n` : ''}` +
      `Status: ${debt.status.toUpperCase()}\n\n` +
      `Please make payment at your earliest convenience.\n\n` +
      `Thank you!\nDigiDebt`;
    return message;
  }

  if (payment) {
    const message = `Hello ${customer.name},\n\n` +
      `Payment Received!\n` +
      `Amount: ${formatCurrency(payment.amount, payment.currency)}\n` +
      `Method: ${payment.paymentMethod}\n` +
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}\n\n` +
      `Thank you for your payment!\nDigiDebt`;
    return message;
  }

  return '';
}

export function shareViaWhatsApp(phone: string, message: string) {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
