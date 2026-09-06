import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Gift, 
  CheckCircle2, 
  Sparkles,
  Truck,
  ArrowRight,
  Scissors,
  Calendar,
  Clock,
  Bell,
  LogOut,
  LogIn,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/initialData';
import { SamsungEmoji } from './SamsungEmoji';

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

  // Sign-in form state for logged out mode
  const [inputPhone, setInputPhone] = useState('01854-444344');
  const [inputName, setInputName] = useState('Tanvir Ahmed');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhone.trim()) return;
    loginUser({
      phone: inputPhone.trim(),
      name: inputName.trim() || 'Pet Parent',
      isLoggedIn: true
    });
  };

  const handleDemoLogin = () => {
    loginUser({
      name: 'Tanvir Ahmed',
      phone: '01854-444344',
      email: 'tanvir.petcare@gmail.com',
      city: "Cox's Bazar Municipality",
      isLoggedIn: true
    });
  };

  // Find all appointments that match this user's phone or name
  const cleanPhone = currentUser.phone.replace(/\D/g, '');
  const cleanName = currentUser.name.trim().toLowerCase();
  
  const userAllAppointments = appointments.filter(apt => {
    const aptPhone = (apt.ownerPhone || '').replace(/\D/g, '');
    const aptName = (apt.ownerName || '').trim().toLowerCase();
    return (
      (cleanPhone.length >= 6 && aptPhone.length >= 6 && (cleanPhone.includes(aptPhone) || aptPhone.includes(cleanPhone))) ||
      (cleanName.length >= 3 && aptName.includes(cleanName))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-800/80 border border-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              {currentUser.isLoggedIn ? (
                <>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Hello {currentUser.name}!</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                      VIP Silver
                    </span>
                  </h2>
                  <p className="text-xs text-purple-200">Cox's Bazar Pet Shop & Care Member</p>
                </>
              ) : (
                <>
                  <h2 className="text-base font-bold text-white">Pet Parent Account</h2>
                  <p className="text-xs text-purple-200">Sign in to view orders & appointment reminders</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.isLoggedIn ? (
              <button
                type="button"
                onClick={logoutUser}
                title="Log out of account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-purple-200 hover:text-red-200 border border-white/10 text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            ) : null}

            <button 
              onClick={onClose}
              className="p-1.5 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-100 bg-purple-50/50 text-xs font-semibold px-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'account' 
                ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Account & Orders</span>
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
            <span>Care & Grooming</span>
            {currentUser.isLoggedIn && upcomingGroomingAppointments.length > 0 && (
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
            <span>Privilege Club (VIP)</span>
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
            <span>Gift Cards & Vouchers</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-700">
          
          {/* If Logged Out: Show Sign-In Gateway */}
          {!currentUser.isLoggedIn ? (
            <div className="py-4 space-y-5">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto border border-purple-200">
                  <LogIn className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sign in to your account</h3>
                <p className="text-xs text-slate-500">
                  Log in to access your order history, manage pet profiles, and receive local reminder notifications for upcoming grooming appointments.
                </p>
              </div>

              {/* Demo 1-Click Quick Login */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Quick Demo Login</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-semibold px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-xs text-slate-600">
                  Sign in directly as <strong>Tanvir Ahmed</strong> (01854-444344) with active upcoming grooming appointment for Milo (Cat).
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Log in as Tanvir Ahmed (Milo's Grooming Reminder)</span>
                </button>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">Or sign in with your phone number:</div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    placeholder="e.g. 01854-444344"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign In to Account
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Care & Grooming Tab */}
              {activeTab === 'grooming' && (
                <div className="space-y-6">
                  {/* Reminder Banner Alert */}
                  {upcomingGroomingAppointments.length > 0 ? (
                    <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-950 text-sm flex items-center gap-2">
                            <span>You have {upcomingGroomingAppointments.length} upcoming grooming reminder!</span>
                          </h4>
                          <p className="text-xs text-purple-800 mt-0.5">
                            Our local notification toast actively alerts you when you're logged into your account.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={triggerGroomingReminderCheck}
                        className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Show Toast Reminder</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-xs text-slate-600">
                        <Scissors className="w-4 h-4 text-purple-600" />
                        <span>No grooming sessions scheduled for the next 14 days.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openBookingModalForService();
                        }}
                        className="px-3 py-1.5 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
                      >
                        Book Grooming
                      </button>
                    </div>
                  )}

                  {/* Appointments List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        <span>Your Scheduled Appointments ({userAllAppointments.length})</span>
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
                        <span>Book New Service</span>
                      </button>
                    </div>

                    {userAllAppointments.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                        <Scissors className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs text-slate-500">You haven't booked any grooming or pet care appointments yet.</p>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            openBookingModalForService();
                          }}
                          className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors cursor-pointer"
                        >
                          Book Basic Grooming & Spa
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userAllAppointments.map((apt) => {
                          const isUpcoming = upcomingGroomingAppointments.some(u => u.id === apt.id);
                          return (
                            <div 
                              key={apt.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isUpcoming 
                                  ? 'bg-purple-50/40 border-purple-200 shadow-xs' 
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
                                    <SamsungEmoji emoji={apt.petType === 'cat' ? '🐱' : '🐶'} size="md" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-slate-900 text-sm">
                                        {apt.petName}
                                      </h4>
                                      <span className="capitalize text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                        {apt.petType}
                                      </span>
                                      {isUpcoming && (
                                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-600 text-white flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                          <span>Upcoming Reminder Active</span>
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs font-semibold text-purple-700 mt-0.5">
                                      {apt.serviceName}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                  apt.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>

                              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-4 text-slate-600">
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Date: <strong>{apt.preferredDate}</strong></span>
                                  </span>
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Time: <strong>{apt.preferredTime}</strong></span>
                                  </span>
                                </div>

                                {isUpcoming && (
                                  <button
                                    type="button"
                                    onClick={triggerGroomingReminderCheck}
                                    className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Bell className="w-3 h-3" />
                                    <span>Preview Reminder Toast</span>
                                  </button>
                                )}
                              </div>

                              {apt.notes && (
                                <p className="mt-2 text-xs text-slate-500 bg-white p-2 rounded-xl border border-slate-100 italic">
                                  "{apt.notes}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account & Orders Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  
                  {/* Profile Card */}
                  <div className="bg-purple-50/40 rounded-xl p-4 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">Contact Details</span>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{currentUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{currentUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{currentUser.city}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          setIsOrderTrackOpen(true);
                        }}
                        className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5 text-purple-200" />
                        <span>Track Active Order</span>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          setIsCartOpen(true);
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>View Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Grooming Quick Widget if exists */}
                  {upcomingGroomingAppointments.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Scissors className="w-4 h-4 text-purple-700" />
                        <div>
                          <strong className="text-purple-950 block">
                            {upcomingGroomingAppointments[0].petName}'s Grooming is coming up ({upcomingGroomingAppointments[0].preferredDate})
                          </strong>
                          <span className="text-slate-500 text-[11px]">
                            {upcomingGroomingAppointments[0].serviceName} at {upcomingGroomingAppointments[0].preferredTime}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('grooming')}
                        className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Order History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-700" />
                        <span>Recent Orders ({(orders || []).length})</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {(orders || []).slice(0, 3).map((ord) => (
                        <div 
                          key={ord.id} 
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex items-center justify-between gap-3 text-xs"
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
                            <p className="text-slate-500 truncate">
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
                  </div>

                </div>
              )}

              {/* Privilege Club Tab */}
              {activeTab === 'privilege' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white rounded-2xl p-5 border border-purple-800 shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                          Cox's Bazar Pet Shop
                        </span>
                        <h3 className="text-xl font-black mt-1">Privilege Club VIP</h3>
                        <p className="text-xs text-purple-200 mt-0.5">Exclusive membership for registered pet parents</p>
                      </div>
                      <div className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs">
                        {currentUser.membershipPoints} Points
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-purple-800/80 flex items-center justify-between text-xs text-purple-200">
                      <span>Cardholder: <strong>{currentUser.name}</strong></span>
                      <span>Discount Level: <strong>Silver 5%</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900">Earn On Every ৳100</strong>
                      <p className="text-slate-500">Get 1 point for every ৳100 spent in store or online.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Gift className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900">Birthday Treat</strong>
                      <p className="text-slate-500">Special free cat or dog toy gift box during your pet's birthday month.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <Truck className="w-4 h-4 text-purple-700" />
                      <strong className="block text-slate-900">Free Delivery Perks</strong>
                      <p className="text-slate-500">Complimentary express municipal delivery on orders above ৳1,500.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gift Cards Tab */}
              {activeTab === 'giftcards' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-purple-950">Active Promo Voucher</h4>
                      <p className="text-xs text-slate-600">Enjoy 10% instant discount on your current pet shopping cart.</p>
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1.5 bg-purple-800 text-white rounded-lg border border-purple-600">
                      CBZPET10
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-2">
                    <p className="flex items-center gap-1.5"><SamsungEmoji emoji="💡" size="xs" /> <span><strong>How to redeem:</strong> Enter promo code <code>CBZPET10</code> during checkout to receive 10% off your purchase.</span></p>
                    <p>For custom digital gift cards for friends and pet rescuers in Cox's Bazar, contact our helpline at <strong>{STORE_INFO.phone}</strong>.</p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need support? Call {STORE_INFO.phone}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
