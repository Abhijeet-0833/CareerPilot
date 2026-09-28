import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Shield, Cpu, Users, DollarSign, Activity } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-400" />
          System Admin & AI Usage Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor platform metrics, active subscriptions, and AI token cost consumption.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard title="Total Registered Users" value="1,420 Users" change={14} glow="indigo" />
        <StatCard title="Active Subscriptions" value="380 Pro/Prem" change={18} glow="purple" />
        <StatCard title="Monthly Revenue (MRR)" value="$14,850" change={22} glow="emerald" />
        <StatCard title="AI Token Consumption" value="4.2M Tokens" subtitle="Cost control active" glow="cyan" />
      </div>

      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          System Health & Microservices Telemetry
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400">Spring Boot Backend:</span>
            <p className="text-emerald-400 font-bold mt-1">UP (100% SLA)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400">H2 / PostgreSQL DB:</span>
            <p className="text-emerald-400 font-bold mt-1">HEALTHY</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400">AI Service Abstraction:</span>
            <p className="text-indigo-400 font-bold mt-1">Mock / OpenAI Provider</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400">API Gateway / Auth:</span>
            <p className="text-emerald-400 font-bold mt-1">JWT Active</p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
