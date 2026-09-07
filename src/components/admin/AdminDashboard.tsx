import React, { useState } from 'react';
import { 
  Package, 
  ClipboardList, 
  BarChart3, 
  ArrowLeft, 
  Scan, 
  ShieldCheck, 
  ShoppingCart, 
  TrendingUp, 
  Store, 
  Users, 
  ArrowDownRight, 
  Truck, 
  Scissors, 
  Lock, 
  LogOut, 
  KeyRound, 
  AlertCircle,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DokanOverview } from './DokanOverview';
import { POSTerminal } from './POSTerminal';
import { CustomerDueKhata } from './CustomerDueKhata';
import { ExpenseKhata } from './ExpenseKhata';
import { ProductManagement } from './ProductManagement';
import { InventoryManagement } from './InventoryManagement';
import { SupplierLedger } from './SupplierLedger';
import { AppointmentManager } from './AppointmentManager';
import { SalesReportTracker } from './SalesReportTracker';
import { StoreSettingsManager } from './StoreSettingsManager';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminDashboard: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setActiveView, 
    products, 
    orders, 
    customerDues, 
    expenses, 
    suppliers, 
    appointments,
    isAdminAuthenticated,
    adminEmail,
    logoutAdmin
  } = useStore();

  const totalSales = (orders || []).filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = (products || []).filter(p => p.stock <= 8).length;
  const pendingAppointments = (appointments || []).filter(a => a.status === 'Pending').length;
  const totalCustomerDues = (customerDues || []).reduce((sum, d) => sum + d.totalDue, 0);

  // Security Protection: If not authenticated, show separate dedicated AdminLoginPage
  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16 font-sans">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand & Dokan Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden border border-purple-400/40 shadow-xs shrink-0">
              <img src="/brand_logo.png" alt="Cox's Bazar Pet Shop" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">Cox's Bazar Pet Shop & Care</span>
                <span className="bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Store POS & ERP
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70">
                Daily Ledger • POS Cashier • Customer Dues • Expenses • Suppliers
              </p>
            </div>
          </div>

          {/* Action Buttons: Email Badge, Storefront & Lock Admin */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-800/50 text-[11px] font-mono text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{adminEmail || 'admin@cbp.com'}</span>
            </div>

            <button
              onClick={() => setActiveView('store')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-bold border border-rose-800/60 transition-colors cursor-pointer"
              title="Lock Admin and Return to Store"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Controls Bar with All Dokan Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto border-t border-slate-800/80 scrollbar-none py-2">
          
          {/* 1. Dokan Daily Overview */}
          <button
            onClick={() => setAdminTab('dokan')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'dokan'
                ? 'bg-purple-700 text-white shadow-md ring-2 ring-purple-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Store className="w-4 h-4 text-purple-300" />
            <span>Daily Overview</span>
          </button>

          {/* 2. POS Billing Terminal */}
          <button
            onClick={() => setAdminTab('pos')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'pos'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40'
            }`}
          >
            <Scan className="w-4 h-4 text-emerald-300" />
            <span>Counter POS</span>
            <span className="bg-emerald-500/30 text-emerald-200 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
              LIVE
            </span>
          </button>

          {/* 3. Customer Due Khata */}
          <button
            onClick={() => setAdminTab('dues')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'dues'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Customer Dues</span>
            {totalCustomerDues > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded">
                ৳{Math.round(totalCustomerDues / 1000)}k
              </span>
            )}
          </button>

          {/* 4. Daily Expenses */}
          <button
            onClick={() => setAdminTab('expenses')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'expenses'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
            <span>Daily Expenses</span>
          </button>

          {/* 5. Inventory & Warehouse */}
          <button
            onClick={() => setAdminTab('inventory')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-blue-400" />
            <span>Inventory & Stock</span>
            {lowStockCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* 6. Product Catalog */}
          <button
            onClick={() => setAdminTab('products')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'products'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog</span>
            <span className="text-[10px] text-slate-400">({products.length})</span>
          </button>

          {/* 7. Supplier Ledger */}
          <button
            onClick={() => setAdminTab('suppliers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'suppliers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Truck className="w-4 h-4 text-purple-400" />
            <span>Supplier Accounts</span>
          </button>

          {/* 8. Appointments & Vet Bookings */}
          <button
            onClick={() => setAdminTab('appointments')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'appointments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Scissors className="w-4 h-4 text-indigo-400" />
            <span>Grooming & Vet</span>
            {pendingAppointments > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingAppointments}
              </span>
            )}
          </button>

          {/* 9. Sales Tracker */}
          <button
            onClick={() => setAdminTab('sales')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'sales'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Online Orders</span>
            <span className="text-[10px] text-slate-400">({orders.length})</span>
          </button>

          {/* 10. Store Settings & Announcements */}
          <button
            onClick={() => setAdminTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/30'
                : 'text-purple-300 hover:text-white hover:bg-slate-800/80 bg-purple-950/30 border border-purple-800/40'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-300" />
            <span>Settings & Notices</span>
          </button>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-12">
        {adminTab === 'dokan' && <DokanOverview />}
        {adminTab === 'pos' && <POSTerminal />}
        {adminTab === 'dues' && <CustomerDueKhata />}
        {adminTab === 'expenses' && <ExpenseKhata />}
        {adminTab === 'inventory' && <InventoryManagement />}
        {adminTab === 'products' && <ProductManagement />}
        {adminTab === 'suppliers' && <SupplierLedger />}
        {adminTab === 'appointments' && <AppointmentManager />}
        {adminTab === 'sales' && <SalesReportTracker />}
        {adminTab === 'settings' && <StoreSettingsManager />}

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Cox's Bazar Pet Shop & Care ERP • Dokan POS & Accounts Management System
          </div>
          <div className="text-slate-400">
            System Developed by <span className="font-semibold text-purple-400">CGI IT Company</span>
          </div>
        </div>
      </main>
    </div>
  );
};
