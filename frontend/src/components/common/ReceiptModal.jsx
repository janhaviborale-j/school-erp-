import React from 'react';
import Modal from './Modal';
import { Printer, CheckCircle2, Building2 } from 'lucide-react';
import { mockStore } from '../../data/store';

export default function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!receipt) return null;

  const school = mockStore.settings;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Fee Receipt" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Printable Card Area */}
        <div id="printable-receipt" className="border border-slate-300 rounded-2xl p-6 bg-white space-y-5 text-slate-800">
          {/* Header with School Branding */}
          <div className="border-b border-slate-200 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {school.schoolName}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  {school.schoolAddress}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Phone: {school.phoneNumber} • AY {school.academicSession}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-md uppercase tracking-wider">
                Fee Receipt
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {receipt.receiptNo}
              </p>
              <p className="text-xs text-slate-500">{receipt.date || receipt.dateTime}</p>
            </div>
          </div>

          {/* Student & Payment Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">
                {receipt.studentName || receipt.student?.fullName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class & Division:</span>
              <span className="font-semibold text-slate-800">
                {receipt.classSection || receipt.student?.classSection}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Mode:</span>
              <span className="font-semibold text-slate-800">
                {receipt.mode} {receipt.refNo ? `(${receipt.refNo})` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Purpose:</span>
              <span className="font-semibold text-slate-800">
                {receipt.notes || 'Academic & Tuition Fee'}
              </span>
            </div>
          </div>

          {/* Amount Paid Callout */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider block">
                Total Amount Received
              </span>
              <span className="text-xs text-indigo-700">
                Authorized transaction clearance
              </span>
            </div>
            <div className="text-2xl font-extrabold text-indigo-700 font-display tabular-nums">
              ₹{Number(receipt.amount).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Remaining Balance if available */}
          {receipt.remainingBalance !== undefined && (
            <div className="flex justify-between items-center text-xs px-2 text-slate-600">
              <span>Remaining Outstanding Balance:</span>
              <span className="font-bold text-slate-800 font-mono">
                ₹{Number(receipt.remainingBalance).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Cashier & Verification Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Computer-generated official receipt</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">Authorized Cashier</div>
              <div className="text-[10px] text-slate-400">Accounts Department</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
