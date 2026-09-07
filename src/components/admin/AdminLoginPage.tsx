import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  KeyRound, 
  AlertCircle,
  Store,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return Number(sessionStorage.getItem('cbz_admin_failed_count') || '0');
    } catch {
      return 0;
    }
  });
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Lockout timer effect
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          try { sessionStorage.removeItem('cbz_admin_failed_count'); } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMsg('অনুগ্রহ করে ইমেইল লিখুন।');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('অনুগ্রহ করে পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isSuccess = loginAdmin(cleanEmail, cleanPass);
      setIsLoading(false);

      if (isSuccess) {
        setFailedAttempts(0);
        try { sessionStorage.removeItem('cbz_admin_failed_count'); } catch {}
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        try { sessionStorage.setItem('cbz_admin_failed_count', nextFailed.toString()); } catch {}

        if (nextFailed >= 5) {
          setLockoutSeconds(60);
          setErrorMsg('অতিরিক্ত ভুল চেষ্টার কারণে অ্যাকাউন্ট ৬০ সেকেন্ডের জন্য লক করা হয়েছে।');
        } else {
          setErrorMsg(`ভুল ইমেইল অথবা পাসওয়ার্ড! বাকি আছে ${5 - nextFailed} টি চেষ্টা।`);
        }
        setPassword('');
      }
    }, 400);
  };

  const handleReturnToStore = () => {
    setActiveView('store');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1f0b2e] to-slate-950 text-white flex flex-col justify-center items-center p-4 selection:bg-purple-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-[#4a154b] to-indigo-600 p-0.5 mx-auto shadow-xl shadow-purple-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-[11px] font-semibold text-purple-300 tracking-wide">
              <Lock className="w-3 h-3 text-purple-300" />
              <span>অ্যাডমিন পোর্টাল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Cox's Bazar Pet Shop & Care
            </h1>
            <p className="text-xs text-slate-400">
              দোকান পরিচালনা ও অর্ডার ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        {/* Lockout Warning */}
        {lockoutSeconds > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-600/60 text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-bold">অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে</p>
              <p className="text-[11px] text-amber-300">অপেক্ষা করুন: <strong>{lockoutSeconds}</strong> সেকেন্ড</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && lockoutSeconds <= 0 && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2.5 animate-in shake duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              ইমেইল
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                disabled={lockoutSeconds > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cbp.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all font-mono tracking-wider disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || lockoutSeconds > 0}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-[#5a1b5c] to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4 text-purple-200" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>

        </form>

        {/* Footer Link: Return to Public Storefront */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={handleReturnToStore}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>

      </div>

    </div>
  );
};
