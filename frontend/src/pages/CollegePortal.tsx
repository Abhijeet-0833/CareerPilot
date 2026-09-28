import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { GraduationCap, Users, Award, TrendingUp, Sparkles, FileSpreadsheet } from 'lucide-react';

export const CollegePortal: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            College & University Placement Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track student placement readiness, identify batch skill gaps, and manage drive results.
          </p>
        </div>

        <Button variant="gradient" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />}>
          Export Placement Report
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="480 Batch" subtitle="Class of 2026" glow="indigo" />
        <StatCard title="Placement Readiness" value="84% Ready" subtitle="Passed technical benchmarks" glow="emerald" />
        <StatCard title="Placed Students" value="312 Offers" subtitle="65% batch placement" glow="cyan" />
        <StatCard title="Avg Package" value="$125,000" subtitle="Software engineering roles" glow="purple" />
      </div>

      {/* Student Readiness Breakdown */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Batch Technical Readiness Breakdown
        </h3>
        <p className="text-xs text-slate-400">
          Top missing skills identified across 480 student profiles: **Docker Containerization (42%)**, **System Design Caching (35%)**, **Kafka Messaging (28%)**.
        </p>

        <div className="pt-2 flex justify-end">
          <Button variant="glass" size="sm">
            Schedule Batch Assessment Drive
          </Button>
        </div>
      </GlassCard>

    </div>
  );
};
