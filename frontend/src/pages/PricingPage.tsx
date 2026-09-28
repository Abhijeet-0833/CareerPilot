import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Sparkles, Check, Zap, Shield, Building, GraduationCap } from 'lucide-react';
import { subscriptionApi } from '../services/api';

export const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activePlan, setActivePlan] = useState('PRO');

  const plans = [
    {
      key: 'FREE',
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Essential features to begin your career search.',
      features: ['Basic ATS Resume Score', '1 JD Analysis per day', 'Job Discovery module', 'Kanban Application Tracker'],
      buttonText: 'Current Plan',
      variant: 'glass' as const,
    },
    {
      key: 'PRO',
      name: 'Pro Candidate',
      price: '$29',
      period: 'per month',
      popular: true,
      description: 'Comprehensive AI power for serious job seekers.',
      features: [
        'Advanced ATS Resume Parser',
        'Unlimited JD Match Analysis',
        'Job-Tailored Resume Exporter',
        'Personalized Skill Gap Roadmap',
        '3 AI Mock Interview Sessions / mo',
        'English & Communication Coach',
      ],
      buttonText: 'Upgrade to PRO',
      variant: 'gradient' as const,
    },
    {
      key: 'PREMIUM',
      name: 'Premium Career',
      price: '$59',
      period: 'per month',
      description: 'Unlimited AI interview coaching & career assistant.',
      features: [
        'Unlimited AI Mock Interviews',
        '24/7 Context-Aware AI Career Coach',
        'Recruiter Outreach Generator',
        'Priority Technical Assessments',
        '1-on-1 Portfolio Architecture review',
      ],
      buttonText: 'Upgrade to Premium',
      variant: 'primary' as const,
    },
  ];

  const handleSelectPlan = async (planKey: string) => {
    setSelectedPlan(planKey);
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = async () => {
    setProcessing(true);
    const order = await subscriptionApi.checkout(selectedPlan || 'PRO');
    await subscriptionApi.verifyAndUpgrade(order.razorpayOrderId, 'pay_demo_99', selectedPlan || 'PRO');
    setProcessing(false);
    setIsCheckoutOpen(false);
    setActivePlan(selectedPlan || 'PRO');

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto text-center">
      
      {/* Header */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
          Flexible Monetization & Subscription Plans
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Accelerate Your Career with <span className="gradient-text">AI Power</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Unlock unlimited ATS analysis, job-tailored resumes, and dynamic AI mock interviews.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {plans.map(p => (
          <GlassCard
            key={p.key}
            glow={p.popular ? 'indigo' : 'none'}
            className={`p-8 text-left relative flex flex-col justify-between ${
              p.popular ? 'border-2 border-indigo-500/50 shadow-2xl scale-105' : ''
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-slate-400">/ {p.period}</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/10">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant={p.variant}
                size="md"
                className="w-full"
                disabled={activePlan === p.key}
                onClick={() => handleSelectPlan(p.key)}
              >
                {activePlan === p.key ? 'Current Active Plan' : p.buttonText}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Razorpay Simulated Checkout Modal */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Razorpay Checkout Sandbox">
        <div className="space-y-6 text-left text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-sm">AI Career OS {selectedPlan} Subscription</p>
              <p className="text-slate-400 text-xs">Monthly Recurring Billing • Cancel Anytime</p>
            </div>
            <span className="text-xl font-extrabold text-indigo-400">
              {selectedPlan === 'PREMIUM' ? '$59.00' : '$29.00'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Secure 256-Bit SSL Server-Side Payment Processing
            </p>
            <p className="text-[11px] text-slate-400">Simulating Razorpay order creation and webhook verification.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
            <Button variant="gradient" size="md" onClick={handleConfirmCheckout} isLoading={processing}>
              Pay Now with Razorpay
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
