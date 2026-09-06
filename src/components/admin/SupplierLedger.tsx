import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle, 
  DollarSign, 
  Building2, 
  X,
  CreditCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SupplierRecord } from '../../types';

export const SupplierLedger: React.FC = () => {
  const { suppliers, addSupplier, recordSupplierPayment } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');

  // Add Supplier Form
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [totalPurchased, setTotalPurchased] = useState<number | ''>('');
  const [totalPaid, setTotalPaid] = useState<number | ''>('');

  const filteredSuppliers = (suppliers || []).filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.supplierName.toLowerCase().includes(q) ||
      s.brandOrGoods.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  });

  const totalDuesToSuppliers = (suppliers || []).reduce((sum, s) => sum + s.balanceDue, 0);
  const totalStockPurchased = (suppliers || []).reduce((sum, s) => sum + s.totalPurchased, 0);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const purchased = Number(totalPurchased) || 0;
    const paid = Number(totalPaid) || 0;
    const due = Math.max(0, purchased - paid);

    addSupplier({
      supplierName: name.trim(),
      brandOrGoods: brand.trim() || 'General Pet Supplies',
      phone: phone.trim() || 'N/A',
      address: address.trim() || 'Bangladesh',
      totalPurchased: purchased,
      totalPaid: paid,
      balanceDue: due,
      lastOrderDate: new Date().toISOString().slice(0, 10)
    });

    setName('');
    setBrand('');
    setPhone('');
    setAddress('');
    setTotalPurchased('');
    setTotalPaid('');
    setIsAddModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !payAmount || payAmount <= 0) return;

    recordSupplierPayment(selectedSupplier.id, Number(payAmount));
    setIsPayModalOpen(false);
    setSelectedSupplier(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              <span>Supplier & Wholesaler Accounts Ledger</span>
            </h2>
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {(suppliers || []).length} Distributors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage pet food wholesale suppliers, depot purchases, payment receipts, and outstanding vendor liabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Total Supplier Payables</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
              ৳{totalDuesToSuppliers.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Supplier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Total Stock Procurement</span>
          <span className="text-xl font-bold font-mono text-slate-900">৳{totalStockPurchased.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Purchases across all suppliers</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Total Paid to Suppliers</span>
          <span className="text-xl font-bold font-mono text-emerald-700">
            ৳{(totalStockPurchased - totalDuesToSuppliers).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Bank, cash, and cheque clearings</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Outstanding Vendor Liabilities</span>
          <span className="text-xl font-bold font-mono text-rose-600">৳{totalDuesToSuppliers.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Payable to depots & brands</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers by name, brand, or contact..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No supplier accounts match your search.
          </div>
        ) : (
          filteredSuppliers.map((sup) => (
            <div 
              key={sup.id}
              className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{sup.supplierName}</h3>
                    <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold border border-purple-100 inline-block mt-1">
                      {sup.brandOrGoods}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Balance Payable</span>
                    <span className={`text-base font-black font-mono ${sup.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ৳{sup.balanceDue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sup.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{sup.address}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Total Purchased:</span>
                    <span className="font-bold text-slate-800 font-mono">৳{sup.totalPurchased.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Paid:</span>
                    <span className="font-bold text-emerald-700 font-mono">৳{sup.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  Last Order: {sup.lastOrderDate}
                </span>

                {sup.balanceDue > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedSupplier(sup);
                      setPayAmount(sup.balanceDue);
                      setIsPayModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Pay Supplier</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>All Dues Cleared</span>
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL: Add New Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-sm">Add New Supplier / Wholesaler</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-purple-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Reflex Bangladesh Official Depot"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand / Product Category *</label>
                <input
                  type="text"
                  required
                  value={brand || ''}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Reflex Plus Dry & Wet Food"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile / Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone || ''}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Depot / Warehouse Address</label>
                  <input
                    type="text"
                    value={address || ''}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Kadamtali, Chittagong"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Stock Purchased (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalPurchased ?? ''}
                    onChange={(e) => setTotalPurchased(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Paid (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalPaid ?? ''}
                    onChange={(e) => setTotalPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Pay Supplier */}
      {isPayModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-sm">Pay Supplier</h3>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-purple-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Supplier</span>
                <p className="font-bold text-slate-900 text-sm">{selectedSupplier.supplierName}</p>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Current Payable:</span>
                  <span className="font-bold text-rose-600 font-mono">৳{selectedSupplier.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount to Pay (৳) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedSupplier.balanceDue}
                  required
                  value={payAmount ?? ''}
                  onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-purple-500 rounded-xl text-lg font-bold font-mono text-purple-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
