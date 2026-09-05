import React, { useState } from 'react';
import { 
  Store, 
  Wallet, 
  TrendingUp, 
  Receipt, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Truck, 
  ShoppingBag, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  MessageSquare,
  Scan,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DokanOverview: React.FC = () => {
  const { 
    products, 
    orders, 
    expenses, 
    customerDues, 
    suppliers, 
    drawerOpeningCash, 
    setDrawerOpeningCash,
    setAdminTab
  } = useStore();

  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [openingCashInput, setOpeningCashInput] = useState(drawerOpeningCash.toString());

  // Today calculations
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = (orders || []).filter(o => (o.date || '').slice(0, 10) === todayStr && o.orderStatus !== 'Cancelled');
  
  const todaySalesTotal = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const todayCashSales = todayOrders.filter(o => o.paymentMethod === 'Cash on Delivery').reduce((sum, o) => sum + o.total, 0);
  const todayDigitalSales = todayOrders.filter(o => o.paymentMethod !== 'Cash on Delivery').reduce((sum, o) => sum + o.total, 0);

  // Today expenses
  const todayExpenses = (expenses || []).filter(e => e.date === todayStr);
  const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const todayCashExpense = todayExpenses.filter(e => e.paymentSource === 'Drawer Cash').reduce((sum, e) => sum + e.amount, 0);

  // Estimated gross profit (Approx 22% retail margin on sales minus expenses)
  const todayEstimatedProfit = Math.round(todaySalesTotal * 0.22 - todayExpenseTotal);

  // Total customer dues
  const totalCustomerDues = (customerDues || []).reduce((sum, d) => sum + d.totalDue, 0);

  // Total supplier balance dues
  const totalSupplierDues = (suppliers || []).reduce((sum, s) => sum + s.balanceDue, 0);

  // Current Net Cash in Drawer
  const currentDrawerCash = drawerOpeningCash + todayCashSales - todayCashExpense;

  // Urgent low stock (< 8 units)
  const lowStockItems = (products || []).filter(p => p.stock <= 8);

  const handleSaveOpeningCash = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(openingCashInput);
    if (!isNaN(val) && val >= 0) {
      setDrawerOpeningCash(val);
      setIsCashModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dokan Hero Banner / Daily Status */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Physical Store Open & Active
              </span>
              <span className="text-xs text-purple-300 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Store className="w-6 h-6 text-purple-400" />
              <span>Daily Store Register & Financial Overview</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time cash drawer tracking, daily sales revenue, customer credit dues, shop operating expenses, and inventory health.
            </p>
          </div>

          {/* Quick POS Launch Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAdminTab('pos')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Scan className="w-5 h-5 text-slate-950" />
              <span>Launch POS Billing Terminal</span>
            </button>
          </div>

        </div>
      </div>

      {/* Primary 4 Dokan Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Cash in Drawer */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Cash in Drawer
            </span>
            <button
              onClick={() => setIsCashModalOpen(true)}
              className="text-[11px] text-purple-700 hover:underline font-semibold cursor-pointer"
            >
              Edit Opening
            </button>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              ৳{currentDrawerCash.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              In Drawer
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Morning Float: ৳{drawerOpeningCash.toLocaleString()}</span>
            <span>Cash Sales: +৳{todayCashSales.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. Today's Total Sales */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Today's Gross Sales
            </span>
            <span className="text-[10px] font-mono text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded">
              {todayOrders.length} Invoices
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-purple-950 font-mono">
              ৳{todaySalesTotal.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Revenue
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cash: ৳{todayCashSales.toLocaleString()}</span>
            <span>bKash/Cards: ৳{todayDigitalSales.toLocaleString()}</span>
          </div>
        </div>

        {/* 3. Customer Credit / Dues */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              Customer Dues (Credit)
            </span>
            <button
              onClick={() => setAdminTab('dues')}
              className="text-[11px] text-amber-800 hover:underline font-bold cursor-pointer"
            >
              Open Ledger ➔
            </button>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
              ৳{totalCustomerDues.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {(customerDues || []).length} Debtors
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Market receivables</span>
            <span className="text-amber-800 font-bold">Send Reminder</span>
          </div>
        </div>

        {/* 4. Today's Expenses */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              Today's Operating Expenses
            </span>
            <button
              onClick={() => setAdminTab('expenses')}
              className="text-[11px] text-rose-700 hover:underline font-bold cursor-pointer"
            >
              Expense Log ➔
            </button>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-rose-950 font-mono">
              ৳{todayExpenseTotal.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {todayExpenses.length} Entries
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Est. Net Margin:</span>
            <span className={`font-bold font-mono ${todayEstimatedProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              ৳{todayEstimatedProfit.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Secondary Dokan Operational Row: Dues Quick List & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left (7 cols): Quick Customer Dues */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Recent Customer Credit & Balances</span>
              </h3>
              <p className="text-xs text-slate-500">Regular customers with outstanding store balances</p>
            </div>
            <button
              onClick={() => setAdminTab('dues')}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              View Full Credit Ledger
            </button>
          </div>

          <div className="space-y-2.5">
            {(customerDues || []).slice(0, 4).map(due => (
              <div 
                key={due.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{due.customerName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{due.customerPhone}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {due.petName ? `Pet: ${due.petName}` : ''} {due.notes ? `• ${due.notes}` : ''}
                  </p>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <span className="font-black text-rose-600 text-sm font-mono">৳{due.totalDue.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400">{due.lastUpdated}</span>
                  </div>
                  <a
                    href={`https://wa.me/880${due.customerPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${due.customerName}, this is a gentle balance reminder from Cox's Bazar Pet Shop & Care regarding your outstanding account balance of ৳${due.totalDue}. Please clear it at your earliest convenience. Thank you!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Send WhatsApp Balance Reminder"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Supplier Payables Snapshot */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-purple-600" />
              Supplier / Distributor Payables:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-black text-purple-950 font-mono">৳{totalSupplierDues.toLocaleString()}</span>
              <button
                onClick={() => setAdminTab('suppliers')}
                className="text-[11px] text-purple-700 hover:underline font-bold cursor-pointer"
              >
                Supplier Ledger ➔
              </button>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Low Stock & Critical Dokan Alerts */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Low Stock Alerts ({lowStockItems.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Items reaching critical reorder threshold</p>
            </div>
            <button
              onClick={() => setAdminTab('inventory')}
              className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
            >
              Inventory Logs ➔
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {lowStockItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                All product stock levels healthy
              </div>
            ) : (
              lowStockItems.map(item => (
                <div 
                  key={item.id} 
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover border shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.stock <= 3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Dokan Navigation Grid */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setAdminTab('expenses')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-700" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setAdminTab('products')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-blue-700" />
              <span>Add New Product</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modal: Change Opening Drawer Cash */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Set Morning Opening Cash Float</span>
            </h3>
            <p className="text-xs text-slate-500">
              Specify the cash amount present in the drawer when opening the store today.
            </p>

            <form onSubmit={handleSaveOpeningCash} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (৳):</label>
                <input
                  type="number"
                  min="0"
                  value={openingCashInput}
                  onChange={(e) => setOpeningCashInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCashModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 cursor-pointer"
                >
                  Save Float
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
