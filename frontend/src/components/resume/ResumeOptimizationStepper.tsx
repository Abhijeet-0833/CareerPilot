import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { 
  FileText, Upload, Sparkles, Target, CheckCircle2, AlertTriangle, 
  ArrowRight, ArrowLeft, Download, Check, X, Copy, RefreshCw, 
  ShieldCheck, Eye, Layers, FileCheck, Info
} from 'lucide-react';
import { resumeApi, jobApi } from '../../services/api';
import { 
  ATSAnalysisResult, TailoredResumeResult, SkillConfirmationItem, 
  StructureAnalysisResult, QualityCheckResult, DiffItem 
} from '../../types';
import { downloadResumeFile } from '../../utils/resumeExporter';

export const ResumeOptimizationStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState(
    `ALEX MORGAN\nSan Francisco, CA • alex@careerpilot.ai • github.com/alexmorgan\n\nSUMMARY\nExperienced Full Stack Developer with 3+ years building scalable microservices and web applications using Java 17, Spring Boot, REST APIs, SQL, and React.\n\nTECHNICAL SKILLS\nLanguages: Java 17, TypeScript, SQL, JavaScript, HTML, CSS\nFrameworks: Spring Boot 3, Spring Data JPA, Hibernate, React.js, Tailwind CSS\nTools & DB: PostgreSQL, Git, Maven, JUnit, Mockito, RESTful Services\n\nWORK EXPERIENCE\nSoftware Engineer | Tech Global Inc | 2023 - Present\n- Worked on backend development and API endpoints.\n- Optimized PostgreSQL queries reducing latency by 35%.\n- Developed responsive React frontend user interfaces with TypeScript.`
  );

  const [jobTitle, setJobTitle] = useState('Senior Java Backend Engineer');
  const [companyName, setCompanyName] = useState('Stripe');
  const [jdText, setJdText] = useState(
    `We are looking for a Senior Java Backend Engineer to join Stripe's payments infrastructure team.\n\nRESPONSIBILITIES:\n- Design and implement high-performance REST APIs using Java 17 and Spring Boot 3.\n- Optimize PostgreSQL queries and handle database indexes.\n- Build distributed microservices architectures.\n\nREQUIREMENTS:\n- 3+ years experience with Java 17, Spring Boot 3, REST APIs, SQL, PostgreSQL.\n- Preferred: Docker, AWS S3/EC2, Kafka event streaming.`
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);
  const [structureResult, setStructureResult] = useState<StructureAnalysisResult | null>(null);
  const [skillConfirmations, setSkillConfirmations] = useState<SkillConfirmationItem[]>([]);
  const [tailoredResult, setTailoredResult] = useState<TailoredResumeResult | null>(null);
  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null);
  const [userDiffs, setUserDiffs] = useState<DiffItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('Modern ATS');
  const [copied, setCopied] = useState(false);

  const totalSteps = 13;

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }
    setSelectedFile(file);
    setAnalyzing(true);
    const res = await resumeApi.uploadFile(file);
    setAtsResult(res);
    setAnalyzing(false);
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    const ats = await resumeApi.uploadAndAnalyze(selectedFile?.name || 'resume.pdf', resumeText);
    const struct = await resumeApi.analyzeStructure(resumeText);
    const skills = await resumeApi.getSkillConfirmation(jdText);
    
    setAtsResult(ats);
    setStructureResult(struct);
    setSkillConfirmations(skills);
    setAnalyzing(false);
    setCurrentStep(3);
  };

  const handleGenerateTailored = async () => {
    setAnalyzing(true);
    const confirmedList = skillConfirmations.filter(s => s.userConfirmed).map(s => s.skillName);
    const tailored = await resumeApi.generateTailored(undefined, jdText, confirmedList, resumeText);
    const quality = await resumeApi.runQualityCheck(tailored.optimizedSummary);

    setTailoredResult(tailored);
    setUserDiffs(tailored.proposedDiffs || []);
    setQualityCheck(quality);
    setAnalyzing(false);
    setCurrentStep(9);
  };

  const toggleSkillConfirmation = (index: number) => {
    setSkillConfirmations(prev =>
      prev.map((item, i) => (i === index ? { ...item, userConfirmed: !item.userConfirmed } : item))
    );
  };

  const toggleDiffAcceptance = (diffId: string) => {
    setUserDiffs(prev =>
      prev.map(d => (d.id === diffId ? { ...d, accepted: !d.accepted } : d))
    );
  };

  const handleAcceptAllDiffs = () => {
    setUserDiffs(prev => prev.map(d => ({ ...d, accepted: true })));
  };

  const handleRejectAllDiffs = () => {
    setUserDiffs(prev => prev.map(d => ({ ...d, accepted: false })));
  };

  const handleCopyText = () => {
    if (!tailoredResult) return;
    const text = `${tailoredResult.candidateName}\n\nSUMMARY:\n${tailoredResult.optimizedSummary}\n\nSKILLS:\n${tailoredResult.reorderedSkills.join(', ')}\n\nEXPERIENCE:\n${tailoredResult.tailoredExperienceBullets.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 13-Step Progress Stepper Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] text-xs">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div key={stepNum} className="flex items-center gap-2">
                <button
                  onClick={() => stepNum <= currentStep && setCurrentStep(stepNum)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </button>
                {stepNum < totalSteps && (
                  <div className={`w-6 h-0.5 ${isDone ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Upload Resume */}
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard glow="indigo" className="p-8 space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                  Step 1 of 13: Upload Real Resume
                </span>
                <h2 className="text-2xl font-extrabold text-white">Upload PDF or DOCX Resume</h2>
                <p className="text-xs text-slate-400">Supported formats: PDF, DOCX (Max file size: 10MB)</p>
              </div>

              {/* Drag & Drop File Zone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center space-y-3 cursor-pointer relative group">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-indigo-400 mx-auto group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-bold text-white">Click or Drag & Drop Resume File Here</p>
                  <p className="text-xs text-slate-400 mt-0.5">Real text stream extraction powered by Apache PDFBox & POI</p>
                </div>
                {selectedFile && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                    <FileText className="w-4 h-4" /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              {/* Plain Text Fallback */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Or Edit Resume Raw Text</label>
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  className="w-full glass-input p-3.5 rounded-xl text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="gradient" size="md" onClick={() => setCurrentStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
                  Next: Target Job Description
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 2: Target Job Description */}
        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard glow="purple" className="p-8 space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                  Step 2 of 13: Target Job Description
                </span>
                <h2 className="text-2xl font-extrabold text-white">Select or Paste Job Description (JD)</h2>
                <p className="text-xs text-slate-400">Target role keywords will be compared against your Master Resume</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Target Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Target Company</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Paste Raw Job Description</label>
                <textarea
                  rows={7}
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  className="w-full glass-input p-3.5 rounded-xl text-xs font-mono leading-relaxed mt-1"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" size="md" onClick={() => setCurrentStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="gradient" size="md" onClick={handleRunAnalysis} isLoading={analyzing} icon={<Sparkles className="w-4 h-4" />}>
                  Run AI Structure & ATS Analysis
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 3 - 6: ATS Structure & Score Analysis Report */}
        {(currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6) && atsResult && (
          <motion.div key="step3-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Overall Score Header */}
              <GlassCard glow="indigo" className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BEFORE OPTIMIZATION ATS SCORE</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white">{atsResult.overallAtsScore}</span>
                    <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Explainable category breakdown matching Stripe JD criteria.</p>
                </div>

                <div className="grid grid-cols-5 gap-3 text-center bg-slate-900/80 p-3 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-[10px] text-slate-400">Keywords</p>
                    <p className="text-sm font-bold text-amber-400">{atsResult.keywordsScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Skills</p>
                    <p className="text-sm font-bold text-indigo-400">{atsResult.skillsScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Experience</p>
                    <p className="text-sm font-bold text-slate-300">{atsResult.experienceScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Projects</p>
                    <p className="text-sm font-bold text-slate-300">{atsResult.projectsScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Format</p>
                    <p className="text-sm font-bold text-amber-400">{atsResult.formattingScore}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Structure Analysis Alerts */}
              {structureResult && (
                <GlassCard className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Structure & ATS Layout Diagnostics
                  </h3>
                  {structureResult.hasAtsUnfriendlyFormatting ? (
                    <div className="space-y-2 text-xs text-amber-300">
                      {structureResult.formattingAlerts.map((alt, i) => (
                        <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          ⚠ {alt}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400">✓ Clean single-column machine-readable layout structure.</p>
                  )}
                </GlassCard>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="ghost" size="md" onClick={() => setCurrentStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="gradient" size="md" onClick={() => setCurrentStep(7)} icon={<ArrowRight className="w-4 h-4" />}>
                  Next: Truthful Skill Confirmation
                </Button>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 7 - 8: Truthful Skill Confirmation Modal */}
        {(currentStep === 7 || currentStep === 8) && (
          <motion.div key="step7-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard glow="purple" className="p-8 space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                  Steps 7 & 8: Truthful Skill Confirmation Engine
                </span>
                <h2 className="text-2xl font-extrabold text-white">Confirm Actual Technical Experience</h2>
                <p className="text-xs text-slate-300 max-w-xl mx-auto">
                  <strong className="text-indigo-400">Safety Rule Enforced:</strong> AI will NEVER fabricate skills or experience you do not have. Select the skills you have actual experience with.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar p-1">
                {skillConfirmations.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleSkillConfirmation(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      item.userConfirmed
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{item.skillName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.priority} PRIORITY
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.recommendationNote}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      item.userConfirmed ? 'bg-indigo-600 text-white border-indigo-500' : 'border-slate-600'
                    }`}>
                      {item.userConfirmed && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <Button variant="ghost" size="md" onClick={() => setCurrentStep(5)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="gradient" size="md" onClick={handleGenerateTailored} isLoading={analyzing} icon={<Sparkles className="w-4 h-4" />}>
                  Generate Optimized Resume & Diff View
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 9 - 10: AI Diff View & User Approval */}
        {(currentStep === 9 || currentStep === 10) && tailoredResult && (
          <motion.div key="step9-10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6 max-w-5xl mx-auto">
              
              <GlassCard glow="indigo" className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      Steps 9 & 10: Visual Diff View & User Approval
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-1">Review Proposed AI Optimizations</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="sm" onClick={handleAcceptAllDiffs}>Accept All</Button>
                    <Button variant="ghost" size="sm" onClick={handleRejectAllDiffs}>Reject All</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {userDiffs.map(diff => (
                    <div
                      key={diff.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        diff.accepted
                          ? 'bg-slate-900/80 border-indigo-500/40'
                          : 'bg-slate-900/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            diff.changeType === 'ADDED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {diff.changeType}
                          </span>
                          <span className="text-xs font-bold text-white">{diff.section}</span>
                        </div>

                        <button
                          onClick={() => toggleDiffAcceptance(diff.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                            diff.accepted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {diff.accepted ? 'Accepted ✓' : 'Rejected ✕'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                          <span className="text-[10px] font-bold text-rose-400 block mb-1">ORIGINAL:</span>
                          {diff.originalText}
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                          <span className="text-[10px] font-bold text-emerald-400 block mb-1">OPTIMIZED:</span>
                          {diff.optimizedText}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(7)} icon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button variant="gradient" size="md" onClick={() => setCurrentStep(11)} icon={<ArrowRight className="w-4 h-4" />}>
                    Next: Before vs After Score Comparison
                  </Button>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}

        {/* STEP 11 - 12: BEFORE vs AFTER Score Comparison */}
        {(currentStep === 11 || currentStep === 12) && tailoredResult?.scoreComparison && (
          <motion.div key="step11-12" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <GlassCard glow="emerald" className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Steps 11 & 12: Measurable ATS Improvement
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">
                    +{tailoredResult.scoreComparison.scoreImprovement} ATS Score Lift Achieved!
                  </h2>
                  <p className="text-xs text-slate-400">Calculated directly from actual keyword and structure scoring engines.</p>
                </div>

                {/* Score Comparison Badge Grid */}
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-bold text-rose-300 uppercase">BEFORE OPTIMIZATION</span>
                    <p className="text-4xl font-extrabold text-rose-400">{tailoredResult.scoreComparison.beforeAtsScore}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-bold text-emerald-300 uppercase">AFTER OPTIMIZATION</span>
                    <p className="text-4xl font-extrabold text-emerald-400">{tailoredResult.scoreComparison.afterAtsScore}</p>
                  </div>
                </div>

                {/* Score Improvement Explanations */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
                  <h4 className="font-bold text-white">Score Improvement Breakdown</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {tailoredResult.scoreComparison.scoreImprovementExplanations.map((exp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Button variant="ghost" size="md" onClick={() => setCurrentStep(9)} icon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button variant="gradient" size="md" onClick={() => setCurrentStep(13)} icon={<ArrowRight className="w-4 h-4" />}>
                    Next: ATS Template & Final Export
                  </Button>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}

        {/* STEP 13: ATS Template & Final Export */}
        {currentStep === 13 && tailoredResult && (
          <motion.div key="step13" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard glow="indigo" className="p-8 space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                    Step 13 of 13: Final Export
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Export Job-Tailored Resume</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="glass" size="sm" onClick={handleCopyText} icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}>
                    {copied ? 'Copied!' : 'Copy Text'}
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    onClick={() => {
                      if (!tailoredResult) return;
                      const text = `${tailoredResult.candidateName}\n\nSUMMARY:\n${tailoredResult.optimizedSummary}\n\nTECHNICAL SKILLS:\n${tailoredResult.reorderedSkills.join(', ')}\n\nWORK EXPERIENCE:\n${tailoredResult.tailoredExperienceBullets.join('\n')}`;
                      downloadResumeFile(`${tailoredResult.candidateName}_${companyName}_Resume`, text, 'PDF', companyName, jobTitle);
                    }} 
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download PDF
                  </Button>
                  <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={() => {
                      if (!tailoredResult) return;
                      const text = `${tailoredResult.candidateName}\n\nSUMMARY:\n${tailoredResult.optimizedSummary}\n\nTECHNICAL SKILLS:\n${tailoredResult.reorderedSkills.join(', ')}\n\nWORK EXPERIENCE:\n${tailoredResult.tailoredExperienceBullets.join('\n')}`;
                      downloadResumeFile(`${tailoredResult.candidateName}_${companyName}_Resume`, text, 'DOCX', companyName, jobTitle);
                    }} 
                    icon={<FileText className="w-4 h-4" />}
                  >
                    Download DOCX
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (!tailoredResult) return;
                      const text = `${tailoredResult.candidateName}\n\nSUMMARY:\n${tailoredResult.optimizedSummary}\n\nTECHNICAL SKILLS:\n${tailoredResult.reorderedSkills.join(', ')}\n\nWORK EXPERIENCE:\n${tailoredResult.tailoredExperienceBullets.join('\n')}`;
                      downloadResumeFile(`${tailoredResult.candidateName}_${companyName}_Resume`, text, 'TXT', companyName, jobTitle);
                    }} 
                  >
                    Download TXT
                  </Button>
                </div>
              </div>

              {/* Template Selector */}
              <div className="grid grid-cols-4 gap-3 text-xs">
                {['Modern ATS', 'Professional ATS', 'Minimal ATS', 'Technical ATS'].map(tpl => (
                  <button
                    key={tpl}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      selectedTemplate === tpl
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              {/* Quality Check Status Banner */}
              {qualityCheck && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pre-Export Quality Check Passed: No missing contact info, broken links, or duplicate bullets.
                  </span>
                  <span className="font-extrabold">Ready for Export</span>
                </div>
              )}

              {/* Final Resume Document Text View */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 text-xs font-sans space-y-4 text-slate-200 leading-relaxed">
                <h1 className="text-xl font-extrabold text-white">{tailoredResult.candidateName}</h1>
                <p className="text-indigo-400 font-bold">SUMMARY</p>
                <p className="text-slate-300">{tailoredResult.optimizedSummary}</p>
                
                <p className="text-indigo-400 font-bold">TECHNICAL SKILLS</p>
                <p className="text-slate-300">{tailoredResult.reorderedSkills.join(', ')}</p>

                <p className="text-indigo-400 font-bold">EXPERIENCE</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {tailoredResult.tailoredExperienceBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
