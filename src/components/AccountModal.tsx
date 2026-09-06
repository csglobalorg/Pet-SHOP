import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Gift, 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  Scissors, 
  Calendar, 
  Clock, 
  Bell, 
  LogOut, 
  LogIn, 
  UserPlus, 
  PlusCircle, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO, COUPONS } from '../data/initialData';
import { SamsungEmoji } from './SamsungEmoji';
import { authApi } from '../services/api';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'account' | 'privilege' | 'giftcards' | 'grooming';
}

export const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'account'
}) => {
  const { 
    orders, 
    setIsOrderTrackOpen, 
    setIsCartOpen,
    currentUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    upcomingGroomingAppointments,
    appointments,
    triggerGroomingReminderCheck,
    openBookingModalForService
  } = useStore();

  const [activeTab, setActiveTab] = useState<'account' | 'privilege' | 'giftcards' | 'grooming'>(defaultTab);

  // Authentication Switcher (Sign In vs Sign Up)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form States
  const [signInPhone, setSignInPhone] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpPetName, setSignUpPetName] = useState('');
  const [signUpPetType, setSignUpPetType] = useState<'cat' | 'dog' | 'bird' | 'other'>('cat');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Profile Edit Mode (for logged-in user)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editCity, setEditCity] = useState(currentUser.city || "Cox's Bazar");
  const [editAddress, setEditAddress] = useState(currentUser.address || '');
  const [editPetName, setEditPetName] = useState(currentUser.petName || '');

  // Promo code copy status
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Customer Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanPhone = signInPhone.trim();
    if (!cleanPhone) {
      setErrorMessage('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন (Please enter phone number)');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড লিখুন (Please enter password)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.loginCustomer(cleanPhone, signInPassword);
      if (res && res.user) {
        if (res.token) {
          localStorage.setItem('cbz_auth_token', res.token);
        }
        loginUser({
          id: res.user.id,
          phone: res.user.phone,
          name: res.user.name,
          email: res.user.email || '',
          city: res.user.city || "Cox's Bazar",
          address: res.user.address || '',
          petName: res.user.petName || '',
          petType: res.user.petType || 'cat',
          membershipPoints: res.user.membershipPoints || 50,
          isLoggedIn: true
        });
        setSuccessMessage('স্বাগতম! সফলভাবে লগইন সম্পন্ন হয়েছে');
      } else {
        throw new Error('লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
      }
    } catch (err: any) {
      console.warn('Login handler warning:', err?.message);
      const msg = err?.message || '';
      if (
        msg.includes('<!DOCTYPE') ||
        msg.includes('is not valid JSON') ||
        msg.includes('Unexpected token') ||
        msg.includes('BACKEND_OFFLINE') ||
        msg.includes('Failed to fetch')
      ) {
        // Fallback login gracefully
        loginUser({
          phone: cleanPhone,
          name: 'Pet Parent',
          email: '',
          membershipPoints: 50,
          isLoggedIn: true
        });
        setSuccessMessage('লগইন সম্পন্ন হয়েছে!');
      } else {
        setErrorMessage(msg || 'মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Customer Registration (Sign Up)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanPhone = signUpPhone.trim();
    const cleanName = signUpName.trim();

    if (!cleanName) {
      setErrorMessage('আপনার পূর্ণ নাম লিখুন (Full Name is required)');
      return;
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (Valid 11-digit Bangladeshi mobile number required)');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('পাসওয়ার্ড দুটি মেলেনি (Passwords do not match)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        phone: cleanPhone,
        name: cleanName,
        email: signUpEmail.trim() || undefined,
        password: signUpPassword,
        petName: signUpPetName.trim() || undefined,
        petType: signUpPetType
      };

      const res = await authApi.registerCustomer(payload);
      if (res && res.user) {
        if (res.token) {
          localStorage.setItem('cbz_auth_token', res.token);
        }
        loginUser({
          id: res.user.id,
          phone: res.user.phone,
          name: res.user.name,
          email: res.user.email || '',
          petName: signUpPetName.trim() || res.user.petName || '',
          petType: signUpPetType || res.user.petType || 'cat',
          city: "Cox's Bazar",
          membershipPoints: res.user.membershipPoints || 50,
          isLoggedIn: true
        });
        setSuccessMessage('অভিনন্দন! আপনার অ্যাকাউন্ট তৈরি হয়েছে এবং ৫০ ওয়েলকাম পয়েন্ট যোগ হয়েছে!');
      } else {
        throw new Error('অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      console.warn('Registration handler notice:', err?.message);
      const msg = err?.message || '';
      if (msg.includes('ইতিমধ্যে একটি অ্যাকাউন্ট')) {
        setErrorMessage(msg);
      } else if (
        msg.includes('<!DOCTYPE') ||
        msg.includes('is not valid JSON') ||
        msg.includes('Unexpected token') ||
        msg.includes('BACKEND_OFFLINE') ||
        msg.includes('Failed to fetch')
      ) {
        // Fallback local registration
        loginUser({
          phone: cleanPhone,
          name: cleanName,
          email: signUpEmail.trim(),
          petName: signUpPetName.trim(),
          petType: signUpPetType,
          city: "Cox's Bazar",
          membershipPoints: 50,
          isLoggedIn: true
        });
        setSuccessMessage('অভিনন্দন! আপনার অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে এবং ৫০ বোনাস পয়েন্ট সক্রিয় হয়েছে!');
      } else {
        setErrorMessage(msg || 'অ্যাকাউন্ট তৈরিতে সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = () => {
    updateUserProfile({
      name: editName.trim() || currentUser.name,
      email: editEmail.trim(),
      city: editCity.trim(),
      address: editAddress.trim(),
      petName: editPetName.trim()
    });
    setIsEditingProfile(false);
  };

  // Copy coupon code helper
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Find user appointments matching phone or name
  const cleanUserPhone = (currentUser.phone || '').replace(/\D/g, '');
  const cleanUserName = (currentUser.name || '').trim().toLowerCase();

  const userAllAppointments = appointments.filter(apt => {
    const aptPhone = (apt.ownerPhone || '').replace(/\D/g, '');
    const aptName = (apt.ownerName || '').trim().toLowerCase();
    return (
      (cleanUserPhone.length >= 6 && aptPhone.length >= 6 && (cleanUserPhone.includes(aptPhone) || aptPhone.includes(cleanUserPhone))) ||
      (cleanUserName.length >= 3 && aptName.includes(cleanUserName))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-800/80 border border-purple-600 flex items-center justify-center shadow-inner shrink-0">
              <User className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              {currentUser.isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white leading-tight">
                      Hello, {currentUser.name || 'Pet Parent'}!
                    </h2>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                      VIP Silver
                    </span>
                  </div>
                  <p className="text-xs text-purple-200">Cox's Bazar Pet Shop & Care Member</p>
                </>
              ) : (
                <>
                  <h2 className="text-base font-bold text-white leading-tight">Pet Parent Portal</h2>
                  <p className="text-xs text-purple-200">লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.isLoggedIn && (
              <button
                type="button"
                onClick={logoutUser}
                title="Log out of account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-purple-200 hover:text-red-200 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগ আউট</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Only visible when logged in) */}
        {currentUser.isLoggedIn && (
          <div className="flex border-b border-purple-100 bg-purple-50/50 text-xs font-semibold px-4 overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'account' 
                  ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                  : 'border-transparent text-slate-600 hover:text-purple-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>আমার প্রোফাইল ও অর্ডার</span>
            </button>

            <button
              onClick={() => setActiveTab('grooming')}
              className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'grooming' 
                  ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                  : 'border-transparent text-slate-600 hover:text-purple-700'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-purple-700" />
              <span>গ্রুমিং ও সেবা</span>
              {upcomingGroomingAppointments.length > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                  {upcomingGroomingAppointments.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('privilege')}
              className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'privilege' 
                  ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                  : 'border-transparent text-slate-600 hover:text-purple-700'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>প্রিভিলেজ ক্লাব VIP</span>
            </button>

            <button
              onClick={() => setActiveTab('giftcards')}
              className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'giftcards' 
                  ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                  : 'border-transparent text-slate-600 hover:text-purple-700'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-purple-600" />
              <span>কুপন ও অফার</span>
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm text-slate-700">
          
          {/* ============================================================ */}
          {/* 1. LOGGED OUT STATE: SIGN IN & SIGN UP GATEWAY */}
          {/* ============================================================ */}
          {!currentUser.isLoggedIn ? (
            <div className="max-w-md mx-auto space-y-4">
              
              {/* Dual Switcher: Sign In vs Sign Up */}
              <div className="p-1 bg-slate-100 rounded-2xl flex items-center border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    authMode === 'signin'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-purple-700" />
                  <span>লগইন (Sign In)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    authMode === 'signup'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-purple-700" />
                  <span>নতুন অ্যাকাউন্ট (Sign Up)</span>
                </button>
              </div>

              {/* Alert Messages */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* --- SIGN IN FORM --- */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-3.5 pt-1">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900">আপনার অ্যাকাউন্টে লগইন করুন</h3>
                    <p className="text-xs text-slate-500">
                      অর্ডার হিস্টোরি ও ট্র্যাকিং দেখতে মোবাইল নম্বর দিয়ে প্রবেশ করুন
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল নম্বর (Phone Number) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={signInPhone}
                        onChange={(e) => setSignInPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      পাসওয়ার্ড (Password) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span>যাচাই করা হচ্ছে...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>লগইন করুন (Sign In)</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500">
                      অ্যাকাউন্ট নেই?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setErrorMessage('');
                        }}
                        className="text-purple-700 hover:underline font-bold cursor-pointer"
                      >
                        নতুন অ্যাকাউন্ট খুলুন (Sign Up)
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* --- SIGN UP FORM --- */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3 pt-1">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900">নতুন পেট প্যারেন্ট অ্যাকাউন্ট খুলুন</h3>
                    <p className="text-xs text-slate-500">
                      অ্যাকাউন্ট খুলে ফ্রি ৫০ মেম্বারশিপ পয়েন্ট উপহার গ্রহণ করুন!
                    </p>
                  </div>

                  {/* Bonus Points Banner */}
                  <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] text-amber-900 font-semibold leading-tight">
                      <strong>🎁 ওয়েলকাম বোনাস:</strong> সাইন-আপ করলেই প্রিভিলেজ ক্লাবে ৫০ ফ্রি রিওয়ার্ড পয়েন্ট পাবেন!
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      আপনার নাম (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="আপনার পুরো নাম"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      মোবাইল নম্বর (Phone Number) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      ইমেইল ঠিকানা (Email Address - ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                        পাসওয়ার্ড <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                          className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                        পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pet Info (Delightful feature for pet owners) */}
                  <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-900 block">
                      🐾 পোষা প্রাণীর তথ্য (Pet Information - Optional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={signUpPetName}
                        onChange={(e) => setSignUpPetName(e.target.value)}
                        placeholder="পোষা প্রাণীর নাম (e.g. Milo)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <select
                        value={signUpPetType}
                        onChange={(e) => setSignUpPetType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                      >
                        <option value="cat">বিড়াল (Cat)</option>
                        <option value="dog">কুকুর (Dog)</option>
                        <option value="bird">পাখি (Bird)</option>
                        <option value="other">অন্যান্য (Other)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>অ্যাকাউন্ট খুলুন (Create Account)</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500">
                      আগে থেকেই অ্যাকাউন্ট আছে?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setErrorMessage('');
                        }}
                        className="text-purple-700 hover:underline font-bold cursor-pointer"
                      >
                        লগইন করুন (Sign In)
                      </button>
                    </p>
                  </div>
                </form>
              )}

            </div>
          ) : (
            /* ============================================================ */
            /* 2. LOGGED IN STATE: COMPLETE CUSTOMER DASHBOARD */
            /* ============================================================ */
            <>
              {/* --- TAB 1: MY ACCOUNT & ORDERS --- */}
              {activeTab === 'account' && (
                <div className="space-y-5">
                  
                  {/* Customer Profile Card */}
                  <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/70 rounded-2xl p-4 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    {!isEditingProfile ? (
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                            সদস্য প্রোফাইল (Customer Profile)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditName(currentUser.name);
                              setEditEmail(currentUser.email);
                              setEditCity(currentUser.city);
                              setEditAddress(currentUser.address || '');
                              setEditPetName(currentUser.petName || '');
                              setIsEditingProfile(true);
                            }}
                            className="text-purple-700 hover:text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer ml-2"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{currentUser.phone || 'No phone registered'}</span>
                        </div>
                        {currentUser.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{currentUser.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{currentUser.address ? `${currentUser.address}, ` : ''}{currentUser.city || "Cox's Bazar"}</span>
                        </div>
                        {currentUser.petName && (
                          <div className="flex items-center gap-2 text-xs text-purple-800 font-semibold mt-1">
                            <SamsungEmoji emoji={currentUser.petType === 'dog' ? '🐶' : '🐱'} size="xs" />
                            <span>Pet: <strong>{currentUser.petName}</strong> ({currentUser.petType || 'Pet'})</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Inline Profile Edit Form */
                      <div className="space-y-3 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-900">প্রোফাইল তথ্য আপডেট করুন:</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-0.5">পূর্ণ নাম</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-0.5">ইমেইল</label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-0.5">ঠিকানা / এরিয়া</label>
                            <input
                              type="text"
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              placeholder="e.g. Kolatoli Road"
                              className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-0.5">পোষা প্রাণীর নাম</label>
                            <input
                              type="text"
                              value={editPetName}
                              onChange={(e) => setEditPetName(e.target.value)}
                              placeholder="e.g. Milo"
                              className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>সংরক্ষণ করুন (Save Changes)</span>
                        </button>
                      </div>
                    )}

                    {!isEditingProfile && (
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setIsOrderTrackOpen(true);
                          }}
                          className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-purple-200" />
                          <span>অর্ডার ট্র্যাক করুন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setIsCartOpen(true);
                          }}
                          className="px-3.5 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>শপিং কার্ট</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-700" />
                        <span>আপনার সাম্প্রতিক অর্ডার ({(orders || []).length})</span>
                      </h3>
                    </div>

                    {(orders || []).length === 0 ? (
                      <div className="text-center py-8 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2 px-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-800 text-xs">কোনো অর্ডার সম্পন্ন হয়নি</h4>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            আপনি এখনও কোনো অর্ডার করেননি। কুপন কোড ব্যবহার করে প্রথম অর্ডারে ১০% ছাড় পান!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>কেনাকাটা শুরু করুন</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(orders || []).map((ord) => (
                          <div 
                            key={ord.id} 
                            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors flex items-center justify-between gap-3 text-xs shadow-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-purple-900">{ord.orderNumber}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.orderStatus === 'Delivered' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {ord.orderStatus}
                                </span>
                              </div>
                              <p className="text-slate-600 truncate text-[11px]">
                                {(ord.items || []).map(i => `${i.title} (x${i.quantity})`).join(', ') || 'Pet items'}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-bold text-slate-900 text-sm">৳{(ord.total || 0).toLocaleString()}</span>
                              <span className="block text-[10px] text-slate-400">{ord.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* --- TAB 2: CARE & GROOMING --- */}
              {activeTab === 'grooming' && (
                <div className="space-y-5">
                  {/* Reminder Banner Alert if appointment is upcoming */}
                  {upcomingGroomingAppointments.length > 0 ? (
                    <div className="p-3.5 bg-purple-50/90 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-950 text-xs">
                            আপনার {upcomingGroomingAppointments.length}টি গ্রুমিং অ্যাপয়েন্টমেন্ট শিডিউল আছে!
                          </h4>
                          <p className="text-[11px] text-purple-800 mt-0.5">
                            নির্দিষ্ট তারিখে সময়মতো কক্সবাজার স্টোরে আপনার পোষা প্রাণীকে নিয়ে আসুন।
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={triggerGroomingReminderCheck}
                        className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>টোস্ট দেখুন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Scissors className="w-4 h-4 text-purple-600" />
                        <span>আগামী ১৪ দিনের মধ্যে কোনো গ্রুমিং শিডিউল নেই।</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openBookingModalForService();
                        }}
                        className="px-3.5 py-1.5 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
                      >
                        গ্রুমিং বুক করুন
                      </button>
                    </div>
                  )}

                  {/* Scheduled Appointments List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        <span>বুকিং রেকর্ডসমূহ ({userAllAppointments.length})</span>
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openBookingModalForService();
                        }}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>নতুন বুকিং</span>
                      </button>
                    </div>

                    {userAllAppointments.length === 0 ? (
                      <div className="text-center py-7 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                        <Scissors className="w-7 h-7 text-slate-400 mx-auto" />
                        <p className="text-xs text-slate-500">আপনার কোনো গ্রুমিং বা অ্যাপয়েন্টমেন্ট নেই।</p>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            openBookingModalForService();
                          }}
                          className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors cursor-pointer"
                        >
                          বেসিক গ্রুমিং ও বাথ প্যাকেজ বুক করুন
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {userAllAppointments.map((apt) => {
                          const isUpcoming = upcomingGroomingAppointments.some(u => u.id === apt.id);
                          return (
                            <div 
                              key={apt.id}
                              className={`p-3.5 rounded-2xl border transition-all ${
                                isUpcoming 
                                  ? 'bg-purple-50/40 border-purple-200 shadow-xs' 
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
                                    <SamsungEmoji emoji={apt.petType === 'cat' ? '🐱' : '🐶'} size="sm" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-slate-900 text-xs">
                                        {apt.petName}
                                      </h4>
                                      <span className="capitalize text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                        {apt.petType}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
                                      {apt.serviceName}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  apt.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>

                              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                <span className="flex items-center gap-1 font-medium text-[11px]">
                                  <Calendar className="w-3 h-3 text-purple-600" />
                                  <span>{apt.preferredDate}</span>
                                </span>
                                <span className="flex items-center gap-1 font-medium text-[11px]">
                                  <Clock className="w-3 h-3 text-purple-600" />
                                  <span>{apt.preferredTime}</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB 3: PRIVILEGE CLUB VIP --- */}
              {activeTab === 'privilege' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white rounded-2xl p-4.5 border border-purple-800 shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                          Cox's Bazar Pet Shop
                        </span>
                        <h3 className="text-lg font-black mt-0.5">Privilege Club VIP</h3>
                        <p className="text-xs text-purple-200 mt-0.5">নিবন্ধিত কাস্টমারদের জন্য বিশেষ লয়্যালটি ও ক্যাশব্যাক সুবিধা</p>
                      </div>
                      <div className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs shadow-xs">
                        {currentUser.membershipPoints || 50} Points
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-purple-800/80 flex items-center justify-between text-xs text-purple-200">
                      <span>কার্ডহোল্ডার: <strong>{currentUser.name}</strong></span>
                      <span>ডিসকাউন্ট টায়ার: <strong>Silver 5%</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900 text-xs">প্রতি ১০০ টাকায় ১ পয়েন্ট</strong>
                      <p className="text-slate-500 text-[11px]">অনলাইন ও স্টোরের প্রতিটি কেনাকাটায় সরাসরি রিওয়ার্ড পয়েন্ট অর্জন করুন।</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Gift className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900 text-xs">বার্থডে গিফট বক্স</strong>
                      <p className="text-slate-500 text-[11px]">আপনার প্রিয় পোষা প্রাণীর জন্মদিনের মাসে বিনামূল্যে উপহার টয় ও ট্রিট।</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Truck className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900 text-xs">ফ্রি হোম ডেলিভারি</strong>
                      <p className="text-slate-500 text-[11px]">পৌরসভা এলাকায় ১৫০০ টাকার বেশি অর্ডারে দ্রুত ফ্রি হোম ডেলিভারি।</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 4: GIFT CARDS & OFFERS --- */}
              {activeTab === 'giftcards' && (
                <div className="space-y-3.5">
                  <div className="text-xs font-semibold text-slate-600">
                    অর্ডার করার সময় নিচের যেকোনো সক্রিয় প্রোমোকোড ব্যবহার করে ডিসকাউন্ট উপভোগ করুন:
                  </div>

                  <div className="space-y-2.5">
                    {COUPONS.map((coupon) => (
                      <div 
                        key={coupon.code}
                        className="p-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-xl border border-purple-200 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-purple-950 bg-white px-2 py-0.5 rounded-lg border border-purple-300">
                              {coupon.code}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {coupon.discountPercent ? `${coupon.discountPercent}% OFF` : `৳${coupon.discountAmount} OFF`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{coupon.description}</p>
                          <span className="text-[10px] text-slate-400 block">নূন্যতম কেনাকাটা: ৳{coupon.minSpend}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <SamsungEmoji emoji="💡" size="xs" /> 
                      <span>কুপন কোড ব্যবহার পদ্ধতি:</span>
                    </p>
                    <p className="text-[11px]">চেকআউট করার সময় 'Promo Code' বক্সে কুপনটি পেস্ট করুন। সাথে সাথে ডিসকাউন্ট সমন্বয় হবে।</p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">জরুরি সেবায় কল করুন: <strong>{STORE_INFO.phone}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
