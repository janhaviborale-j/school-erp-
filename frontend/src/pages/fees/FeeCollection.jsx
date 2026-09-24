import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  CreditCard,
  Receipt,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Banknote,
  QrCode,
  Building,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';
import { paymentService } from '../../services/paymentService';
import { feeService } from '../../services/feeService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function FeeCollection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Read studentId from query params if navigated from pending dues or dashboard
  const queryParams = new URLSearchParams(location.search);
  const preselectedStudentId = queryParams.get('studentId') || 'stu-1';

  const [activeTab, setActiveTab] = useState('collect'); // 'collect' | 'pending' | 'structures'
  const [selectedStudentId, setSelectedStudentId] = useState(preselectedStudentId);
  const [studentSnapshot, setStudentSnapshot] = useState(null);

  // Form Fields
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('UPI'); // 'Cash' | 'UPI' | 'Bank Transfer'
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('Term 1 Tuition Fee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Right column widgets state
  const [recentPayments, setRecentPayments] = useState([]);
  const [todayTotal, setTodayTotal] = useState(17500);

  // Receipt Modal
  const [createdReceipt, setCreatedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Auto-next receipt sequence
  const nextReceiptNo = `REC-${1050 + mockStore.payments.length}`;

  const loadStudentData = (studentId) => {
    const s = mockStore.students.find((stu) => stu.id === studentId);
    if (s) {
      setStudentSnapshot(s);
      const pending = s.totalFee - s.paidFee;
      // Default amount to min(5000, pending) or pending
      if (pending > 0) {
        setAmount(String(Math.min(10000, pending)));
      } else {
        setAmount('0');
      }
      setValidationError('');
    }
  };

  const loadRecentReceipts = () => {
    paymentService.getPayments().then((res) => {
      setRecentPayments(res.payments.slice(0, 4));
      const today = new Date().toISOString().split('T')[0];
      const todaySum = res.payments
        .filter((p) => p.date === today || p.dateTime?.includes('Today'))
        .reduce((sum, p) => sum + p.amount, 0);
      setTodayTotal(todaySum || 17500);
    });
  };

  useEffect(() => {
    loadStudentData(selectedStudentId);
    loadRecentReceipts();
  }, [selectedStudentId]);

  // Real-time overpayment checking
  const handleAmountChange = (val) => {
    setAmount(val);
    if (!studentSnapshot) return;
    const num = Number(val);
    const pending = studentSnapshot.totalFee - studentSnapshot.paidFee;

    if (num > pending) {
      setValidationError(
        `Maximum payable: ₹${pending.toLocaleString('en-IN')}. Overpayment is strictly rejected.`
      );
    } else if (num <= 0) {
      setValidationError('Payment amount must be greater than zero.');
    } else {
      setValidationError('');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!studentSnapshot) return;

    const numAmount = Number(amount);
    const pending = studentSnapshot.totalFee - studentSnapshot.paidFee;

    if (numAmount > pending) {
      setValidationError(`Amount exceeds pending dues (₹${pending.toLocaleString('en-IN')}).`);
      showToast('Payment rejected: Overpayment not allowed', 'error');
      return;
    }

    if (numAmount <= 0 || isNaN(numAmount)) {
      setValidationError('Please enter a valid payment amount.');
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await paymentService.createPayment({
        studentId: studentSnapshot.id,
        amount: numAmount,
        date: paymentDate,
        mode: paymentMode,
        refNo: referenceNo || (paymentMode === 'Cash' ? 'CSH-COUNTER-01' : `REF-${Date.now().toString().slice(-6)}`),
        notes,
        receiptNo: nextReceiptNo,
      });

      showToast(`Payment receipt ${result.payment.receiptNo} generated successfully!`);
      setCreatedReceipt({
        ...result.payment,
        remainingBalance: result.remainingBalance,
      });
      setIsReceiptOpen(true);

      // Refresh student snapshot
      loadStudentData(studentSnapshot.id);
      loadRecentReceipts();
    } catch (err) {
      showToast(err.message || 'Payment recording failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingBalance = studentSnapshot ? studentSnapshot.totalFee - studentSnapshot.paidFee : 0;
  const clearancePct = studentSnapshot ? Math.round((studentSnapshot.paidFee / studentSnapshot.totalFee) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header matching Stitch Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Fee Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cashier counters, student accounts, and transaction receipt generation.
          </p>
        </div>

        {/* Top Right Target Card */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-2xs">
            <span className="text-[11px] text-slate-400 font-medium block">
              FY26 Collection Target
            </span>
            <span className="text-sm font-bold text-slate-900 font-display tabular-nums">
              ₹14.85L (84% Collected)
            </span>
          </div>

          <button
            onClick={() => navigate('/payments')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Day Sheet Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching Stitch Screenshot 1 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('collect')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'collect'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Collect Fee
        </button>
        <button
          onClick={() => navigate('/fees/pending')}
          className="px-4 py-2.5 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-900 transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Pending Fees</span>
          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-md font-semibold">
            14
          </span>
        </button>
        <button
          onClick={() => navigate('/fees/structure')}
          className="px-4 py-2.5 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-900 transition-all whitespace-nowrap"
        >
          Fee Structures (8 Classes)
        </button>
        <button
          onClick={() => navigate('/payments')}
          className="px-4 py-2.5 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-900 transition-all whitespace-nowrap"
        >
          Payment Receipts Ledger
        </button>
      </div>

      {/* Main 2-Column Fee Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Fee Collection Terminal & Student Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Student Selector Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Enrolled Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {mockStore.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId} • {s.classSection}) — Pending: ₹{(s.totalFee - s.paidFee).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Student Snapshot Card matching Stitch Screenshot 1 */}
            {studentSnapshot && (
              <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-indigo-100/60 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${studentSnapshot.avatarBg || 'bg-indigo-50 text-indigo-700'}`}>
                      {studentSnapshot.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {studentSnapshot.fullName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Roll: {studentSnapshot.rollNo} • Guardian: {studentSnapshot.parentName} ({studentSnapshot.phone})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                    {studentSnapshot.classSection}
                  </span>
                </div>

                {/* Financial 3-Metric Summary Bar */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Class Annual Fee</span>
                    <span className="font-bold text-slate-800 text-sm font-display tabular-nums">
                      ₹{studentSnapshot.totalFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Paid</span>
                    <span className="font-bold text-emerald-700 text-sm font-display tabular-nums">
                      ₹{studentSnapshot.paidFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pending Arrears</span>
                    <span className="font-bold text-amber-700 text-sm font-display tabular-nums">
                      ₹{pendingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Course Clearance Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Course Fee Clearance</span>
                    <span className="font-semibold text-slate-700">{clearancePct}% Cleared</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${clearancePct}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fee Collection Form */}
            <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount to Collect (₹) <span className="text-red-500">*</span>
                  </label>
                  {pendingBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAmountChange(String(pendingBalance))}
                      className="text-[11px] text-indigo-600 font-semibold hover:underline"
                    >
                      Clear Full Balance (₹{pendingBalance.toLocaleString('en-IN')})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount to collect..."
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 font-display tabular-nums focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                {/* Validation Callout */}
                {validationError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Payment Mode Segmented Control */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method / Tender Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Cash', label: 'Cash Desk', icon: Banknote },
                    { id: 'UPI', label: 'UPI / GPay / QR', icon: QrCode },
                    { id: 'Bank Transfer', label: 'Bank / NEFT', icon: Building },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = paymentMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPaymentMode(mode.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs ring-1 ring-indigo-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Receipt Number (Sequential)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nextReceiptNo}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Transaction / UTR Reference
                </label>
                <input
                  type="text"
                  placeholder={paymentMode === 'Cash' ? 'CSH-COUNTER-01' : 'UPI Reference ID / Cheque No'}
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payment Purpose / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Term 1 Tuition fee installment"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !!validationError || pendingBalance <= 0}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Record Payment & Print Receipt</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Today's Inflow, Recent Receipts, & Arrears Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Collections Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Today's Collections
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-0.5">
                  ₹{todayTotal.toLocaleString('en-IN')}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">
                3 Transactions
              </span>
            </div>

            {/* Split breakdown */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>UPI / Digital (63%)</span>
                <span>Cash Counter (37%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div className="bg-indigo-600 h-full" style={{ width: '63%' }} />
                <div className="bg-emerald-500 h-full" style={{ width: '37%' }} />
              </div>
            </div>
          </div>

          {/* Recent Receipts Feed */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>Recent Receipts Feed</span>
              </h4>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View Ledger
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setCreatedReceipt(p);
                    setIsReceiptOpen(true);
                  }}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer p-1.5 rounded-lg transition-colors"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-700 block">
                      {p.receiptNo}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {p.studentName} ({p.classSection})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 tabular-nums block">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.mode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Arrears Alert Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 font-display">
                  Pending Arrears Alert
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  14 students across 4 divisions have overdue term balances totaling
                  ₹72,500.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/fees/pending')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              Open Pending Fees Register
            </button>
          </div>

          {/* Cashier Desk Credentials */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xs text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span>Counter Session</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Terminal
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cashier:</span>
              <span className="font-semibold text-white">Mrs. Sunita Sharma</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Terminal:</span>
              <span className="font-mono text-slate-300">Front Office Desk 01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={createdReceipt}
      />
    </div>
  );
}
