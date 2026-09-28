import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { ResumeOptimizationStepper } from '../components/resume/ResumeOptimizationStepper';
import { Sparkles, FileText, Layers, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumeAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stepper' | 'quick'>('stepper');

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header with Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-400" />
            Advanced AI Resume Optimization Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real PDF/DOCX parser, 13-step workflow, visual Diff view, truthful skill confirmation, and version control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('stepper')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'stepper'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              13-Step Stepper Workflow
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quick ATS Audit
            </button>
          </div>

          <Link to="/resume-versions">
            <Button variant="glass" size="sm" icon={<Layers className="w-4 h-4 text-purple-400" />}>
              Version Control
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Mode View */}
      {activeTab === 'stepper' ? (
        <ResumeOptimizationStepper />
      ) : (
        <GlassCard glow="indigo" className="p-8 text-center space-y-4">
          <FileText className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">Quick ATS Audit Mode</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Switch to the 13-Step Stepper Workflow above for full PDF/DOCX file upload, visual Diffs, truthful skill confirmations, and BEFORE vs AFTER score comparisons.
          </p>
          <Button variant="primary" size="sm" onClick={() => setActiveTab('stepper')}>
            Open 13-Step Workflow
          </Button>
        </GlassCard>
      )}

    </div>
  );
};
