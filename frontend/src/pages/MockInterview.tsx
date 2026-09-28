import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { 
  Mic, Bot, Sparkles, Send, CheckCircle2, AlertTriangle, 
  Volume2, RefreshCw, Trophy, MessageSquare, ArrowRight 
} from 'lucide-react';
import { interviewApi } from '../services/api';
import { AnswerEvaluation, FinalEvaluationResponse } from '../types';

export const MockInterview: React.FC = () => {
  const [interviewType, setInterviewType] = useState('Java & Spring Boot');
  const [targetRole, setTargetRole] = useState('Java Full Stack Developer');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    'How do you design a stateless JWT authentication system using Spring Security 3 FilterChain?'
  );
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [lastEval, setLastEval] = useState<AnswerEvaluation | null>(null);
  const [finalReport, setFinalReport] = useState<FinalEvaluationResponse | null>(null);

  const handleStartSession = async () => {
    const session = await interviewApi.startSession(interviewType, targetRole);
    setSessionId(session.id);
    setSessionStarted(true);
    setQuestionIndex(0);
    setLastEval(null);
    setFinalReport(null);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || submitting || !sessionId) return;
    setSubmitting(true);

    const evalResult = await interviewApi.submitAnswer(sessionId, questionIndex, currentQuestion, userAnswer);
    setLastEval(evalResult);
    setUserAnswer('');
    setSubmitting(false);

    if (evalResult.isFinalQuestion) {
      const finalEval = await interviewApi.getFinalEvaluation(sessionId);
      setFinalReport(finalEval);
    } else {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(evalResult.nextQuestionText);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Mic className="w-7 h-7 text-indigo-400" />
            AI Mock Interviewer & English Coach
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic technical interview questions with real-time filler word analysis and answer rewrites.
          </p>
        </div>

        {!sessionStarted && (
          <Button variant="gradient" size="sm" onClick={handleStartSession} icon={<Sparkles className="w-4 h-4" />}>
            Start New Session
          </Button>
        )}
      </div>

      {!sessionStarted ? (
        
        /* Session Setup Panel */
        <GlassCard glow="indigo" className="max-w-2xl mx-auto space-y-6 p-8">
          <h3 className="text-lg font-bold text-white text-center">Configure Interview Parameters</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-400 uppercase">Select Interview Domain</label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-xl mt-1 text-xs bg-slate-900 cursor-pointer"
              >
                <option value="Java & Spring Boot">Java 17 & Spring Boot Microservices</option>
                <option value="SQL & Relational Databases">SQL Query Tuning & PostgreSQL</option>
                <option value="System Design & Scalability">System Design & Caching Architecture</option>
                <option value="React & Frontend Architecture">React.js & TypeScript Frontend</option>
                <option value="Behavioral & HR Round">Behavioral & HR Leadership</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-400 uppercase">Target Engineering Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-xl mt-1 text-xs"
              />
            </div>
          </div>

          <Button variant="gradient" size="lg" className="w-full" onClick={handleStartSession} icon={<Mic className="w-5 h-5" />}>
            Begin AI Interview Session
          </Button>
        </GlassCard>

      ) : finalReport ? (

        /* Final Scorecard Report */
        <GlassCard glow="emerald" className="space-y-6 p-8">
          <div className="text-center space-y-2 border-b border-white/10 pb-6">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-extrabold text-white">Interview Completed!</h2>
            <p className="text-xs text-slate-400">Final AI Scorecard & Communication Breakdown</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Overall Score" value={`${finalReport.overallScore} / 100`} glow="emerald" />
            <StatCard title="Technical Score" value={`${finalReport.technicalScore}%`} glow="indigo" />
            <StatCard title="Communication Score" value={`${finalReport.communicationScore}%`} glow="purple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <GlassCard className="space-y-3">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {finalReport.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="space-y-3">
              <h4 className="font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Areas to Improve
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {finalReport.areasToImprove.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="pt-4 flex justify-center">
            <Button variant="primary" size="md" onClick={handleStartSession}>
              Practice Another Interview
            </Button>
          </div>
        </GlassCard>

      ) : (

        /* Active Interview Interactive Room */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Question Stream & Response */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Question Card */}
            <GlassCard glow="indigo" className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Question {questionIndex + 1} of 3
                </span>
                <span className="text-slate-400">{interviewType}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{currentQuestion}</h3>
                  <p className="text-xs text-slate-400 mt-1">Provide your answer detailing architecture, logic, and production experience.</p>
                </div>
              </div>
            </GlassCard>

            {/* Response Input */}
            <GlassCard className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase">Your Technical Answer</label>
              <textarea
                rows={7}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type your response here... (e.g. In Spring Security 3, stateless authentication is achieved by...)"
                className="w-full glass-input p-4 rounded-2xl text-xs leading-relaxed resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  English Coach active: Checking filler words (basically, like, actually)...
                </span>
                <Button variant="gradient" size="md" onClick={handleSubmitAnswer} isLoading={submitting} icon={<Send className="w-4 h-4" />}>
                  Submit Answer for AI Evaluation
                </Button>
              </div>
            </GlassCard>

          </div>

          {/* Right Col: Live Feedback & English Coach Feedback */}
          <div className="space-y-6">
            
            {lastEval ? (
              <GlassCard glow="purple" className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Live Answer Scorecard
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{lastEval.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>

                <div className="space-y-3 text-xs border-t border-white/10 pt-3">
                  <div>
                    <span className="font-bold text-indigo-400">Technical Clarity:</span>
                    <p className="text-slate-300 mt-0.5">{lastEval.technicalClarity}</p>
                  </div>

                  <div>
                    <span className="font-bold text-purple-400">Communication & Grammar Coach:</span>
                    <p className="text-slate-300 mt-0.5">{lastEval.grammarFeedback}</p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-400">Improved Example Answer:</span>
                    <p className="text-slate-300 italic mt-0.5 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                      "{lastEval.improvedExampleAnswer}"
                    </p>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-8 text-center space-y-3">
                <Bot className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-white">AI Coach Waiting</h4>
                <p className="text-xs text-slate-400">
                  Submit your technical answer to receive real-time scoring, English grammar analysis, and filler word detection.
                </p>
              </GlassCard>
            )}

          </div>

        </div>

      )}

    </div>
  );
};
