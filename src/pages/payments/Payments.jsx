import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Receipt,
  Search,
  Filter,
  Download,
  IndianRupee,
  Printer,
  Calendar,
  Building2,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';

export default function Payments() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [payments, setPayments] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPayments({
        search,
        mode: modeFilter,
      });
      setPayments(res.payments);
      setTotalCollected(res.totalCollected);
    } catch {
      showToast('Failed to load payments ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, modeFilter]);

  const handleOpenReceipt = (p) => {
    setSelectedReceipt(p);
    setIsReceiptOpen(true);
  };

  const exportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Student Name', 'Class', 'Amount', 'Payment Mode', 'Reference No', 'Notes'];
    const rows = payments.map((p) => [
      p.receiptNo,
      p.date || p.dateTime,
      `"${p.studentName}"`,
      `"${p.classSection}"`,
      p.amount,
      p.mode,
      `"${p.refNo || ''}"`,
      `"${p.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payments_Receipts_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payment ledger exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Payment Receipts & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sequential receipt book, cashier vouchers, and transaction records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger CSV</span>
          </button>
          <button
            onClick={() => navigate('/fees')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>+ Collect Fee</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by receipt number, student name, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="All">All Payment Modes</option>
            <option value="UPI">UPI / Digital</option>
            <option value="Cash">Cash Counter</option>
            <option value="Bank Transfer">Bank / NEFT</option>
          </select>

          <div className="px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-800 tabular-nums">
            Total Logged: ₹{totalCollected.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Payment Mode</th>
                <th className="py-3 px-3 font-mono">Reference / UTR</th>
                <th className="py-3 px-3 text-right">Amount Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No payment records match criteria.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenReceipt(p)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 text-xs">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {p.dateTime || p.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {p.studentName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {p.classSection}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.mode} />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {p.refNo || '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReceipt(p);
                        }}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}
