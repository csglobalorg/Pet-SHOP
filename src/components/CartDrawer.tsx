import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { COUPONS } from '../data/initialData';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    setIsCheckoutOpen 
  } = useStore();

  const [deliveryRegion, setDeliveryRegion] = useState<'inside' | 'outside'>('inside');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; text: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Free delivery if subtotal >= 1500 for Cox's Bazar
  let deliveryFee = deliveryRegion === 'inside' ? 50 : 100;
  if (deliveryRegion === 'inside' && subtotal >= 1500) {
    deliveryFee = 0;
  }

  // Handle coupon discount
  let discount = appliedCoupon ? appliedCoupon.discount : 0;
  if (appliedCoupon && subtotal < 500) {
    discount = 0;
  }

  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');

    const found = COUPONS.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid voucher code. Try: CBZPET10 or PET50');
      return;
    }

    if (subtotal < found.minSpend) {
      setCouponError(`This voucher requires a minimum order of ৳${found.minSpend}.`);
      return;
    }

    let calculatedDiscount = 0;
    if (found.discountPercent) {
      calculatedDiscount = Math.round((subtotal * found.discountPercent) / 100);
    } else if (found.discountAmount) {
      calculatedDiscount = found.discountAmount;
    }

    setAppliedCoupon({
      code: found.code,
      discount: calculatedDiscount,
      text: found.description
    });
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              <h2 className="text-base font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-700 mx-auto flex items-center justify-center text-2xl border border-purple-100">
                  🐾
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add nutritious food, treats, toys, or hygiene essentials to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3.5 flex gap-3.5 first:pt-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-100 shrink-0 bg-slate-50"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-purple-700 font-medium">
                          {item.product.brand} {item.product.weightOrSize ? `• ${item.product.weightOrSize}` : ''}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 transition-colors cursor-pointer text-slate-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 transition-colors cursor-pointer text-slate-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-900">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Location Selector */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryRegion('inside')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryRegion === 'inside'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Cox's Bazar Municipality</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {subtotal >= 1500 ? 'Free Delivery (৳0)' : '৳50 Fee'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryRegion('outside')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryRegion === 'outside'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Upazila / Outskirts</div>
                    <div className="text-[10px] text-slate-500 font-normal">৳100 Courier</div>
                  </button>
                </div>
              </div>
            )}

            {/* Coupon Code Input */}
            {cart.length > 0 && (
              <div className="space-y-1.5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Voucher: CBZPET10"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {appliedCoupon.code} applied (-৳{appliedCoupon.discount})
                    </span>
                    <button 
                      onClick={() => setAppliedCoupon(null)}
                      className="text-slate-400 hover:text-red-500 font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Order Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-purple-100 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Voucher Discount ({appliedCoupon.code}):</span>
                    <span>-৳{appliedCoupon.discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700">Free</strong> : `৳${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-purple-700 font-black">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout (৳{finalTotal.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Cash on Delivery and bKash / Nagad payments accepted
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
