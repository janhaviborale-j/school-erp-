import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Users,
  Check,
  RotateCcw,
  Save,
  Clock,
  History,
  AlertCircle,
} from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import { attendanceService } from '../../services/attendanceService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function Attendance() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedClassId, setSelectedClassId] = useState('cls-2');
  const [attendanceData, setAttendanceData] = useState(null);
  const [roster, setRoster] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeClasses = mockStore.classes.filter((c) => c.status === 'Active');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAttendance({
        date: selectedDate,
        classId: selectedClassId,
      });
      setAttendanceData(data);
      setRoster(data.roster);
      setHasChanges(false);
    } catch {
      showToast('Failed to load attendance roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedClassId]);

  const handleStatusChange = (studentId, status) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
    setHasChanges(true);
  };

  const handleNoteChange = (studentId, note) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, note } : r))
    );
    setHasChanges(true);
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((r) => ({ ...r, status: 'present' })));
    setHasChanges(true);
    showToast('All students marked Present for today');
  };

  const handleClearAll = () => {
    setRoster((prev) => prev.map((r) => ({ ...r, status: 'absent', note: '' })));
    setHasChanges(true);
    showToast('All cleared to Absent', 'warning');
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      await attendanceService.markAttendance({
        date: selectedDate,
        classId: selectedClassId,
        records: roster.map((r) => ({
          studentId: r.studentId,
          rollNo: r.rollNo,
          status: r.status,
          note: r.note,
        })),
      });
      showToast(`Daily register for ${attendanceData?.className} saved successfully!`);
      setHasChanges(false);
    } catch (err) {
      showToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Date increment/decrement helpers
  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const totalRoster = roster.length;
  const presentPct = totalRoster ? ((presentCount / totalRoster) * 100).toFixed(1) : 0;
  const absentPct = totalRoster ? ((absentCount / totalRoster) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Classroom Operations</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Morning Register</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Daily Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log morning roll call with single-click batch marking and historical attendance logs.
          </p>
        </div>

        <button
          onClick={() => navigate('/attendance/history')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <History className="w-3.5 h-3.5" />
          <span>Attendance History Logs</span>
        </button>
      </div>

      {/* Date & Classroom Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Class Selection & Quick Batch Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Classroom:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
            >
              {activeClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - Section {cls.section} ({cls.enrolled || 24} Enrolled)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>All Present</span>
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards matching Stitch Screenshot 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total in Class"
          value={totalRoster}
          subtitle="Enrolled Capacity: 25"
          icon={Users}
          color="indigo"
        />
        <KpiCard
          title="Present Today"
          value={`${presentCount} (${presentPct}%)`}
          subtitle="Morning roll call logged"
          icon={CheckCircle2}
          color="emerald"
        />
        <KpiCard
          title="Absent Today"
          value={`${absentCount} (${absentPct}%)`}
          subtitle="Absence alerts pending"
          icon={XCircle}
          color="rose"
        />
        <KpiCard
          title="Register Status"
          value={hasChanges ? 'Unsaved' : 'Synchronized'}
          subtitle={selectedDate === '2026-09-22' ? 'Live Session Active' : 'Historical Record'}
          icon={Clock}
          color={hasChanges ? 'amber' : 'emerald'}
        />
      </div>

      {/* Roster Roll Call Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 font-display">
              {attendanceData?.className} - Section {attendanceData?.section} Roll Call
            </span>
            <span className="text-xs text-slate-400">({totalRoster} Students)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Click status button to toggle Present / Absent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16">Roll</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Last 5 Days</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Operational Remarks / Leave Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((record) => {
                const isPresent = record.status === 'present';
                return (
                  <tr
                    key={record.studentId}
                    className={`transition-colors ${
                      isPresent ? 'hover:bg-slate-50/60' : 'bg-rose-50/20 hover:bg-rose-50/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {record.rollNo}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 text-xs">
                        {record.studentName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {record.parentName} ({record.parentRelation})
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                      {record.studentCode}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        {(record.last5Days || ['P', 'P', 'P', 'P', 'P']).map((val, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              val === 'P'
                                ? 'bg-emerald-100/70 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Interactive Dual Toggle Buttons */}
                      <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record.studentId, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isPresent
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record.studentId, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            !isPresent
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        placeholder={!isPresent ? 'e.g. Mild flu / travel' : 'Add operational remark...'}
                        value={record.note || ''}
                        onChange={(e) => handleNoteChange(record.studentId, e.target.value)}
                        className={`w-full max-w-xs px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          !isPresent
                            ? 'bg-white border-rose-200 text-slate-800 placeholder-rose-300 focus:border-rose-500'
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600'
                        } focus:outline-none`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Sticky Action Bar matching Stitch Screenshot 4 */}
      <div className="fixed bottom-6 left-0 right-0 z-40 max-w-2xl mx-auto px-4 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{presentCount} of {totalRoster} Marked Present</span>
                {hasChanges && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] rounded font-semibold">
                    Unsaved changes
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {absentCount} pupils flagged absent for {selectedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                type="button"
                onClick={fetchAttendance}
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : "Save Today's Attendance"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
