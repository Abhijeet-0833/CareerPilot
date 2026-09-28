import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon?: React.ReactNode;
  progress?: number;
  glow?: 'none' | 'indigo' | 'purple' | 'emerald' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon,
  progress,
  glow = 'none',
}) => {
  return (
    <GlassCard glow={glow} className="relative overflow-hidden group">
      {/* Background soft ambient radial light */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-1.5 text-slate-900 dark:text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {icon && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {typeof change === 'number' && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {change >= 0 ? (
            <span className="inline-flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +{change}%
            </span>
          ) : (
            <span className="inline-flex items-center text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              <TrendingDown className="w-3 h-3 mr-1" /> {change}%
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500">vs last month</span>
        </div>
      )}

      {typeof progress === 'number' && (
        <div className="mt-4">
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
};
