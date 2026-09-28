import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Target, 
  Map, FileText, CheckCircle2, Star, Award, ChevronRight
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] -left-[200px] w-[500px] h-[500px] bg-cyan-600/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Next-Generation AI Career Operating System</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Your AI Career,<br />
            <span className="gradient-text">From Resume to Offer.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Analyze real Job Descriptions, master missing skill gaps with personalized roadmaps, optimize your ATS resume, and ace AI mock interviews.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to="/dashboard">
              <Button variant="gradient" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Launch AI Dashboard
              </Button>
            </Link>
            <Link to="/resume-analyzer">
              <Button variant="glass" size="lg" icon={<FileText className="w-5 h-5 text-indigo-400" />}>
                Free ATS Resume Audit
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Interactive Floating Glass Preview Cards Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] text-slate-400 font-mono">
                careerpilot.ai/live-dashboard
              </div>
            </div>

            {/* Grid Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Floating Card 1: Career Score */}
              <GlassCard glow="indigo" className="relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">CAREER READINESS</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Top 5%</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">88</span>
                  <span className="text-sm text-slate-400">/ 100</span>
                </div>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-[88%]" />
                </div>
              </GlassCard>

              {/* Floating Card 2: Job Match Score */}
              <GlassCard glow="purple" className="relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">TARGET JOB MATCH</span>
                  <span className="text-xs text-indigo-400 font-bold">Stripe • Senior Java</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">92%</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">Spring Boot 3</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/30">REST API</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">SQL</span>
                </div>
              </GlassCard>

              {/* Floating Card 3: AI Interviewer */}
              <GlassCard glow="cyan" className="relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">AI MOCK INTERVIEW</span>
                  <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> Active Session
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-300 italic">
                  "How do you handle transactional rollback in Spring Boot?"
                </p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">Tech Score: 90/100</span>
                  <span className="text-indigo-400 font-semibold">No filler words</span>
                </div>
              </GlassCard>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">
            Everything You Need to Land Your <span className="gradient-text">Dream Offer</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            A complete career operating system that takes you step-by-step from raw resume to final job offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ATS Resume Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real keyword parsing and category scoring without fake experience fabrication.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">JD Analysis & Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract MUST-HAVE vs GOOD-TO-HAVE skills and calculate your exact job readiness.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Skill Gap Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom multi-week learning curriculum with practice tasks and portfolio architectures.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Mock Interviewer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive dynamic technical questions with English grammar and filler-word coach.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto glass-panel p-12 rounded-3xl border border-indigo-500/30 relative overflow-hidden glow-indigo">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to Elevate Your Tech Career?</h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
            Join thousands of developers using AI Career OS to optimize resumes, master skill gaps, and win top offers.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="gradient" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-500">
        <p>© 2026 AI Career OS (CareerPilot). All rights reserved. Premium UI/UX Design System.</p>
      </footer>
    </div>
  );
};
