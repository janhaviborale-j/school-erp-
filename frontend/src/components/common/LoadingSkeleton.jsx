import React from 'react';

export default function LoadingSkeleton({ rows = 5, type = 'table' }) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-4">
            <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
            <div className="h-7 w-28 bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-36 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
      <div className="h-8 bg-slate-100 rounded-lg w-1/4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-2 bg-slate-100 rounded w-1/5"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-20"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
