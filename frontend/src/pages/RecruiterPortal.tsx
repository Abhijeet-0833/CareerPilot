import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { Briefcase, Users, Search, Sparkles, Filter, Mail, CheckCircle2 } from 'lucide-react';

export const RecruiterPortal: React.FC = () => {
  const candidates = [
    { name: 'Alex Morgan', role: 'Java Full Stack Engineer', match: 92, skills: ['Java 17', 'Spring Boot 3', 'REST API', 'PostgreSQL', 'React'], exp: '3 Years', location: 'San Francisco, CA' },
    { name: 'David Chen', role: 'Senior Backend Developer', match: 88, skills: ['Java', 'Spring Boot', 'Kafka', 'Docker', 'AWS'], exp: '5 Years', location: 'Remote' },
    { name: 'Sarah Jenkins', role: 'Full Stack Engineer', match: 85, skills: ['Java', 'React', 'TypeScript', 'SQL', 'Git'], exp: '2 Years', location: 'Austin, TX' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            Recruiter Talent Sourcing Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Post job openings and search verified candidate profiles with AI skill match scoring.
          </p>
        </div>

        <Button variant="gradient" size="sm" icon={<Briefcase className="w-4 h-4" />}>
          Post New Job Opening
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Active Job Postings" value="4 Open" subtitle="Stripe Engineering" glow="indigo" />
        <StatCard title="Matched Candidates" value="48 Qualified" subtitle=">80% skill match score" glow="purple" />
        <StatCard title="Outreach Responses" value="68% Rate" subtitle="Candidate response rate" glow="emerald" />
      </div>

      {/* Candidate Sourcing List */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Top AI-Matched Candidate Profiles
          </h3>
          <span className="text-xs text-slate-400">Sorted by skill alignment</span>
        </div>

        <div className="space-y-4">
          {candidates.map((cand, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">{cand.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cand.match}% Match
                  </span>
                </div>
                <p className="text-xs text-indigo-400 font-medium">{cand.role} • {cand.exp} Experience • {cand.location}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cand.skills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="primary" size="sm" icon={<Mail className="w-4 h-4" />}>
                Contact Candidate
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};
