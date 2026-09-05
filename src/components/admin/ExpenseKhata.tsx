import React, { useState, useMemo } from 'react';
import { 
  ArrowDownRight, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  DollarSign, 
  Wallet, 
  Smartphone, 
  Tag, 
  X,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ExpenseRecord } from '../../types';

export const ExpenseKhata: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Tea & Snacks');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentSource, setPaymentSource] = useState<ExpenseRecord['paymentSource']>('Drawer Cash');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredExpenses = useMemo(() => {
    return (expenses || []).filter(e => {
      const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Calculations
  const todayTotal = (expenses || []).filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0);
  const totalAllTime = (expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const drawerCashExpense = (expenses || []).filter(e => e.date === todayStr && e.paymentSource === 'Drawer Cash').reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || amount <= 0) {
      alert('Please enter a description and a valid expense amount.');
      return;
    }

    addExpense({
      date: new Date().toISOString().slice(0, 10),
      category,
      title: title.trim(),
      amount: Number(amount),
      paymentSource,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Banner & Stats */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-rose-600" />
              <span>Daily Operating Expense Ledger</span>
            </h2>
            <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {filteredExpenses.length} Expense Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily petty cash, refreshments, utilities, staff wages, packaging, and courier transport.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Today's Total Expenses</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
              ৳{todayTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Paid from Cash Drawer (Today)</span>
          <span className="text-xl font-bold font-mono text-slate-900">৳{drawerCashExpense.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Deducted from register drawer</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Paid via bKash / Bank (Today)</span>
          <span className="text-xl font-bold font-mono text-purple-900">৳{(todayTotal - drawerCashExpense).toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Online or utility bill transfer</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Total All-Time Recorded Expenses</span>
          <span className="text-xl font-bold font-mono text-rose-950">৳{totalAllTime.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Cumulative ledger total</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense description or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Tea & Snacks">Tea, Snacks & Hospitality</option>
          <option value="Electricity & Bills">Electricity & Utility Bills</option>
          <option value="Courier & Transport">Courier & Delivery Transport</option>
          <option value="Packaging & Bags">Shopping Bags & Packaging</option>
          <option value="Staff Salary">Staff Wages & Allowance</option>
          <option value="Shop Rent">Shop Rent</option>
          <option value="Other Expense">Other Miscellaneous</option>
        </select>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Source</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {exp.date}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{exp.title}</p>
                      {exp.notes && <p className="text-[11px] text-slate-400 mt-0.5">{exp.notes}</p>}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        exp.paymentSource === 'Drawer Cash' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {exp.paymentSource === 'Drawer Cash' ? <Wallet className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        <span>{exp.paymentSource}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black font-mono text-rose-600 text-sm">
                      -৳{exp.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expense record "${exp.title}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <span>Record Store Expense</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Title / Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Afternoon tea & biscuits for staff and customers"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseRecord['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Tea & Snacks">Tea & Snacks</option>
                    <option value="Electricity & Bills">Electricity & Bills</option>
                    <option value="Courier & Transport">Courier & Transport</option>
                    <option value="Packaging & Bags">Packaging & Bags</option>
                    <option value="Staff Salary">Staff Salary</option>
                    <option value="Shop Rent">Shop Rent</option>
                    <option value="Other Expense">Other Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount (৳) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Paid From *</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    paymentSource === 'Drawer Cash' ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="source"
                      checked={paymentSource === 'Drawer Cash'}
                      onChange={() => setPaymentSource('Drawer Cash')}
                      className="hidden"
                    />
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drawer Cash</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    paymentSource === 'bKash/Bank' ? 'bg-purple-50 border-purple-400 text-purple-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="source"
                      checked={paymentSource === 'bKash/Bank'}
                      onChange={() => setPaymentSource('bKash/Bank')}
                      className="hidden"
                    />
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                    <span>bKash / Bank</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Additional Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Receipt number, supplier, or reason..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500"
                />
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
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
