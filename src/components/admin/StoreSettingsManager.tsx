import React, { useState } from 'react';
import { 
  Sliders, 
  Store, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Truck, 
  Tag, 
  Megaphone, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Percent, 
  DollarSign, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon, StoreSettings } from '../../types';

export const StoreSettingsManager: React.FC = () => {
  const { storeSettings, updateStoreSettings, addCoupon, deleteCoupon, toggleCoupon } = useStore();
  
  const [formData, setFormData] = useState<StoreSettings>({ ...storeSettings });
  const [isSavedToast, setIsSavedToast] = useState(false);

  // New Coupon Form Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountPercent: 10,
    discountAmount: undefined,
    minSpend: 1000,
    description: '',
    isActive: true
  });
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code?.trim()) {
      alert('Please enter a valid coupon code.');
      return;
    }

    const created: Coupon = {
      code: newCoupon.code.trim().toUpperCase(),
      discountPercent: couponType === 'percent' ? Number(newCoupon.discountPercent) || 10 : undefined,
      discountAmount: couponType === 'fixed' ? Number(newCoupon.discountAmount) || 50 : undefined,
      minSpend: Number(newCoupon.minSpend) || 0,
      description: newCoupon.description?.trim() || `${couponType === 'percent' ? `${newCoupon.discountPercent}%` : `৳${newCoupon.discountAmount}`} off`,
      isActive: true
    };

    addCoupon(created);
    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      discountPercent: 10,
      minSpend: 1000,
      description: '',
      isActive: true
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Store Global Settings & Configurations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure store contacts, top marquee announcement, delivery fees, and discount promo coupons
              </p>
            </div>
          </div>
        </div>

        {isSavedToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: Store Contact & Location Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              1. Shop Profile & Customer Helplines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Store Business Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-purple-600" />
                <span>Primary Helpline Phone</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Display Number</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                WhatsApp Digits (e.g. 8801854444344)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappDigits}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappDigits: e.target.value.replace(/\D/g, '') }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Support Email</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Operating Hours</span>
              </label>
              <input
                type="text"
                required
                value={formData.operatingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Store Physical Address</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Top Marquee Announcement Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                2. Top Notice & Announcement Marquee
              </h3>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-slate-600">Show Announcement:</span>
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnnouncementActive: e.target.checked }))}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Top Header Notice Text (Visible to all visitors)
            </label>
            <input
              type="text"
              value={formData.announcementNotice}
              onChange={(e) => setFormData(prev => ({ ...prev, announcementNotice: e.target.value }))}
              placeholder="e.g. ⚡ কক্সবাজার সদরে ফ্রি হোম ডেলিভারি (১৫০০ টাকার অর্ডারে) • হেল্পলাইন: 01854-444344"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            {/* Live Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Live Storefront Preview:</span>
              <div className="bg-[#4a154b] text-white text-xs px-3 py-2 rounded-xl border border-[#3c103d] flex items-center justify-between">
                <span>{formData.announcementNotice || 'No announcement set'}</span>
                <span className="text-[10px] text-purple-200/80 bg-purple-900/50 px-2 py-0.5 rounded">Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Charges & Shipping Policy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Delivery Charges & Free Shipping Threshold
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <label className="text-xs font-semibold text-slate-700">
                Inside Cox's Bazar Delivery (৳)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.deliveryFeeInside}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryFeeInside: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-slate-500">Default: ৳50</span>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <label className="text-xs font-semibold text-slate-700">
                Outside / Sub-district Delivery (৳)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.deliveryFeeOutside}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryFeeOutside: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-slate-500">Ramu, Teknaf, Chakaria: ৳120</span>
            </div>

            <div className="space-y-1 bg-purple-50/70 p-3 rounded-xl border border-purple-100">
              <label className="text-xs font-extrabold text-purple-950">
                Free Delivery Cart Minimum (৳)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, freeDeliveryThreshold: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm font-extrabold text-purple-900 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-purple-700">Orders equal or above this get ৳0 delivery</span>
            </div>

          </div>
        </div>

        {/* Section 4: Discount & Promo Coupons */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                4. Discount Promo Codes & Coupons
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsCouponModalOpen(true)}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(storeSettings.coupons || []).map((c) => (
              <div
                key={c.code}
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-2 transition-all ${
                  c.isActive !== false ? 'bg-purple-50/50 border-purple-200' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-purple-950 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {c.discountPercent ? `${c.discountPercent}% OFF` : `৳${c.discountAmount} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5">
                    {c.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Min spend: ৳{c.minSpend}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleCoupon(c.code)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      c.isActive !== false ? 'bg-purple-200 text-purple-900' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c.isActive !== false ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete coupon "${c.code}"?`)) {
                        deleteCoupon(c.code);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Save Button Bar */}
        <div className="sticky bottom-4 bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4 z-20">
          <div>
            <span className="font-bold text-xs sm:text-sm block">
              Save All Configuration Updates
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Changes take effect immediately across all customer store pages.
            </span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-950/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Create Discount Promo Code
              </h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EID50, PETLOVE"
                  value={newCoupon.code || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCouponType('percent')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponType === 'percent' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  % Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setCouponType('fixed')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponType === 'fixed' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  ৳ Flat BDT
                </button>
              </div>

              {couponType === 'percent' ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={newCoupon.discountPercent ?? 10}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Discount Amount (৳ BDT)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newCoupon.discountAmount ?? 50}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Minimum Spend (৳ BDT)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCoupon.minSpend ?? 1000}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, minSpend: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% off for Cox's Bazar pet lovers"
                  value={newCoupon.description || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
