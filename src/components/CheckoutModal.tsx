import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, ShieldCheck, MapPin, Phone, User, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { STORE_INFO } from '../data/initialData';
import { SamsungEmoji } from './SamsungEmoji';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    createOrder,
    setActiveView,
    setAdminTab,
    currentUser
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState("Cox's Bazar Municipality");
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  React.useEffect(() => {
    if (currentUser?.isLoggedIn) {
      if (currentUser.name && !name) setName(currentUser.name);
      if (currentUser.phone && !phone) setPhone(currentUser.phone);
      if (currentUser.email && !email) setEmail(currentUser.email);
      if (currentUser.address && !address) setAddress(currentUser.address);
      if (currentUser.city && !city) setCity(currentUser.city);
    }
  }, [currentUser, isCheckoutOpen]);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const getDeliveryFee = () => {
    if (city.includes('Municipality')) {
      return subtotal >= 1500 ? 0 : 50;
    } else if (city.includes('Kolatoli')) {
      return 60;
    } else if (city.includes('Ramu')) {
      return 80;
    } else if (city.includes('Chittagong')) {
      return 100;
    }
    return 120;
  };

  const deliveryFee = getDeliveryFee();
  const discount = 0;
  const total = subtotal - discount + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert('Please provide your name, contact phone number, and delivery address.');
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      sku: item.product.sku,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category
    }));

    const newOrder = createOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      deliveryAddress: address,
      city,
      notes: notes || undefined,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Pending'
    });

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setOrderSuccess(newOrder);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-purple-100 overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-purple-300 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                {orderSuccess ? 'Order Confirmed!' : 'Complete Order (Checkout)'}
              </h2>
              <span className="text-[10px] sm:text-[11px] text-purple-200">Cox's Bazar Pet Shop & Care</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Success Screen */
          <div className="overflow-y-auto p-5 sm:p-8 text-center space-y-4 sm:space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Thank You, {orderSuccess.customerName}!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your order has been received successfully. Our team will contact you shortly to confirm delivery.
              </p>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-3.5 sm:p-4 border border-purple-100 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-purple-100 pb-1.5">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-purple-800 text-sm">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-medium text-slate-800 text-right">{orderSuccess.deliveryAddress}, {orderSuccess.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-medium text-slate-800">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-100 font-bold text-sm">
                <span>Total Payable:</span>
                <span className="text-slate-900 font-black">৳{orderSuccess.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveView('admin');
                  setAdminTab('sales');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>View Order in Admin</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Customer Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-700" />
                  <span>Customer Information</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name || ''}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম লিখুন (e.g. Shakil Ahmed)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={phone || ''}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email || ''}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-700" />
                  <span>Delivery Address</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city || "Cox's Bazar Municipality"}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50"
                    >
                      <option value="Cox's Bazar Municipality">Cox's Bazar Municipality (24-48 hrs - ৳50)</option>
                      <option value="Kolatoli & Sugandha Beach Area">Kolatoli & Sugandha Beach Area (৳60)</option>
                      <option value="Ramu & Ukhiya">Ramu & Ukhiya (৳80)</option>
                      <option value="Chittagong Division">Chittagong Division (৳100)</option>
                      <option value="Other Districts (Nationwide Courier)">Other Districts / Nationwide Courier (৳120)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address & House Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address || ''}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Apartment number, Road, Landmark (e.g. Hotel Motel Zone, Kolatoli Road)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes || ''}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Deliver to 2nd floor reception"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Payment Method
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Cash on Delivery', icon: '💵', desc: 'Pay upon delivery' },
                  { name: 'bKash', icon: '📱', desc: STORE_INFO.phone },
                  { name: 'Nagad', icon: '⚡', desc: STORE_INFO.phone },
                  { name: 'Credit/Debit Card', icon: '💳', desc: 'Visa / Mastercard' }
                ].map((pm) => (
                  <button
                    key={pm.name}
                    type="button"
                    onClick={() => setPaymentMethod(pm.name as PaymentMethod)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === pm.name
                        ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="h-6 flex items-center">
                      <SamsungEmoji emoji={pm.icon} size="md" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">{pm.name}</div>
                    <div className="text-[10px] text-slate-400">{pm.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee ({city.split('(')[0].trim()}):</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">Free</strong> : `৳${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-purple-700">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Order (৳{total.toLocaleString()})</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
