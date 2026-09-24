import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  BookOpen,
  Phone,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Calendar,
  AlertCircle,
  IndianRupee,
  ChevronRight,
} from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';

export default function Students() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('name-asc');

  // Drawer state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Deactivate modal state
  const [studentToDeactivate, setStudentToDeactivate] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudents({
        search,
        class: selectedClass,
        status: selectedStatus,
        sortBy,
      });
      setStudents(res.students);
    } catch {
      showToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, selectedClass, selectedStatus, sortBy]);

  const handleOpenDrawer = (student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!studentToDeactivate) return;
    try {
      const updated = await studentService.deactivateStudent(studentToDeactivate.id);
      showToast(
        `Student ${updated.fullName} marked as ${updated.status}.`,
        updated.status === 'Active' ? 'success' : 'info'
      );
      setIsConfirmOpen(false);
      setStudentToDeactivate(null);
      fetchStudents();
      if (selectedStudent?.id === updated.id) {
        setSelectedStudent(updated);
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const exportCSV = () => {
    const headers = ['Student ID', 'Roll No', 'Full Name', 'Class', 'Guardian', 'Phone', 'Total Fee', 'Paid Fee', 'Status'];
    const rows = students.map((s) => [
      s.studentId,
      s.rollNo,
      `"${s.fullName}"`,
      `"${s.classSection}"`,
      `"${s.parentName}"`,
      `"${s.phone}"`,
      s.totalFee,
      s.paidFee,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Directory_StJude_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student roster CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Student Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enrolled pupil roster, academic classifications, and verified guardian links.
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
            onClick={() => navigate('/students/add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching Stitch Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Active"
          value={students.filter((s) => s.status === 'Active').length}
          subtitle="96% Active Enrolled"
          icon={Users}
          color="indigo"
        />
        <KpiCard
          title="New Admissions"
          value="34"
          subtitle="Session 2026–27 intake"
          icon={UserPlus}
          color="emerald"
        />
        <KpiCard
          title="Total Sections"
          value="8"
          subtitle="Active Early & Primary Classrooms"
          icon={BookOpen}
          color="indigo"
        />
        <KpiCard
          title="Guardian Link Rate"
          value="100%"
          subtitle="All primary contacts verified"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll, ID or guardian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="All Classes">All Classes</option>
            <option value="Nursery">Nursery</option>
            <option value="Junior KG">Junior KG</option>
            <option value="Senior KG">Senior KG</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="id">Sort: Student ID</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Class & Div</th>
                <th className="py-3 px-3">Linked Guardian</th>
                <th className="py-3 px-3">Emergency Contact</th>
                <th className="py-3 px-3">Admission Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      title="No students match criteria"
                      description="Try searching with a different keyword or add a new pupil to the school registry."
                      actionLabel="Register First Student"
                      onAction={() => navigate('/students/add')}
                    />
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDrawer(student)}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${student.avatarBg || 'bg-indigo-50 text-indigo-700'}`}>
                        {student.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {student.fullName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Roll: {student.rollNo} • Blood: {student.bloodGroup}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700">
                        {student.classSection}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-medium">{student.parentName}</div>
                      <div className="text-[10px] text-slate-400">
                        {student.parentRelation}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <a
                        href={`tel:${student.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.phone}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {student.admissionDate}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleOpenDrawer(student)}
                          title="Quick View Drawer"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/students/edit/${student.id}`)}
                          title="Edit Student"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDeactivate(student);
                            setIsConfirmOpen(true);
                          }}
                          title={student.status === 'Active' ? 'Deactivate Student' : 'Activate Student'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            student.status === 'Active'
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer / status bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 px-4">
          <span>
            Showing <strong className="text-slate-800">{students.length}</strong> enrolled students
          </span>
          <div className="flex items-center gap-3">
            <span>St. Jude Academy Directory</span>
          </div>
        </div>
      </div>

      {/* Slide-over Profile Drawer matching Stitch Screenshot 2 */}
      {isDrawerOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${selectedStudent.avatarBg || 'bg-indigo-50 text-indigo-700'}`}>
                    {selectedStudent.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {selectedStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {selectedStudent.studentId} • {selectedStudent.classSection}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Status & Fee Clearance Banner */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      Enrollment Status
                    </span>
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">
                      Fee Balance
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-display">
                      ₹{(selectedStudent.totalFee - selectedStudent.paidFee).toLocaleString('en-IN')} Due
                    </span>
                  </div>
                </div>

                {/* Academic Snapshot */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Academic Identity
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Class & Div</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.classSection}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Roll Number</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.rollNo}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.dateOfBirth}</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Blood Group</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                {/* Guardian & Contact */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Guardian & Contact
                  </h4>
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Guardian:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.parentName} ({selectedStudent.parentRelation})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Telephone:</span>
                      <a href={`tel:${selectedStudent.phone}`} className="font-semibold text-indigo-600 hover:underline">
                        {selectedStudent.phone}
                      </a>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
                      {selectedStudent.address || 'Address on record'}
                    </div>
                  </div>
                </div>

                {/* Attendance Ribbon */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Recent Attendance (Last 5 Days)
                  </h4>
                  <div className="flex items-center gap-2">
                    {(selectedStudent.recentAttendance || ['P', 'P', 'P', 'P', 'P']).map((val, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-lg ${
                          val === 'P'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                <button
                  onClick={() => navigate(`/fees?studentId=${selectedStudent.id}`)}
                  className="flex-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Collect Fee</span>
                </button>
                <button
                  onClick={() => navigate(`/students/${selectedStudent.id}`)}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Full Record</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title={studentToDeactivate?.status === 'Active' ? 'Deactivate Student' : 'Activate Student'}
        message={`Are you sure you want to mark ${studentToDeactivate?.fullName} as ${
          studentToDeactivate?.status === 'Active' ? 'Inactive' : 'Active'
        }?`}
        confirmText={studentToDeactivate?.status === 'Active' ? 'Deactivate' : 'Activate'}
        isDestructive={studentToDeactivate?.status === 'Active'}
      />
    </div>
  );
}
