import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  trendLabel?: string;
  isPositive?: boolean;
}

export function KPICard({ title, value, icon, trend, trendLabel, isPositive = true }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-outline-variant)] p-6 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[var(--color-outline)] font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-[var(--color-primary)]">{value}</h3>
        </div>
        <div className="bg-[var(--color-primary)]/10 p-3 rounded-lg text-[var(--color-primary)]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      {(trend || trendLabel) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="material-symbols-outlined text-sm mr-1">
                {isPositive ? 'trending_up' : 'trending_down'}
              </span>
              {trend}
            </span>
          )}
          {trendLabel && <span className="text-[var(--color-outline)] ml-2">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
