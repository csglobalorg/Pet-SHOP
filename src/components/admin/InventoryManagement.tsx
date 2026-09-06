import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingUp, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const InventoryManagement: React.FC = () => {
  const { products, inventoryLogs, restockProduct } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [restockQty, setRestockQty] = useState<number>(20);
  const [restockNote, setRestockNote] = useState<string>('Reflex container shipment arrival');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Calculations
  const totalSkus = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 8);
  const outOfStockProducts = products.filter(p => p.stock <= 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || restockQty <= 0) return;

    restockProduct(selectedProductId, restockQty, restockNote || 'Warehouse manual restock');
    setIsRestockModalOpen(false);
    setRestockQty(20);
  };

  const filteredLogs = inventoryLogs.filter(log => {
    if (!logSearchQuery.trim()) return true;
    const q = logSearchQuery.toLowerCase();
    return (
      log.productTitle.toLowerCase().includes(q) ||
      log.sku.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.performedBy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Fast Restock Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
            Inventory & Stock Warehouse Management
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time stock audit trail, automated restock logs, and low-inventory warnings for Dhaka warehouse
          </p>
        </div>

        <button
          onClick={() => setIsRestockModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Stock Restock Batch</span>
        </button>
      </div>

      {/* KPI Stats Cards - Matching Clean Minimalism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total SKUs */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total SKUs</div>
          <div className="text-2xl font-bold text-gray-900">{totalSkus}</div>
          <div className="text-xs text-gray-400 font-medium mt-2">Across active pet categories</div>
        </div>

        {/* Total Physical Units */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Warehouse Units</div>
          <div className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()}</div>
          <div className="text-xs text-green-500 font-semibold mt-2">Live warehouse inventory</div>
        </div>

        {/* Low / Out Alerts */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Low / Out Stock</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</div>
            {outOfStockProducts.length > 0 && (
              <span className="text-xs font-semibold text-red-500">
                ({outOfStockProducts.length} Out)
              </span>
            )}
          </div>
          <div className="text-xs text-yellow-600 font-medium mt-2">Requires supplier reorder</div>
        </div>

        {/* Inventory Asset Valuation */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Inventory Value</div>
          <div className="text-2xl font-bold text-gray-900">৳{totalValuation.toLocaleString()}</div>
          <div className="text-xs text-blue-500 font-medium mt-2">Current retail asset value</div>
        </div>

      </div>

      {/* Critical Stock Alerts Bar (if any) */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-yellow-50/70 rounded-xl border border-yellow-200/80 p-4 space-y-3">
          <div className="flex items-center gap-2 text-yellow-800 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>Attention: Warehouse Restock Priority List</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[...outOfStockProducts, ...lowStockProducts].map(p => (
              <div
                key={p.id}
                className="bg-white p-3 rounded-lg border border-yellow-200 flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 text-xs truncate">{p.title}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  {p.stock === 0 ? (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold block">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold block">
                      {p.stock} LOW STOCK
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setIsRestockModalOpen(true);
                    }}
                    className="text-[10px] text-blue-600 font-medium hover:underline cursor-pointer mt-0.5 inline-block"
                  >
                    Restock Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Inventory Status per SKU */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Current Stock Level By SKU</h3>
            <p className="text-xs text-gray-400">Live quantities and safety stock indicators</p>
          </div>
          <span className="text-xs font-medium text-gray-500">{products.length} Products Tracked</span>
        </div>

        <div className="overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Item & SKU</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Stock Level</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Retail Value</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map(p => {
                const maxCap = 60; // visual cap for bar
                const percent = Math.min(100, Math.round((p.stock / maxCap) * 100));
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover bg-gray-50 border border-gray-200" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-xs">{p.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-xs text-gray-600 font-medium">
                      {p.category}
                    </td>

                    <td className="py-3 w-44">
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            p.stock <= 0 ? 'bg-red-500' :
                            p.stock <= 8 ? 'bg-yellow-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.max(4, percent)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3">
                      {p.stock === 0 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          OUT OF STOCK
                        </span>
                      ) : p.stock <= 8 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p.stock} LOW STOCK
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p.stock} IN STOCK
                        </span>
                      )}
                    </td>

                    <td className="py-3 font-medium text-gray-800 text-xs">
                      ৳{(p.stock * p.price).toLocaleString()}
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setIsRestockModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 font-medium text-xs cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Transaction Logs (Audit Trail) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Inventory Transaction Audit Log</h3>
            <p className="text-xs text-gray-400">Every restock, customer purchase, and inventory adjustment recorded automatically</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={logSearchQuery || ''}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 font-medium text-[11px]">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Qty Change</th>
                <th className="py-2.5 px-3">Stock (Prev → New)</th>
                <th className="py-2.5 px-3">Notes & Reason</th>
                <th className="py-2.5 px-3 text-right">Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredLogs.map(log => {
                const isPositive = log.changeQuantity > 0;
                return (
                  <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-gray-900 truncate max-w-xs">
                      {log.productTitle}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'Restock' ? 'bg-green-100 text-green-700' :
                        log.action === 'Sale' ? 'bg-blue-100 text-blue-700' :
                        log.action === 'Initial' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-semibold">
                      <span className={isPositive ? 'text-green-600' : 'text-red-500'}>
                        {isPositive ? `+${log.changeQuantity}` : log.changeQuantity}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">
                      {log.previousStock} → <strong className="text-gray-900">{log.newStock}</strong>
                    </td>

                    <td className="py-2.5 px-3 text-gray-500 text-[11px] truncate max-w-xs">
                      {log.notes}
                    </td>

                    <td className="py-2.5 px-3 text-right text-gray-600 font-medium">
                      {log.performedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fast Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Restock Product Inventory</span>
              </h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Select Product SKU *</label>
                <select
                  value={selectedProductId || ''}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-gray-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.title} (Currently: {p.stock} units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Quantity to Add to Stock *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={restockQty ?? ''}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Restock Reason / Invoice Reference</label>
                <input
                  type="text"
                  value={restockNote || ''}
                  onChange={(e) => setRestockNote(e.target.value)}
                  placeholder="e.g. Supplier container import, customs clearance release"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Restock (+{restockQty} units)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
