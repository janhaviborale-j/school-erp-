import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  IndianRupee,
  Phone,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import { feeService } from '../../services/feeService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function PendingFees() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await feeService.getPendingFees({
        search,
        class: selectedClass,
      });
      setStudents(data.students);
      setTotalPending(data.totalPending);
    } catch {
      showToast('Failed to load pending fees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [search, selectedClass]);

  const exportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Class', 'Guardian', 'Phone', 'Total Fee', 'Paid Fee', 'Outstanding Due'];
    const rows = students.map((s) => [
      s.studentId,
      `"${s.fullName}"`,
      `"${s.classSection}"`,
      `"${s.parentName}"`,
      `"${s.phone}"`,
      s.totalFee,
      s.paidFee,
      s.pendingFee,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pending_Fees_Arrears_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Outstanding arrears report downloaded');
  };

  const activeClasses = mockStore.classes;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/fees')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fee Desk</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Pending Fee Arrears Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Identify outstanding term balances, guardian escalation notices, and recovery metrics.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Arrears CSV</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Outstanding Dues"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
          subtitle="Accrued Term 1 & 2 Arrears"
          icon={IndianRupee}
          color="amber"
        />
        <KpiCard
          title="Accounts Requiring Recovery"
          value={students.length}
          subtitle="Pupils with non-zero dues"
          icon={AlertCircle}
          color="rose"
        />
        <KpiCard
          title="Highest Individual Due"
          value="₹15,000"
          subtitle="Reyansh Deshmukh (Class 2 - A)"
          icon={IndianRupee}
          color="indigo"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="All">All Classrooms</option>
            {activeClasses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} - Section {c.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Guardian & Phone</th>
                <th className="py-3 px-3 text-right">Annual Fee</th>
                <th className="py-3 px-3 text-right">Fee Paid</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Clearance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    All accounts reconciled! No pending fees matching filter.
                  </td>
                </tr>
              ) : (
                students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {stu.avatarInitials}
                      </div>
                      <div>
                        <div>{stu.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {stu.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {stu.classSection}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{stu.parentName}</div>
                      <a
                        href={`tel:${stu.phone}`}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{stu.phone}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                      ₹{stu.totalFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                      ₹{stu.paidFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 font-extrabold text-sm tabular-nums">
                      ₹{stu.pendingFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>{stu.paidPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${stu.paidPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/fees?studentId=${stu.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Collect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
