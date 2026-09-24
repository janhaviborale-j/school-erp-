import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  Download,
  Users,
  IndianRupee,
  CalendarCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { reportService } from '../../services/reportService';
import { mockStore } from '../../data/store';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('attendance'); // 'attendance' | 'fees' | 'enrollment'
  const [selectedClass, setSelectedClass] = useState('All');
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportService.getSummaryReport({
      type: reportType,
      classId: selectedClass,
      academicYear,
    }).then((data) => {
      setReportData(data);
      setLoading(false);
    });
  }, [reportType, selectedClass, academicYear]);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    if (!reportData) return;
    let csvRows = [];
    if (reportType === 'attendance') {
      csvRows = [
        ['Class Section', 'Enrolled Students', 'Average Attendance %', 'Present Today', 'Absent Today'],
        ...reportData.classAttendance.map((c) => [c.name, c.enrolled, `${c.avgAttendance}%`, c.present, c.absent]),
      ];
    } else if (reportType === 'fees') {
      csvRows = [
        ['Class Grade', 'Target Assessment', 'Collected to Date', 'Pending Arrears', 'Recovery %'],
        ...reportData.classFees.map((f) => [f.name, f.total, f.collected, f.pending, `${f.percent}%`]),
      ];
    } else {
      csvRows = [
        ['Class Section', 'Capacity', 'Enrolled Students', 'Occupancy %', 'Boys', 'Girls'],
        ...reportData.enrollment.map((e) => [e.name, e.capacity, e.enrolled, `${e.occupancy}%`, e.boys, e.girls]),
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SchoolERP_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Institutional Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Class-wise attendance trends, fee collection audits, and pupil capacity ratios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'attendance', label: 'Attendance Roll Reports', icon: CalendarCheck },
          { id: 'fees', label: 'Fee Collection & Arrears', icon: IndianRupee },
          { id: 'enrollment', label: 'Student Enrollment & Roster', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                isSelected
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reportType === 'attendance' && (
          <>
            <KpiCard
              title="Campus Attendance Average"
              value="93.8%"
              subtitle="Session to date"
              icon={CalendarCheck}
              color="emerald"
            />
            <KpiCard
              title="Best Performing Class"
              value="Sr. KG - A (96%)"
              subtitle="24 Present / 0 Absent"
              icon={TrendingUp}
              color="indigo"
            />
            <KpiCard
              title="Daily Roll Completion"
              value="100%"
              subtitle="8 of 8 registers filed"
              icon={Building2}
              color="emerald"
            />
          </>
        )}

        {reportType === 'fees' && (
          <>
            <KpiCard
              title="Total Fees Collected"
              value="₹3,84,500"
              subtitle="84% of Term 1 Target"
              icon={IndianRupee}
              color="indigo"
            />
            <KpiCard
              title="Pending Balance Total"
              value="₹72,500"
              subtitle="14 Accounts Outstanding"
              icon={IndianRupee}
              color="amber"
            />
            <KpiCard
              title="Collection Clearance Rate"
              value="84.1%"
              subtitle="Across all grades"
              icon={TrendingUp}
              color="emerald"
            />
          </>
        )}

        {reportType === 'enrollment' && (
          <>
            <KpiCard
              title="Total Enrolled Students"
              value={mockStore.students.length}
              subtitle="Active academic session"
              icon={Users}
              color="indigo"
            />
            <KpiCard
              title="Classroom Utilization"
              value="87.5%"
              subtitle="128 of 145 seats filled"
              icon={Building2}
              color="emerald"
            />
            <KpiCard
              title="Gender Ratio"
              value="52% M / 48% F"
              subtitle="Balanced pupil intake"
              icon={Users}
              color="indigo"
            />
          </>
        )}
      </div>

      {/* Main Report Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              {reportType === 'attendance' && 'Class-wise Attendance Audit'}
              {reportType === 'fees' && 'Division Fee Collection & Arrears Audit'}
              {reportType === 'enrollment' && 'Classroom Capacity & Enrollment Roster'}
            </h3>
            <p className="text-xs text-slate-500">
              Generated for St. Jude Early Learners Academy • Session {academicYear}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">
            Verified Record
          </span>
        </div>

        {/* Dynamic Table based on reportType */}
        <div className="overflow-x-auto">
          {reportType === 'attendance' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Class & Division</th>
                  <th className="py-3 px-3">Class Teacher</th>
                  <th className="py-3 px-3 text-center">Enrolled</th>
                  <th className="py-3 px-3 text-center">Present Today</th>
                  <th className="py-3 px-3 text-center">Absent Today</th>
                  <th className="py-3 px-4 text-right">Average Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData?.classAttendance?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-3 text-slate-600">{row.teacher}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-medium">{row.enrolled}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">{row.present}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-rose-700">{row.absent}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold">
                        {row.avgAttendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'fees' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Class Grade</th>
                  <th className="py-3 px-3 text-right">Target Assessment</th>
                  <th className="py-3 px-3 text-right">Total Collected</th>
                  <th className="py-3 px-3 text-right">Outstanding Arrears</th>
                  <th className="py-3 px-4 text-right">Recovery Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData?.classFees?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                      ₹{row.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700">
                      ₹{row.collected.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-700">
                      ₹{row.pending.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-semibold">
                        {row.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'enrollment' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Class Division</th>
                  <th className="py-3 px-3 text-center">Seat Capacity</th>
                  <th className="py-3 px-3 text-center">Current Enrolled</th>
                  <th className="py-3 px-3 text-center">Boy / Girl Split</th>
                  <th className="py-3 px-4 text-right">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData?.enrollment?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">{row.capacity}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">{row.enrolled}</td>
                    <td className="py-3.5 px-3 text-center text-slate-600">
                      {row.boys} Boys • {row.girls} Girls
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold tabular-nums">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold">
                        {row.occupancy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
