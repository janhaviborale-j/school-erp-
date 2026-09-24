import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, type = 'status' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  // Active / Inactive
  if (normalized === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        Active
      </span>
    );
  }

  if (normalized === 'inactive') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Inactive
      </span>
    );
  }

  // Attendance: Present / Absent
  if (normalized === 'present') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Present
      </span>
    );
  }

  if (normalized === 'absent') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
        <XCircle className="w-3.5 h-3.5" />
        Absent
      </span>
    );
  }

  // Fee Status: Paid / Partial / Pending
  if (normalized === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
        <CheckCircle2 className="w-3 h-3" />
        Paid
      </span>
    );
  }

  if (normalized === 'pending' || normalized === 'unpaid') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
        <AlertCircle className="w-3 h-3" />
        Pending
      </span>
    );
  }

  // Payment Modes
  if (['upi', 'cash', 'bank transfer', 'bank'].includes(normalized)) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
      {status}
    </span>
  );
}
