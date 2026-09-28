import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Sparkles, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2, ArrowRight, KeyRound, Send, ShieldCheck } from 'lucide-react';

type Mode = 'OTP' | 'PASSWORD' | 'REGISTER';

export const LoginPage: React.FC = () => {
  const { login, register, sendOtp, verifyOtp, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('OTP');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // OTP specific state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showResend, setShowResend] = useState<boolean>(false);

  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotMsg, setForgotMsg] = useState<string>('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      await sendOtp(email);
      setOtpSent(true);
      setSuccessMsg(`A 6-digit OTP code has been dispatched via Gmail to ${email}! Check your inbox.`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!otpCode || otpCode.trim().length < 4) {
      setError('Please enter the 6-digit OTP code received in your email.');
      return;
    }
    try {
      setLoading(true);
      await verifyOtp(email, otpCode);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowResend(false);

    if (mode === 'REGISTER') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        setLoading(true);
        await register(email, password, fullName);
        setSuccessMsg('Registration successful! Please check your email inbox to verify your account.');
        setMode('PASSWORD');
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await login(email, password);
        navigate('/dashboard');
      } catch (err: any) {
        let msg = 'Authentication failed';
        if (!err.response) {
          msg = 'Unable to connect to the server. Make sure backend is active.';
        } else if (err.response.status === 401) {
          msg = 'Invalid email or password.';
        } else if (err.response.status === 403 || err.response.data?.message?.toLowerCase().includes('verify')) {
          msg = 'Please verify your email before signing in.';
          setShowResend(true);
        } else if (err.response.data?.message) {
          msg = err.response.data.message;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await resendVerification(email);
      setSuccessMsg(`A new verification email has been sent to ${email}.`);
      setShowResend(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authApi.forgotPassword(forgotEmail);
      setForgotMsg(res.message || 'If an account exists, a reset link has been sent.');
    } catch (err: any) {
      setForgotMsg('Error processing request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8 space-y-6 border-indigo-500/30 shadow-2xl shadow-indigo-950/50">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {mode === 'OTP' ? 'Email OTP Authentication' : mode === 'REGISTER' ? 'Create CareerPilot Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'OTP' 
                ? 'Sign in securely using 6-Digit Gmail OTP Authentication' 
                : mode === 'REGISTER' 
                ? 'Register with real email verification' 
                : 'Sign in with your email & password'}
            </p>
          </div>

          {/* Mode Selector Tabs */}
          {!showForgot && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('OTP');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'OTP' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Gmail OTP Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('PASSWORD');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'PASSWORD' || mode === 'REGISTER'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Password Login
              </button>
            </div>
          )}

          {/* Alert Error / Success */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-2 text-indigo-400 underline font-semibold hover:text-indigo-300 block cursor-pointer"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Forgot Password View */}
          {showForgot ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {forgotMsg && (
                <p className="text-xs text-indigo-300 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                  {forgotMsg}
                </p>
              )}

              <Button variant="gradient" className="w-full" type="submit" disabled={loading}>
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </Button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          ) : mode === 'OTP' ? (
            /* Gmail OTP Authentication System Form */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        Email Address
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono">Gmail SMTP Enabled</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <Button 
                    variant="gradient" 
                    className="w-full py-3" 
                    type="submit" 
                    disabled={loading} 
                    icon={<Send className="w-4 h-4" />}
                  >
                    {loading ? 'Sending Gmail OTP...' : 'Send 6-Digit OTP via Gmail'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                        Enter 6-Digit OTP Code
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setError('');
                        }}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        Change Email
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-900/90 border border-indigo-500/50 text-center font-mono text-xl font-bold tracking-[0.4em] text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                      Sent to <strong className="text-slate-200">{email}</strong>. Check your inbox or spam folder.
                    </p>
                  </div>

                  <Button 
                    variant="gradient" 
                    className="w-full py-3" 
                    type="submit" 
                    disabled={loading} 
                    icon={<ShieldCheck className="w-4 h-4" />}
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
                  </Button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-center text-xs text-indigo-400 hover:underline pt-1 block"
                  >
                    Resend OTP Code
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Password / Register Form */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {mode === 'REGISTER' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Password
                  </label>
                  {mode === 'PASSWORD' && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {mode === 'REGISTER' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <Button 
                variant="gradient" 
                className="w-full py-3" 
                type="submit" 
                disabled={loading} 
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {loading ? 'Processing...' : mode === 'REGISTER' ? 'Create Account & Verify' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Toggle between Password Login and Register */}
          {!showForgot && mode !== 'OTP' && (
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'REGISTER' ? 'PASSWORD' : 'REGISTER');
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {mode === 'REGISTER' ? (
                  <span>Already have an account? <strong className="text-indigo-400">Sign In</strong></span>
                ) : (
                  <span>Don't have an account? <strong className="text-indigo-400">Register as Job Seeker</strong></span>
                )}
              </button>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
};
