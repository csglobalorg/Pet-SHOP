import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Scan, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  RotateCcw, 
  Printer, 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  User, 
  PauseCircle, 
  PlayCircle, 
  Layers, 
  Sparkles, 
  Percent, 
  DollarSign, 
  X,
  Clock,
  Check,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, AnimalType, PaymentMethod, Order } from '../../types';

interface POSCartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

interface ParkedBill {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string;
  items: POSCartItem[];
  notes?: string;
}

export const POSTerminal: React.FC = () => {
  const { products, orders, createOrder, restockProduct } = useStore();

  // POS Active State
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('all');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Customer info
  const [customerType, setCustomerType] = useState<'walkin' | 'member'>('walkin');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('018XXXXXXXX');
  const [petDetails, setPetDetails] = useState('');
  const [isVipMember, setIsVipMember] = useState(false);

  // Pricing Adjustments
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [vatEnabled, setVatEnabled] = useState<boolean>(false); // 5% VAT if enabled

  // Payment Tender
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [tenderedAmount, setTenderedAmount] = useState<number | ''>('');
  const [trxId, setTrxId] = useState('');
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);
  const [splitDigitalAmount, setSplitDigitalAmount] = useState<number>(0);

  // Parked Bills (Hold Bill queue)
  const [parkedBills, setParkedBills] = useState<ParkedBill[]>([]);
  const [isParkedModalOpen, setIsParkedModalOpen] = useState(false);

  // Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastChangeReturned, setLastChangeReturned] = useState<number>(0);

  // Focus ref for quick barcode scanner
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto focus barcode input on mount and on key shortcuts
  useEffect(() => {
    barcodeInputRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 or '/' to focus barcode
      if (e.key === 'F2' || (e.key === '/' && (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA'))) {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Products for quick grid
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedAnimal !== 'all' && p.animalType !== selectedAnimal && p.animalType !== 'all') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchBrand) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedAnimal, searchQuery]);

  // Add product to POS Cart
  const handleAddToCart = (product: Product, qty: number = 1) => {
    if (product.stock <= 0) {
      alert(`⚠️ "${product.title}" is currently out of stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(qty, product.stock) }];
      }
    });

    // Beep / subtle audio cue for scanner feel (silent fallback)
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // audio context not allowed without interaction
    }
  };

  // Barcode / SKU scan submit
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const query = barcodeInput.trim().toLowerCase();
    const matchedProduct = products.find(
      p => p.sku.toLowerCase() === query || 
           p.id.toLowerCase() === query || 
           p.title.toLowerCase().includes(query)
    );

    if (matchedProduct) {
      handleAddToCart(matchedProduct, 1);
      setBarcodeInput('');
    } else {
      alert(`No product found matching SKU or title: "${barcodeInput}". Please verify barcode or name.`);
    }
  };

  // Update quantity
  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const updated = item.quantity + delta;
          if (updated <= 0) return null;
          const capped = Math.min(updated, item.product.stock);
          return { ...item, quantity: capped };
        }
        return item;
      }).filter(Boolean) as POSCartItem[];
    });
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Financial Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, it) => sum + (it.customPrice || it.product.price) * it.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (isVipMember && discountValue === 0) {
      // Auto 5% VIP member discount
      return Math.round(subtotal * 0.05);
    }
    if (discountType === 'percent') {
      return Math.round((subtotal * (discountValue || 0)) / 100);
    }
    return Math.min(discountValue || 0, subtotal);
  }, [subtotal, discountType, discountValue, isVipMember]);

  const vatAmount = useMemo(() => {
    if (!vatEnabled) return 0;
    return Math.round((subtotal - discountAmount) * 0.05);
  }, [subtotal, discountAmount, vatEnabled]);

  const grandTotal = useMemo(() => {
    const total = subtotal - discountAmount + vatAmount + (deliveryCharge || 0);
    return Math.max(0, total);
  }, [subtotal, discountAmount, vatAmount, deliveryCharge]);

  // Change Return Calculation
  const changeDue = useMemo(() => {
    if (paymentMethod === 'Cash on Delivery' || paymentMethod === 'Credit/Debit Card') {
      if (typeof tenderedAmount === 'number' && tenderedAmount >= grandTotal) {
        return tenderedAmount - grandTotal;
      }
    }
    return 0;
  }, [tenderedAmount, grandTotal, paymentMethod]);

  // Park Bill / Hold
  const handleParkBill = () => {
    if (cart.length === 0) return;
    const newPark: ParkedBill = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || 'Counter Buyer',
      customerPhone: customerPhone || 'N/A',
      items: [...cart],
      notes: petDetails
    };
    setParkedBills(prev => [newPark, ...prev]);
    setCart([]);
    setDiscountValue(0);
    setTenderedAmount('');
    alert(`✅ Invoice has been parked as #${newPark.id}. You can now attend the next customer.`);
  };

  // Restore Parked Bill
  const handleRestoreBill = (parked: ParkedBill) => {
    setCart(parked.items);
    setCustomerName(parked.customerName);
    setCustomerPhone(parked.customerPhone);
    setPetDetails(parked.notes || '');
    setParkedBills(prev => prev.filter(p => p.id !== parked.id));
    setIsParkedModalOpen(false);
  };

  // Quick preset tendered cash amounts
  const setQuickTender = (amt: number) => {
    setTenderedAmount(amt);
  };

  // Complete & Charge Sale
  const handleCompleteSale = (autoPrint: boolean = true) => {
    if (cart.length === 0) {
      alert('⚠️ Register cart is empty! Please add products before checking out.');
      return;
    }

    if (paymentMethod === 'Cash on Delivery' && typeof tenderedAmount === 'number' && tenderedAmount < grandTotal) {
      const confirmShort = window.confirm(`Customer tendered ৳${tenderedAmount}, but total bill is ৳${grandTotal}. Record remaining ৳${grandTotal - tenderedAmount} as customer credit due?`);
      if (!confirmShort) return;
    }

    // Build Order Items
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      sku: item.product.sku,
      title: item.product.title,
      price: item.customPrice || item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category
    }));

    // Create Order in Central Store
    const newOrder = createOrder({
      customerName: customerName || 'Counter Walk-in Customer',
      customerPhone: customerPhone || '018XXXXXXXX',
      customerEmail: 'counter@coxsbazarpet.shop',
      deliveryAddress: 'Counter POS Store Pickup (Kolatoli Road)',
      city: 'Inside Dhaka', // Internal mapped code
      notes: `POS Register Sale. Pet: ${petDetails || 'N/A'}. ${trxId ? `TrxID: ${trxId}` : ''}`,
      items: orderItems,
      subtotal,
      deliveryFee: deliveryCharge,
      discount: discountAmount,
      couponCode: isVipMember ? 'VIP-MEMBER-5' : undefined,
      total: grandTotal,
      paymentMethod: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered'
    });

    setLastChangeReturned(typeof tenderedAmount === 'number' && tenderedAmount > grandTotal ? tenderedAmount - grandTotal : 0);
    setCompletedOrder(newOrder);
    setIsReceiptModalOpen(true);

    // Reset Register for next customer
    setCart([]);
    setDiscountValue(0);
    setDeliveryCharge(0);
    setTenderedAmount('');
    setTrxId('');
    setPetDetails('');
    setCustomerName('Walk-in Customer');
    setCustomerPhone('018XXXXXXXX');
    setIsVipMember(false);

    if (autoPrint) {
      setTimeout(() => {
        // window.print triggers thermal receipt layout
      }, 500);
    }
  };

  // Today's POS summary metrics
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOrders = (orders || []).filter(o => (o.date || '').slice(0, 10) === todayDateStr);
  const todayPosSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const todayCashSales = todayOrders.filter(o => o.paymentMethod === 'Cash on Delivery').reduce((sum, o) => sum + o.total, 0);
  const todayDigitalSales = todayOrders.filter(o => o.paymentMethod !== 'Cash on Delivery').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-4">
      
      {/* POS Top Terminal Header & Shift Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Cox's Bazar Pet Shop • POS Billing Terminal
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  REGISTER 01 ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kolatoli Road Branch • Real-time Barcode Scanning & Instant Thermal Receipt
              </p>
            </div>
          </div>

          {/* Quick Drawer & Shift Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Today's POS Sales</span>
              <span className="font-bold text-emerald-400 text-sm">৳{todayPosSales.toLocaleString()}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Cash in Drawer</span>
              <span className="font-bold text-amber-300 text-sm">৳{todayCashSales.toLocaleString()}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">bKash / Nagad / Card</span>
              <span className="font-bold text-blue-300 text-sm">৳{todayDigitalSales.toLocaleString()}</span>
            </div>

            {/* Parked Bills Button */}
            <button
              onClick={() => setIsParkedModalOpen(true)}
              className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                parkedBills.length > 0
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <PauseCircle className="w-4 h-4" />
              <span>Held Bills</span>
              {parkedBills.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 text-[10px] rounded-full">
                  {parkedBills.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Split Grid: Left Catalog & Scanner (60%), Right Cashier Register (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ================= LEFT: PRODUCT BROWSER & SCANNER ================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Quick Scanner / Barcode Input Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <form onSubmit={handleBarcodeSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Scan className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan Barcode / Enter SKU (e.g. REFLEX-CAT-15KG or press /)..."
                  className="w-full pl-10 pr-24 py-2.5 bg-purple-50/40 border border-purple-200 focus:border-purple-600 focus:bg-white rounded-xl text-xs font-mono font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200">
                  PRESS ↵
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </form>

            {/* Keyword Search & Filters */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter name or brand..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Animal Type Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-[11px]">
                {['all', 'cat', 'dog', 'bird', 'rabbit'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAnimal(type)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                      selectedAnimal === type
                        ? 'bg-purple-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? '🐾 All' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'Pet Food', label: '🥩 Pet Food' },
                { id: 'Litter & Hygiene', label: '🧼 Litter' },
                { id: 'Accessories & Toys', label: '🎾 Toys & Gear' },
                { id: 'Grooming Essentials', label: '✂️ Grooming' },
                { id: 'Healthcare & First Aid', label: '💊 Healthcare' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map(product => {
              const inCartItem = cart.find(c => c.product.id === product.id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleAddToCart(product, 1)}
                  className={`group relative bg-white border rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-150 select-none ${
                    isOutOfStock 
                      ? 'opacity-50 border-slate-200 cursor-not-allowed bg-slate-50' 
                      : inCartItem
                        ? 'border-purple-600 bg-purple-50/20 shadow-xs cursor-pointer'
                        : 'border-slate-200/80 hover:border-purple-400 hover:shadow-md cursor-pointer'
                  }`}
                >
                  {/* Cart count badge */}
                  {inCartItem && (
                    <span className="absolute -top-1.5 -right-1.5 bg-purple-700 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {inCartItem.quantity}
                    </span>
                  )}

                  <div>
                    {/* Image & Stock status */}
                    <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      <span className={`absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md ${
                        isOutOfStock 
                          ? 'bg-rose-600/90 text-white' 
                          : product.stock <= 5 
                            ? 'bg-amber-600/90 text-white' 
                            : 'bg-emerald-700/80 text-white'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{product.sku}</p>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-700">
                      {product.title}
                    </h4>
                    {product.weightOrSize && (
                      <span className="text-[10px] text-slate-500 font-medium">{product.weightOrSize}</span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-purple-950">৳{product.price.toLocaleString()}</span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className="w-6 h-6 rounded-lg bg-purple-100 hover:bg-purple-700 text-purple-800 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= RIGHT: CASHIER REGISTER BILL PAD ================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col">
          
          {/* Register Top Bar: Customer Selector */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/60 rounded-t-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Customer & Bill Info</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('walkin');
                    setCustomerName('Walk-in Customer');
                    setCustomerPhone('018XXXXXXXX');
                    setIsVipMember(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    customerType === 'walkin' ? 'bg-purple-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Walk-In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('member');
                    setCustomerName('');
                    setCustomerPhone('');
                    setIsVipMember(true);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    customerType === 'member' ? 'bg-purple-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  VIP Member ⭐
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name..."
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Mobile (018...)"
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="text"
                value={petDetails}
                onChange={(e) => setPetDetails(e.target.value)}
                placeholder="Pet breed / name (e.g. Persian Cat - Bella)"
                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-purple-600"
              />
              {isVipMember && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md border border-amber-200 shrink-0">
                  5% VIP Applied
                </span>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-3.5 flex-1 min-h-[200px] max-h-[260px] overflow-y-auto space-y-2 border-b border-slate-100 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8 text-center space-y-2">
                <Scan className="w-8 h-8 text-slate-300 stroke-1" />
                <p className="text-xs font-medium">Register cart is empty</p>
                <p className="text-[11px] text-slate-400 max-w-[200px]">
                  Select products from the catalog or scan barcode to add
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>৳{item.product.price} each</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{item.product.stock} in stock</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="p-1 text-slate-500 hover:text-purple-700 cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Row Total */}
                  <div className="text-right shrink-0 min-w-[60px]">
                    <span className="font-bold text-slate-900 block">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Adjustments & Discount Bar */}
          <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 text-xs space-y-2">
            
            {/* Quick Discount Controls */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-medium">Discount:</span>
              <div className="flex items-center gap-1.5">
                <div className="flex rounded-md border border-slate-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold ${discountType === 'fixed' ? 'bg-purple-900 text-white' : 'bg-white text-slate-600'}`}
                  >
                    ৳
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold ${discountType === 'percent' ? 'bg-purple-900 text-white' : 'bg-white text-slate-600'}`}
                  >
                    %
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Quick Discount Presets */}
            <div className="flex items-center justify-end gap-1 text-[10px]">
              <button onClick={() => { setDiscountType('fixed'); setDiscountValue(50); }} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-purple-50 cursor-pointer">৳50</button>
              <button onClick={() => { setDiscountType('fixed'); setDiscountValue(100); }} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-purple-50 cursor-pointer">৳100</button>
              <button onClick={() => { setDiscountType('percent'); setDiscountValue(5); }} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-purple-50 cursor-pointer">5%</button>
              <button onClick={() => { setDiscountType('percent'); setDiscountValue(10); }} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-purple-50 cursor-pointer">10%</button>
              <button onClick={() => setDiscountValue(0)} className="px-1.5 py-0.5 text-rose-600 hover:underline cursor-pointer">Reset</button>
            </div>

            {/* Delivery charge & VAT toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={vatEnabled}
                  onChange={(e) => setVatEnabled(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="text-[11px]">Include 5% VAT (৳{vatAmount})</span>
              </label>

              <div className="flex items-center gap-1">
                <span className="text-[11px]">Delivery:</span>
                <input
                  type="number"
                  min="0"
                  value={deliveryCharge || ''}
                  onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)}
                  placeholder="৳0"
                  className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-right font-mono"
                />
              </div>
            </div>

            {/* Summary Lines */}
            <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery / Courier:</span>
                  <span className="font-mono">+৳{deliveryCharge.toLocaleString()}</span>
                </div>
              )}

              {/* Grand Total Display */}
              <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-300 text-slate-950">
                <span className="text-sm font-black uppercase tracking-tight">Net Payable:</span>
                <span className="text-2xl font-black text-purple-950 font-mono">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Payment Method Selector */}
          <div className="p-3.5 space-y-2.5">
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { id: 'Cash on Delivery', label: '💵 Cash', isDigital: false },
                { id: 'bKash', label: '📱 bKash', isDigital: true },
                { id: 'Nagad', label: '📲 Nagad', isDigital: true },
                { id: 'Credit/Debit Card', label: '💳 Card', isDigital: true }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`py-2 px-1 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Cash Tender Calculation */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Cash Tendered:</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-mono">৳</span>
                    <input
                      type="number"
                      value={tenderedAmount}
                      onChange={(e) => setTenderedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={grandTotal.toString()}
                      className="w-28 pl-6 pr-2 py-1 bg-white border border-emerald-300 rounded font-mono font-bold text-right text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Quick note buttons */}
                <div className="flex items-center justify-end gap-1 text-[10px]">
                  <button onClick={() => setQuickTender(grandTotal)} className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold hover:bg-emerald-100">Exact</button>
                  <button onClick={() => setQuickTender(500)} className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold hover:bg-emerald-100">৳500</button>
                  <button onClick={() => setQuickTender(1000)} className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold hover:bg-emerald-100">৳1,000</button>
                  <button onClick={() => setQuickTender(2000)} className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-emerald-800 font-bold hover:bg-emerald-100">৳2,000</button>
                </div>

                {/* Return Change */}
                <div className="flex items-center justify-between pt-1 border-t border-emerald-200">
                  <span className="font-bold text-emerald-800">Change Due:</span>
                  <span className={`text-base font-black font-mono ${changeDue >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ৳{changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* bKash / Nagad TrxID Input */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-purple-900 font-semibold">
                  <span>{paymentMethod} Merchant Number:</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-purple-200">01800-000000</span>
                </div>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="Enter Transaction ID (TrxID) e.g. BKT9821..."
                  className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg font-mono font-bold uppercase text-purple-950 placeholder-purple-300 focus:outline-none"
                />
              </div>
            )}

            {/* Action Buttons: Hold, Clear & COMPLETE SALE */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleParkBill}
                disabled={cart.length === 0}
                className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                title="Hold current bill to serve next customer"
              >
                <PauseCircle className="w-4 h-4" />
                <span>Hold</span>
              </button>

              <button
                type="button"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                title="Clear Cart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCompleteSale(true)}
                disabled={cart.length === 0}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>COMPLETE & PRINT (৳{grandTotal.toLocaleString()})</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ================= MODAL: 80MM THERMAL RECEIPT ================= */}
      {isReceiptModalOpen && completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Actions Header */}
            <div className="bg-slate-900 text-white p-3 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Thermal Receipt Ready
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realistic Bangladesh 80mm Thermal Receipt Canvas */}
            <div className="p-6 font-mono text-[11px] text-slate-900 leading-relaxed bg-white select-text border-b border-dashed border-slate-300">
              
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
                <h3 className="font-black text-sm tracking-tight uppercase">
                  COX'S BAZAR PET SHOP & CARE
                </h3>
                <p className="text-[10px] text-slate-600">
                  Kolatoli Main Road, Cox's Bazar Sadar
                </p>
                <p className="text-[10px] text-slate-600">
                  Hotline: 01800-000000 | 01700-000000
                </p>
                <p className="text-[9px] text-slate-500 font-bold">
                  BIN/Trade Lic: TR-CXB-89412
                </p>
              </div>

              {/* Order Metadata */}
              <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <span className="font-bold">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>Counter 01 / Admin</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold truncate max-w-[160px]">{completedOrder.customerName}</span>
                </div>
                {completedOrder.customerPhone && (
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{completedOrder.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="py-2.5 border-b border-dashed border-slate-400">
                <div className="flex justify-between font-bold pb-1 text-[10px] border-b border-slate-300">
                  <span>ITEM / QTY</span>
                  <span>RATE</span>
                  <span>TOTAL</span>
                </div>
                <div className="space-y-1.5 pt-1.5">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[10px]">
                      <div className="flex-1 pr-1 truncate">
                        <span className="font-semibold block truncate">{it.title}</span>
                        <span className="text-[9px] text-slate-500">Qty: {it.quantity} x ৳{it.price}</span>
                      </div>
                      <span className="font-bold shrink-0">৳{(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{completedOrder.subtotal.toLocaleString()}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>Discount:</span>
                    <span>-৳{completedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                {completedOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>+৳{completedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-400">
                  <span>GRAND TOTAL:</span>
                  <span>৳{completedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="py-2 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold">{completedOrder.paymentMethod}</span>
                </div>
                {lastChangeReturned > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Change Returned:</span>
                    <span>৳{lastChangeReturned.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Footer barcode visual & greeting */}
              <div className="pt-3 text-center space-y-1.5">
                <div className="w-full flex items-center justify-center">
                  <div className="tracking-[4px] font-mono text-[9px] font-bold text-slate-600">
                    ||||| |||||| |||||||| ||||| ||||
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 font-bold">
                  *** THANK YOU FOR VISITING! ***
                </p>
                <p className="text-[8px] text-slate-400">
                  Your Pet, Our Passion • www.coxsbazarpet.shop
                </p>
              </div>

            </div>

            {/* Modal Bottom Controls */}
            <div className="p-3 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  barcodeInputRef.current?.focus();
                }}
                className="flex-1 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Next Customer</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: HELD / PARKED BILLS ================= */}
      {isParkedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Parked / Held Bills Queue ({parkedBills.length})</h3>
              </div>
              <button
                onClick={() => setIsParkedModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-2.5">
              {parkedBills.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No held or parked invoices found.</p>
              ) : (
                parkedBills.map((parked) => {
                  const billTotal = parked.items.reduce((s, it) => s + (it.product.price * it.quantity), 0);
                  return (
                    <div
                      key={parked.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-purple-300 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-900">{parked.id}</span>
                          <span className="text-[10px] text-slate-400">{parked.time}</span>
                        </div>
                        <p className="font-bold text-slate-800">{parked.customerName}</p>
                        <p className="text-[11px] text-slate-500">
                          {parked.items.length} items • ৳{billTotal.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRestoreBill(parked)}
                        className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
