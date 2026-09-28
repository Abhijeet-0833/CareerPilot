import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { Award, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const TechnicalAssessment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'java' | 'spring' | 'sql'>('java');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      q: 'In Spring Boot 3, which annotation is used to handle global controller exceptions?',
      options: ['@ControllerAdvice', '@ExceptionHandler', '@GlobalException', '@Aspect'],
      correct: 0,
    },
    {
      id: 2,
      q: 'How do you resolve the JPA N+1 select problem in Hibernate?',
      options: ['Use @Transactional', 'Use EntityGraph or JOIN FETCH', 'Increase connection pool size', 'Enable L2 Cache'],
      correct: 1,
    },
    {
      id: 3,
      q: 'What is the default bean scope in Spring Framework?',
      options: ['Prototype', 'Singleton', 'Request', 'Session'],
      correct: 1,
    },
  ];

  const handleSelect = (qId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) score += 1;
    });
    return score;
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            Timed Technical Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test your Java, Spring Boot, and SQL technical proficiency with timed assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          <Clock className="w-4 h-4" /> Time Limit: 15:00
        </div>
      </div>

      {submitted ? (
        <GlassCard glow="emerald" className="p-8 text-center space-y-6">
          <Award className="w-16 h-16 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-extrabold text-white">Assessment Result: Passed!</h2>
          <p className="text-sm text-slate-300">
            You scored <strong className="text-emerald-400">{calculateScore()} / {questions.length}</strong> on Java & Spring Boot Fundamentals.
          </p>
          <Button variant="primary" size="md" onClick={() => setSubmitted(false)}>
            Retake Assessment
          </Button>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-6">
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white">
                  Q{idx + 1}. {q.q}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAnswers[q.id] === oIdx
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="gradient" size="md" onClick={() => setSubmitted(true)}>
              Submit Assessment
            </Button>
          </div>
        </GlassCard>
      )}

    </div>
  );
};
