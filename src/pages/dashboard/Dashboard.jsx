import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  IndianRupee,
  AlertCircle,
  CalendarCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  Receipt,
  Clock,
  Sparkles,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';
import { mockStore } from '../../data/store';
import { paymentService } from '../../services/paymentService';
import { feeService } from '../../services/feeService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    // Load recent payments & pending arrears
    paymentService.getPayments().then((res) => {
      setPayments(res.payments.slice(0, 5));
    });

    feeService.getPendingFees().then((res) => {
      setPendingFees(res.students.slice(0, 4));
    });
  }, []);

  const totalStudents = mockStore.students.length;
  const activeClasses = mockStore.classes.filter((c) => c.status === 'Active').length;
  const totalCollected = mockStore.students.reduce((acc, s) => acc + s.paidFee, 0);
  const totalPending = mockStore.students.reduce((acc, s) => acc + (s.totalFee - s.paidFee), 0);

  const handleOpenReceipt = (payment) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Good Morning, Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening at {mockStore.settings.schoolName} today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/fees')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-2xs transition-colors"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 shadow-2xs transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => navigate('/students/add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Enrolled Students"
          value={totalStudents}
          subtitle="96% Active Enrolled"
          icon={Users}
          color="indigo"
          onClick={() => navigate('/students')}
        />
        <KpiCard
          title="Active Classes & Sections"
          value={activeClasses}
          subtitle="Early & Primary Divisions"
          icon={BookOpen}
          color="emerald"
          onClick={() => navigate('/classes')}
        />
        <KpiCard
          title="Total Fees Collected"
          value={`₹${totalCollected.toLocaleString('en-IN')}`}
          subtitle="84% of Term 1 Target"
          icon={IndianRupee}
          color="indigo"
          onClick={() => navigate('/payments')}
        />
        <KpiCard
          title="Outstanding Pending Fees"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
          subtitle="14 Accounts Pending"
          icon={AlertCircle}
          color="amber"
          onClick={() => navigate('/fees')}
        />
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Attendance & Recent Payments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Attendance Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Today's Attendance Overview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tuesday, 22 September 2026 • Morning Roll Call
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Open Register</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Attendance Progress & Stats */}
            <div className="grid grid-cols-3 gap-4 my-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Students</span>
                <span className="text-lg font-bold text-slate-800 font-display tabular-nums">
                  128
                </span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl">
                <span className="text-xs text-emerald-800 block">Present Today</span>
                <span className="text-lg font-bold text-emerald-700 font-display tabular-nums">
                  115 (90%)
                </span>
              </div>
              <div className="p-3 bg-rose-50/60 rounded-xl">
                <span className="text-xs text-rose-800 block">Absent Today</span>
                <span className="text-lg font-bold text-rose-700 font-display tabular-nums">
                  13 (10%)
                </span>
              </div>
            </div>

            {/* Segmented bar */}
            <div className="w-full bg-rose-200 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: '90%' }}
              />
            </div>

            {/* Quick division indicators */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="text-slate-400">Section Breakdown:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">Nursery A (91%)</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">Jr. KG A (94%)</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">Sr. KG A (96%)</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">Class 1 A (88%)</span>
              </div>
            </div>
          </div>

          {/* Recent Fee Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Recent Fee Payments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest counter receipts and online transfers
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All Payments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 pr-3">Student</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenReceipt(p)}
                    >
                      <td className="py-3 pr-3 font-semibold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {p.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div>{p.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {p.dateTime}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {p.classSection}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                        {p.receiptNo}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={p.mode} />
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <span className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5">
                          Receipt
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pending Arrears Escalations & Campus Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pending Fee Escalations Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Pending Fee Escalations
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Highest overdue balances
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/fees')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                All
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {pendingFees.map((stu) => (
                <div key={stu.id} className="py-3 first:pt-2 last:pb-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {stu.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {stu.classSection} • {stu.parentName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-700 font-display tabular-nums block">
                        ₹{stu.pendingFee.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {stu.paidPercent}% cleared
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${stu.paidPercent}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Tel: {stu.phone}
                    </span>
                    <button
                      onClick={() => navigate(`/fees?studentId=${stu.id}`)}
                      className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                    >
                      Collect Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate('/fees')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View All 14 Pending Accounts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Institutional Notices & Operational Guidelines */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Administrative Notice</span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Term 1 Accounts Audit Deadline
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                All outstanding admission installments for Nursery and Junior KG
                must be reconciled by 30 September 2026.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Principal's Desk</span>
                <span className="text-indigo-400 font-medium">Circular #2026-04</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal for one-click view */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}
