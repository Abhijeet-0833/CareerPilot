import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { CheckCircle2, AlertCircle, RefreshCw, Mail, Sparkles } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);
  const [resendMsg, setResendMsg] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token provided in URL.');
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        const res = await authApi.verifyEmail(token);
        setSuccess(true);
        setMessage(res.message || 'Email verified successfully! You can now sign in.');
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.response?.data?.message || err.message || 'Failed to verify email. Token may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    try {
      setResending(true);
      setResendMsg('');
      const res = await authApi.resendVerification(resendEmail);
      setResendMsg(res.message || 'Verification email sent!');
    } catch (err: any) {
      setResendMsg(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 space-y-6 text-center border-indigo-500/30">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white">Email Verification</h2>

          {loading && (
            <div className="py-8 space-y-3 flex flex-col items-center">
              <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-sm text-slate-300">Verifying your token...</p>
            </div>
          )}

          {!loading && success && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-200">{message}</p>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="gradient" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!loading && !success && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm text-rose-300">{message}</p>

              <div className="pt-4 border-t border-white/10 space-y-3 text-left">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Resend Verification Email
                </label>
                <form onSubmit={handleResend} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <Button variant="glass" size="sm" type="submit" disabled={resending} className="w-full">
                    {resending ? 'Sending...' : 'Resend Verification Link'}
                  </Button>
                </form>
                {resendMsg && (
                  <p className="text-xs text-indigo-300 bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                    {resendMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
