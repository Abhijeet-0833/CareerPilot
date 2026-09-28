import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { 
  Target, Sparkles, CheckCircle2, AlertTriangle, Building2, 
  MapPin, DollarSign, Briefcase, TrendingUp, Zap, ArrowRight 
} from 'lucide-react';
import { jobApi } from '../services/api';
import { JDAnalysisResponse, JobMatchResponse } from '../types';

export const JDAnalyzer: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('Senior Java Backend Engineer');
  const [companyName, setCompanyName] = useState('Stripe');
  const [jdText, setJdText] = useState(
    `We are looking for a Senior Java Backend Engineer to join Stripe's payments infrastructure team.\n\nRESPONSIBILITIES:\n- Design and implement high-performance REST APIs using Java 17 and Spring Boot 3.\n- Optimize PostgreSQL queries and handle database indexes.\n- Build distributed microservices architectures.\n\nREQUIREMENTS:\n- 3+ years experience with Java, Spring Boot, REST APIs, SQL, PostgreSQL.\n- Preferred: Docker, AWS S3/EC2, Kafka event streaming, System Design.`
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [jdResult, setJdResult] = useState<JDAnalysisResponse | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResponse | null>(null);

  const handleAnalyzeAndMatch = async () => {
    setAnalyzing(true);
    const parsedJd = await jobApi.analyzeJd(jdText, jobTitle, companyName);
    setJdResult(parsedJd);

    const match = await jobApi.matchJob(parsedJd.jobId);
    setMatchResult(match);
    setAnalyzing(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-400" />
            Job Description Analyzer & Role Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare your Master Resume against real JDs to extract MUST-HAVE criteria and calculate Job Readiness.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={handleAnalyzeAndMatch}
          isLoading={analyzing}
          icon={<Sparkles className="w-4 h-4" />}
        >
          Analyze JD & Match Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: JD Text Input */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Target Job Posting Details</h3>
            <span className="text-xs text-indigo-400 font-semibold">Live AI Parser</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Paste Raw Job Description (JD)</label>
            <textarea
              rows={12}
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed resize-none mt-1"
              placeholder="Paste raw JD text..."
            />
          </div>

          <Button variant="primary" size="md" className="w-full" onClick={handleAnalyzeAndMatch} isLoading={analyzing}>
            Analyze JD & Calculate Match Score
          </Button>
        </GlassCard>

        {/* Right: Results / Match Scores */}
        <div className="space-y-6">
          
          {matchResult && jdResult ? (
            <div className="space-y-6">
              
              {/* Match Score & Readiness Header */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Job Role Match Score"
                  value={`${matchResult.matchScore}%`}
                  subtitle={`${jdResult.companyName} • ${jdResult.jobTitle}`}
                  progress={matchResult.matchScore}
                  glow="indigo"
                  icon={<Target className="w-6 h-6 text-indigo-400" />}
                />
                <StatCard
                  title="Job Readiness Score"
                  value={`${matchResult.readinessScore}%`}
                  subtitle="Interview & Technical Readiness"
                  progress={matchResult.readinessScore}
                  glow="purple"
                  icon={<Zap className="w-6 h-6 text-purple-400" />}
                />
              </div>

              {/* MUST HAVE vs GOOD TO HAVE Skills */}
              <GlassCard className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  MUST HAVE Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jdResult.mustHaveSkills.map((sk, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                      ✓ {sk}
                    </span>
                  ))}
                </div>

                <h4 className="text-sm font-bold text-white flex items-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  GOOD TO HAVE Preferred Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jdResult.goodToHaveSkills.map((g, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      + {g}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Match Score Breakdown */}
              <GlassCard className="space-y-3">
                <h4 className="text-sm font-bold text-white">Score Component Breakdown</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Technical Skills Overlap</span>
                    <span className="font-bold text-emerald-400">{matchResult.techSkillsMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Experience Relevance</span>
                    <span className="font-bold text-indigo-400">{matchResult.experienceMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Education Alignment</span>
                    <span className="font-bold text-emerald-400">{matchResult.educationMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Project Architectural Match</span>
                    <span className="font-bold text-indigo-400">{matchResult.projectsMatch}%</span>
                  </div>
                </div>
              </GlassCard>

              {/* Top 3 Readiness Action Items */}
              <GlassCard glow="cyan" className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Top 3 Recommendations Before Applying
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {matchResult.top3ActionItems.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

            </div>
          ) : (
            <GlassCard className="p-12 text-center space-y-4">
              <Target className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-white">Ready for JD Analysis</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Paste any job description to extract core requirements and see your exact match percentage.
              </p>
              <Button variant="primary" size="sm" onClick={handleAnalyzeAndMatch}>
                Run Job Match
              </Button>
            </GlassCard>
          )}

        </div>
      </div>

    </div>
  );
};
