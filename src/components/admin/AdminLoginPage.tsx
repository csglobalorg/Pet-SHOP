import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  User, 
  KeyRound, 
  AlertCircle,
  Sparkles,
  Store
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড বা পিন লিখুন।');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const cleanPass = password.trim();
      const cleanUser = username.trim().toLowerCase();

      // Support default admin credentials
      if (
        (cleanUser === 'admin' || cleanUser.includes('admin') || cleanUser === 'owner') &&
        (cleanPass === '1234' || cleanPass === 'admin123' || cleanPass.toLowerCase() === 'admin')
      ) {
        loginAdmin(cleanPass);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMsg('ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে। ডিফল্ট পিন: 1234');
        setPassword('');
      }
    }, 300);
  };

  const handleReturnToStore = () => {
    setActiveView('store');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 text-white flex flex-col justify-center items-center p-4 selection:bg-purple-600 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-[#4a154b] p-0.5 mx-auto shadow-lg shadow-purple-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-[11px] font-semibold text-purple-300 tracking-wide uppercase">
              <Lock className="w-3 h-3" />
              <span>Staff & Management Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Cox's Bazar Pet Shop & Care
            </h1>
            <p className="text-xs text-slate-400">
              অ্যাডমিন ও ক্যাশিয়ারের জন্য সুরক্ষিত ম্যানেজমেন্ট ড্যাশবোর্ড
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5 animate-in shake duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Username Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Admin Username / Staff ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password / PIN Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Security Password / Passcode PIN
              </label>
              <span className="text-[11px] text-purple-400 font-mono">
                Default: 1234
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons for local development */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('1234');
                setErrorMsg('');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
            >
              Fill PIN 1234
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
                setErrorMsg('');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
            >
              Fill admin123
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-[#4a154b] hover:from-purple-600 hover:to-[#3c103d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4 text-purple-200" />
                <span>লগইন করুন (Access Admin Portal)</span>
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
            <span>মূল শপ-এ ফিরে যান (Storefront)</span>
          </button>

          <span className="text-[11px] text-slate-600">
            v2.4 Enterprise
          </span>
        </div>

      </div>

    </div>
  );
};
