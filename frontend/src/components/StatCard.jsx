import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', badge }) => {
  const colorMap = {
    brand: {
      bg: 'bg-emerald-50 text-brand-700',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    blue: {
      bg: 'bg-sky-50 text-sky-700',
      border: 'border-sky-100',
      badge: 'bg-sky-100 text-sky-800',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-800',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-800',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700',
      border: 'border-purple-100',
      badge: 'bg-purple-100 text-purple-800',
    },
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs text-slate-500 line-clamp-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};
