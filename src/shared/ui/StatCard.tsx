import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

export function StatCard({ label, value, valueClassName = 'text-slate-900' }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-black ${valueClassName}`}>{value}</p>
    </div>
  );
}
