import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { 
  Map, Sparkles, CheckCircle2, Circle, Code, Database, 
  Layers, ArrowRight, BookOpen, Terminal, Check
} from 'lucide-react';
import { roadmapApi, jobApi } from '../services/api';
import { RoadmapResponse, MarketSkillAnalytics } from '../types';

export const SkillGapRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [analytics, setAnalytics] = useState<MarketSkillAnalytics | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    w1t1: true,
    w2t1: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const r = await roadmapApi.getRoadmap();
      setRoadmap(r);
      const a = await jobApi.getMarketAnalytics('Java Full Stack Developer');
      setAnalytics(a);
    };
    fetchData();
  }, []);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Map className="w-7 h-7 text-indigo-400" />
            Skill Gap Analyzer & Personalized Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Weekly learning objectives, practice tasks, interview preparation, and portfolio project architecture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            Roadmap Progress: 50%
          </span>
        </div>
      </div>

      {/* Market Skill Analytics */}
      {analytics && (
        <GlassCard glow="indigo" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Market Skill Analytics ({analytics.totalJDsAnalyzed} JDs Analyzed for {analytics.targetRole})
            </h3>
            <span className="text-xs text-slate-400">Most requested market skills</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {Object.entries(analytics.topSkillsDemand).map(([skill, pct], i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill}</span>
                  <span className="font-bold text-indigo-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Multi-Week Curriculum Accordion / Timeline */}
      {roadmap && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">4-Week Personalized Curriculum</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.weeklyPlans.map(w => (
              <GlassCard key={w.weekNumber} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      W{w.weekNumber}
                    </span>
                    <h3 className="text-base font-bold text-white">{w.weekTitle}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {w.tasks.map(t => (
                    <div key={t.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{t.topic}</h4>
                          <p className="text-xs text-slate-300 mt-0.5">{t.objective}</p>
                        </div>
                        <button
                          onClick={() => toggleTask(t.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            completedTasks[t.id]
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {completedTasks[t.id] ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Subtopics */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.subtopics.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {st}
                          </span>
                        ))}
                      </div>

                      {/* Practice Task & Mini Project */}
                      <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-white/5">
                        <p><strong className="text-slate-200">Practice Task:</strong> {t.practiceTasks[0]}</p>
                        <p><strong className="text-indigo-400">Mini Project:</strong> {t.miniProject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Project Recommendation Engine */}
      {roadmap && roadmap.recommendedProjects.length > 0 && (
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            Recommended Portfolio Project Architecture
          </h2>

          {roadmap.recommendedProjects.map((proj, idx) => (
            <GlassCard key={idx} glow="purple" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-purple-300">{proj.architecture}</p>
                </div>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-semibold">
                  Tech Stack: {proj.techStack}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                <div className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" /> Problem Statement
                  </h4>
                  <p className="bg-slate-900/60 p-3 rounded-xl border border-white/5">{proj.problemStatement}</p>
                  
                  <h4 className="font-bold text-white flex items-center gap-1.5 pt-2">
                    <Terminal className="w-4 h-4 text-emerald-400" /> Key Features
                  </h4>
                  <ul className="list-disc list-inside space-y-1 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    {proj.keyFeatures.map((kf, i) => (
                      <li key={i}>{kf}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-purple-400" /> Resume Bullet Points
                  </h4>
                  <ul className="list-disc list-inside space-y-1 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-indigo-300">
                    {proj.resumeBulletPoints.map((rb, i) => (
                      <li key={i}>{rb}</li>
                    ))}
                  </ul>

                  <h4 className="font-bold text-white flex items-center gap-1.5 pt-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Interview Explanation Blueprint
                  </h4>
                  <p className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-amber-200/90">{proj.interviewExplanation}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

    </div>
  );
};
