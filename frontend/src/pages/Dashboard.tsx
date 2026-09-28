import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { 
  Sparkles, FileText, Target, Map, Mic, ArrowUpRight, 
  CheckCircle2, AlertTriangle, TrendingUp, Briefcase, Award
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { resumeApi, roadmapApi, applicationApi } from '../services/api';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const skillData = [
    { skill: 'Java 17', score: 92 },
    { skill: 'Spring Boot', score: 88 },
    { skill: 'REST API', score: 85 },
    { skill: 'SQL', score: 90 },
    { skill: 'React', score: 80 },
    { skill: 'Docker', score: 65 },
  ];

  const applicationData = [
    { stage: 'Saved', count: 4, color: '#818cf8' },
    { stage: 'Applied', count: 6, color: '#38bdf8' },
    { stage: 'Interview', count: 2, color: '#f59e0b' },
    { stage: 'Offer', count: 1, color: '#10b981' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome Back, Alex!</h1>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target Role: <span className="text-indigo-400 font-semibold">Java Full Stack Engineer</span> • 3 Top Skill Gaps Detected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/resume-analyzer">
            <Button variant="gradient" size="sm" icon={<FileText className="w-4 h-4" />}>
              Analyze Resume
            </Button>
          </Link>
          <Link to="/mock-interview">
            <Button variant="glass" size="sm" icon={<Mic className="w-4 h-4 text-purple-400" />}>
              Start AI Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Staggered Metric Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Overall Career Score"
            value="88 / 100"
            subtitle="Top 5% candidate percentile"
            change={8}
            progress={88}
            glow="indigo"
            icon={<Sparkles className="w-6 h-6 text-indigo-400" />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Master ATS Resume Score"
            value="85 / 100"
            subtitle="9 skills & 7 keywords matched"
            change={5}
            progress={85}
            glow="purple"
            icon={<FileText className="w-6 h-6 text-purple-400" />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="AI Interview Readiness"
            value="82%"
            subtitle="No filler words detected"
            change={12}
            progress={82}
            glow="emerald"
            icon={<Mic className="w-6 h-6 text-emerald-400" />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Job Applications"
            value="13 Tracked"
            subtitle="1 Offer • 2 Interviews scheduled"
            change={15}
            glow="cyan"
            icon={<Briefcase className="w-6 h-6 text-cyan-400" />}
          />
        </motion.div>
      </motion.div>

      {/* Analytics & Skill Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Skill Breakdown */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Technical Skill Coverage
              </h3>
              <p className="text-xs text-slate-400">Target Role Requirements vs Your Master Resume</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Java Full Stack
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
                <Radar name="Candidate Skill" dataKey="score" stroke="#6366f1" fill="#818cf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Application Stage Breakdown */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Pipeline Stages
              </h3>
              <p className="text-xs text-slate-400">Application Pipeline Status</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData}>
                <XAxis dataKey="stage" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {applicationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Top 3 Actionable Priorities */}
      <GlassCard glow="indigo">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top 3 Actions to Increase Offer Probability
          </h3>
          <span className="text-xs text-emerald-400 font-semibold">+18% Offer Lift</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">1</span>
              Docker Containerization
            </div>
            <p className="text-xs text-slate-300">Complete Week 3 Docker task in your skill roadmap.</p>
            <Link to="/roadmap" className="inline-flex items-center text-[11px] font-semibold text-indigo-400 hover:text-indigo-300">
              Open Roadmap <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">2</span>
              System Design Mock Interview
            </div>
            <p className="text-xs text-slate-300">Take a 10-minute AI interview on Redis Caching patterns.</p>
            <Link to="/mock-interview" className="inline-flex items-center text-[11px] font-semibold text-purple-400 hover:text-purple-300">
              Start Interview <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">3</span>
              Stripe Job Tailored Resume
            </div>
            <p className="text-xs text-slate-300">Export job-specific resume optimized for Stripe Senior Java JD.</p>
            <Link to="/resume-analyzer" className="inline-flex items-center text-[11px] font-semibold text-emerald-400 hover:text-emerald-300">
              Export Resume <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

        </div>
      </GlassCard>

    </div>
  );
};
