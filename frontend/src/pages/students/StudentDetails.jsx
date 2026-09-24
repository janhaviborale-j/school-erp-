import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  CalendarCheck,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import StatusBadge from '../../components/common/StatusBadge';
import ReceiptModal from '../../components/common/ReceiptModal';
import { useToast } from '../../context/ToastContext';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    studentService.getStudentById(id)
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.message || 'Student not found', 'error');
        navigate('/students');
      });
  }, [id]);

  if (loading || !student) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Loading pupil profile...
      </div>
    );
  }

  const pendingBalance = student.totalFee - student.paidFee;
  const clearancePct = Math.round((student.paidFee / student.totalFee) * 100);

  const handleOpenReceipt = (payment) => {
    setSelectedReceipt({
      ...payment,
      studentName: student.fullName,
      classSection: student.classSection,
    });
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/fees?studentId=${student.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Collect Fee</span>
          </button>
          <button
            onClick={() => navigate(`/students/edit/${student.id}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${student.avatarBg || 'bg-indigo-50 text-indigo-700'} shadow-inner`}>
              {student.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 font-display">
                  {student.fullName}
                </h1>
                <StatusBadge status={student.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="font-mono font-medium">{student.studentId}</span>
                <span>•</span>
                <span>Roll No: {student.rollNo}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{student.classSection}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Admission Date</span>
            <span className="text-xs font-bold text-slate-800">{student.admissionDate}</span>
          </div>
        </div>

        {/* 3 Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Card 1: Academic & Biometrics */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Academic & Bio
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Section:</span>
                <span className="font-semibold text-slate-800">{student.classSection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-800">{student.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gender:</span>
                <span className="font-semibold text-slate-800">{student.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{student.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Year:</span>
                <span className="font-semibold text-slate-800">2026–27</span>
              </div>
            </div>
          </div>

          {/* Card 2: Guardian Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Primary Guardian
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-800">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Relation:</span>
                <span className="font-semibold text-slate-800">{student.parentRelation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telephone:</span>
                <a href={`tel:${student.phone}`} className="font-semibold text-indigo-600 hover:underline">
                  {student.phone}
                </a>
              </div>
              <div className="pt-1 border-t border-slate-200/60 text-slate-500 text-[11px] leading-relaxed">
                {student.address || 'Address registered on file'}
              </div>
            </div>
          </div>

          {/* Card 3: Fee Clearance Summary */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fee Status
              </h3>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Outstanding:</span>
                <span className={`text-base font-extrabold font-display tabular-nums ${pendingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  ₹{pendingBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${clearancePct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Paid: ₹{student.paidFee.toLocaleString('en-IN')}</span>
                <span>Total: ₹{student.totalFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/fees?studentId=${student.id}`)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Record Fee Installment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipts and Payment Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Receipts & Payment History
              </h3>
              <p className="text-xs text-slate-500">
                Official vouchers logged for {student.fullName}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {student.payments?.length || 0} Records
          </span>
        </div>

        {(!student.payments || student.payments.length === 0) ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No fee payments recorded yet for this student.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-2.5 pr-3">Receipt Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Reference / UTR</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  <th className="py-2.5 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.payments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleOpenReceipt(p)}
                  >
                    <td className="py-3 pr-3 font-mono font-bold text-indigo-600">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.date || p.dateTime}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.mode} />
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {p.refNo || '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReceipt(p);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
