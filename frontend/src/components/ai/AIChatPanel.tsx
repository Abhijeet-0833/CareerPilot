import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, Loader2, RefreshCw } from 'lucide-react';
import { aiApi } from '../../services/api';

export const AIChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Career Coach. I'm connected to your Master Resume, Target Role, and Application Pipeline. How can I help you prepare today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'How do I increase my ATS score?',
    'Am I ready for a Java Developer role?',
    'What skills am I missing?',
    'Generate recruiter outreach email',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const reply = await aiApi.chat(query);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'I encountered an issue connecting to the AI engine. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-indigo-500/50 border border-white/20 cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide">AI Career Coach</span>
        </motion.button>
      )}

      {/* Floating Chat Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] glass-panel rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900/80 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    AI Career Coach
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-medium">Online • Context Aware</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-950/40">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-purple-600/30 border border-purple-500/30 text-purple-300'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'glass-card border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="glass-card px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Analyzing profile context...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 py-2 bg-slate-900/60 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI Career Coach..."
                className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
