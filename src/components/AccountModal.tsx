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
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/initialData';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'account' | 'privilege' | 'giftcards';
}

export const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'account'
}) => {
  const { orders, wishlist, setIsOrderTrackOpen, setIsCartOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'account' | 'privilege' | 'giftcards'>(defaultTab);

  // Mock guest/logged-in user state
  const [userName, setUserName] = useState('Pet Parent');
  const [userPhone, setUserPhone] = useState('01854-444344');
  const [userEmail, setUserEmail] = useState('petlover@gmail.com');
  const [savedCity, setSavedCity] = useState("Cox's Bazar Municipality");
  const [isEditing, setIsEditing] = useState(false);
  const [membershipPoints] = useState(450);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-800/80 border border-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Hello {userName}!</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  VIP Silver
                </span>
              </h2>
              <p className="text-xs text-purple-200">Cox's Bazar Pet Shop & Care Member</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-100 bg-purple-50/50 text-xs font-semibold px-4">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'account' 
                ? 'border-purple-700 text-purple-800 font-bold bg-white' 
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Account & Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('privilege')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
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
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
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
          
          {activeTab === 'account' && (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-purple-50/40 rounded-xl p-4 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">Contact Details</span>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{userPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{savedCity}</span>
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
                    450 Points
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-800/80 flex items-center justify-between text-xs text-purple-200">
                  <span>Cardholder: <strong>{userName}</strong></span>
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
                <p>💡 <strong>How to redeem:</strong> Enter promo code <code>CBZPET10</code> during checkout to receive 10% off your purchase.</p>
                <p>For custom digital gift cards for friends and pet rescuers in Cox's Bazar, contact our helpline at <strong>{STORE_INFO.phone}</strong>.</p>
              </div>
            </div>
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
