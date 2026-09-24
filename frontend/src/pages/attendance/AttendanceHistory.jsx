import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { attendanceService } from '../../services/attendanceService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function AttendanceHistory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [date, setDate] = useState('2026-09-22');
  const [classFilter, setClassFilter] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAttendanceHistory({
        date,
        classId: classFilter,
        studentName: studentSearch,
      });
      setHistory(data);
    } catch {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [date, classFilter, studentSearch]);

  const activeClasses = mockStore.classes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/attendance')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Daily Register</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Attendance Historical Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit trail of pupil morning registers and absence remarks.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
        >
          <option value="All">All Classrooms</option>
          {activeClasses.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} - Section {c.section}
            </option>
          ))}
        </select>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by pupil name or ID..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No historical logs found for the selected date and filters.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-700">{item.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.studentName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{item.studentId}</td>
                    <td className="py-3 px-3 text-slate-700">{item.className}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{item.note || '—'}</td>
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
