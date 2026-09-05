import React, { useState } from 'react';
import { X, Search, Truck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { STORE_INFO } from '../data/initialData';

export const OrderTrackModal: React.FC = () => {
  const { isOrderTrackOpen, setIsOrderTrackOpen, orders } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOrderTrackOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchInput.trim().toUpperCase();

    const found = orders.find(
      o => o.orderNumber.toUpperCase() === query || o.customerPhone.includes(searchInput.trim())
    );

    setTrackedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-300" />
            <div>
              <h2 className="text-base font-bold">Order Tracking</h2>
              <span className="text-[11px] text-purple-200">Cox's Bazar Pet Shop & Care</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsOrderTrackOpen(false);
              setTrackedOrder(null);
              setHasSearched(false);
            }}
            className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Enter Order Number or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. CBZ-1094 or 01854444344"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs uppercase font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </button>
            </div>
            {/* Quick example click */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>Try sample:</span>
              <button
                type="button"
                onClick={() => {
                  const sampleNum = orders[0]?.orderNumber || 'CBZ-1094';
                  setSearchInput(sampleNum);
                  const o = orders[0];
                  if (o) setTrackedOrder(o);
                  setHasSearched(true);
                }}
                className="text-purple-700 font-semibold hover:underline cursor-pointer"
              >
                #{orders[0]?.orderNumber || 'CBZ-1094'}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {hasSearched && !trackedOrder && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
              <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-slate-900">No Order Found</p>
              <p className="text-[11px] text-slate-500">
                Please check the order number or contact our helpline: <strong>{STORE_INFO.phone}</strong>.
              </p>
            </div>
          )}

          {trackedOrder && (
            <div className="space-y-5">
              {/* Order Info Card */}
              <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Order ID</span>
                    <span className="text-sm font-black text-purple-950">{trackedOrder.orderNumber}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    trackedOrder.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    trackedOrder.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                    trackedOrder.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {trackedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer:</span>
                    <strong className="text-slate-900 font-semibold">{trackedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone:</span>
                    <strong className="text-slate-900 font-semibold">{trackedOrder.customerPhone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Address:</span>
                    <span className="text-slate-800">{trackedOrder.deliveryAddress}, {trackedOrder.city}</span>
                  </div>
                </div>
              </div>

              {/* Visual Step Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">Delivery Status</h4>
                <div className="relative pl-6 border-l-2 border-purple-600 space-y-4 text-xs">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-purple-700 border-2 border-white flex items-center justify-center text-white text-[9px]">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Order Confirmed</strong>
                      <span className="text-[11px] text-slate-400">Received and verified at Cox's Bazar Pet Shop center</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${
                      ['Processing', 'Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                        ? 'bg-purple-700'
                        : 'bg-slate-300'
                    }`}>
                      {['Processing', 'Shipped', 'Delivered'].includes(trackedOrder.orderStatus) ? '✓' : ''}
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Carefully Packed</strong>
                      <span className="text-[11px] text-slate-400">Authentic seal checked and parcel prepared</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${
                      ['Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                        ? 'bg-purple-700'
                        : 'bg-slate-300'
                    }`}>
                      {['Shipped', 'Delivered'].includes(trackedOrder.orderStatus) ? '✓' : ''}
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Handed to Rider (Out for Delivery)</strong>
                      <span className="text-[11px] text-slate-400">Delivery rider is on the way to your address</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${
                      trackedOrder.orderStatus === 'Delivered'
                        ? 'bg-purple-700'
                        : 'bg-slate-300'
                    }`}>
                      {trackedOrder.orderStatus === 'Delivered' ? '✓' : ''}
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Delivered & Payment Received</strong>
                      <span className="text-[11px] text-slate-400">Package handed over to customer successfully</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2 pt-2 border-t border-purple-100">
                <span className="text-xs font-semibold text-slate-700">Parcel Items ({(trackedOrder.items || []).length}):</span>
                <div className="space-y-1.5">
                  {(trackedOrder.items || []).map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-600 bg-purple-50/30 border border-purple-100 p-2 rounded-xl">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <img src={it.image} alt={it.title} className="w-6 h-6 object-cover rounded" />
                        <span className="truncate">{it.title}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">x{it.quantity} (৳{it.price * it.quantity})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
