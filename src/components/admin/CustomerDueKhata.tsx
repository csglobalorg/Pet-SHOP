import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  DollarSign, 
  Trash2, 
  Calendar, 
  X, 
  CreditCard,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerDueRecord } from '../../types';
import { SamsungEmoji } from '../SamsungEmoji';

export const CustomerDueKhata: React.FC = () => {
  const { customerDues, addCustomerDue, recordDuePayment, deleteCustomerDue } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedDue, setSelectedDue] = useState<CustomerDueRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');

  // New Due Form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPet, setNewPet] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newNotes, setNewNotes] = useState('');

  const filteredDues = useMemo(() => {
    return (customerDues || []).filter(d => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.customerName.toLowerCase().includes(q) ||
        d.customerPhone.toLowerCase().includes(q) ||
        (d.petName && d.petName.toLowerCase().includes(q))
      );
    });
  }, [customerDues, searchQuery]);

  const totalDuesAmount = (customerDues || []).reduce((sum, d) => sum + d.totalDue, 0);

  const handleCreateDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAmount || newAmount <= 0) {
      alert('Please provide the customer name and a valid credit/due amount.');
      return;
    }

    addCustomerDue({
      customerName: newName.trim(),
      customerPhone: newPhone.trim() || 'N/A',
      petName: newPet.trim() || undefined,
      totalDue: Number(newAmount),
      notes: newNotes.trim() || undefined
    });

    // Reset
    setNewName('');
    setNewPhone('');
    setNewPet('');
    setNewAmount('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDue || !payAmount || payAmount <= 0) return;

    recordDuePayment(selectedDue.id, Number(payAmount));
    setIsPayModalOpen(false);
    setSelectedDue(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & KPI */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Customer Credit & Outstanding Dues Ledger</span>
            </h2>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {(customerDues || []).length} Debtors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track customer balances, receive partial or full payments, and send courteous WhatsApp payment reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Total Outstanding Credit</span>
            <span className="text-2xl font-black text-rose-600 font-mono">
              ৳{totalDuesAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Due</span>
          </button>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, mobile number, or pet..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-600"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredDues.length} of {(customerDues || []).length} accounts
        </span>
      </div>

      {/* Dues Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDues.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No customer credit records match your search.
          </div>
        ) : (
          filteredDues.map((due) => (
            <div 
              key={due.id}
              className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{due.customerName}</h3>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{due.customerPhone}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-rose-600 font-mono block">
                      ৳{due.totalDue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Balance Due</span>
                  </div>
                </div>

                {/* Pet & Notes */}
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                  {due.petName && (
                    <p className="font-medium text-slate-800 flex items-center gap-1.5">
                      <SamsungEmoji emoji="🐾" size="xs" />
                      <span>Pet: <span className="font-semibold">{due.petName}</span></span>
                    </p>
                  )}
                  {due.notes && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Notes: {due.notes}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                    <Calendar className="w-3 h-3" />
                    <span>Last updated: {due.lastUpdated}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* WhatsApp Reminder Button */}
                  <a
                    href={`https://wa.me/880${due.customerPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${due.customerName}, this is a gentle balance reminder from Cox's Bazar Pet Shop & Care regarding your store credit balance of ৳${due.totalDue}. Please settle at your earliest convenience. Thank you!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete credit ledger record for ${due.customerName}?`)) {
                        deleteCustomerDue(due.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Receive Payment Modal Trigger */}
                <button
                  onClick={() => {
                    setSelectedDue(due);
                    setPayAmount(due.totalDue);
                    setIsPayModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Receive Payment</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL: Add New Customer Due */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-sm">Add Customer Credit / Due Record</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-amber-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDue} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName || ''}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kamrul Hasan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newPhone || ''}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pet Name / Breed</label>
                  <input
                    type="text"
                    value={newPet || ''}
                    onChange={(e) => setNewPet(e.target.value)}
                    placeholder="e.g. Persian Cat"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Credit Amount (৳) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">৳</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newAmount ?? ''}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold font-mono text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Items Taken & Notes</label>
                <textarea
                  rows={2}
                  value={newNotes || ''}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Took Reflex 1.5kg and bentonite cat litter; promised to pay next week"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-600"
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
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Credit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Receive Customer Payment */}
      {isPayModalOpen && selectedDue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm">Receive Customer Payment</h3>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Customer</span>
                <p className="font-bold text-slate-900 text-sm">{selectedDue.customerName}</p>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Current Outstanding:</span>
                  <span className="font-bold text-rose-600 font-mono">৳{selectedDue.totalDue.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Received Amount (৳) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedDue.totalDue}
                  required
                  value={payAmount ?? ''}
                  onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-emerald-500 rounded-xl text-lg font-bold font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              {/* Quick Full / Partial buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPayAmount(selectedDue.totalDue)}
                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  Full (৳{selectedDue.totalDue})
                </button>
                {selectedDue.totalDue > 500 && (
                  <button
                    type="button"
                    onClick={() => setPayAmount(Math.round(selectedDue.totalDue / 2))}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    50% (৳{Math.round(selectedDue.totalDue / 2)})
                  </button>
                )}
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
