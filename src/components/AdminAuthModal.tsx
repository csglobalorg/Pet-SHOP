import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  KeyRound, 
  Store, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAdminAuthModalOpen, 
    setIsAdminAuthModalOpen, 
    loginAdmin, 
    isAdminAuthenticated,
    setActiveView 
  } = useStore();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Please enter your passcode / PIN');
      return;
    }

    const success = loginAdmin(pin.trim());
    if (!success) {
      setErrorMsg('Incorrect passcode. Default store PIN is 1234.');
      setPin('');
    } else {
      setErrorMsg('');
      setPin('');
    }
  };

  const handleKeypadPress = (val: string) => {
    setErrorMsg('');
    if (pin.length < 8) {
      setPin(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Strip */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">Staff Security Gate</h3>
              <p className="text-[11px] text-slate-400">Cox's Bazar Pet Shop ERP</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAdminAuthModalOpen(false);
              setPin('');
              setErrorMsg('');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-300 font-medium">
              Enter Owner Passcode to unlock Dokan ERP & POS
            </p>
            <p className="text-[11px] text-slate-500">
              Restricted to shop manager, cashier, and staff.
            </p>
          </div>

          {/* PIN Display Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                maxLength={8}
                value={pin || ''}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-widest font-mono font-bold py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-950/40 border border-rose-800/40 p-2 rounded-xl justify-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Numeric Keypad for fast touch screen / counter usage */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold font-mono text-slate-200 transition-colors active:scale-95 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold font-mono text-slate-200 transition-colors active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Default PIN: <strong className="text-slate-300 font-mono">1234</strong></span>
            <button
              type="button"
              onClick={() => {
                setPin('1234');
                setErrorMsg('');
              }}
              className="text-purple-400 hover:underline cursor-pointer"
            >
              Auto-fill PIN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
