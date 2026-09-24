import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, trend, color = 'indigo', onClick }) {
  const colorStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-700',
      border: 'border-slate-200/80',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700',
      border: 'border-slate-200/80',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700',
      border: 'border-slate-200/80',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-700',
      border: 'border-slate-200/80',
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${style.border} shadow-2xs transition-all hover:shadow-xs ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight font-display tabular-nums">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
        </div>
      )}
    </div>
  );
}
