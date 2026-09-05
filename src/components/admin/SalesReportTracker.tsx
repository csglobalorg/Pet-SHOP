import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Search,
  Filter,
  Eye,
  CreditCard
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const SalesReportTracker: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, salesAnalytics } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calculate high-level financial KPIs from actual orders
  const totalGrossRevenue = useMemo(() => {
    return (orders || [])
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrdersCount = (orders || []).length;
  const completedOrders = (orders || []).filter(o => o.orderStatus === 'Delivered').length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalGrossRevenue / totalOrdersCount) : 0;
  const totalUnitsDispatched = (orders || []).reduce((sum, o) => {
    return sum + (o.items || []).reduce((s, it) => s + it.quantity, 0);
  }, 0);

  // Chart data 1: Daily sales trajectory
  const salesTrendData = useMemo(() => {
    // Generate dates based on salesAnalytics
    return (salesAnalytics || []).map(d => ({
      date: d.date ? d.date.split('-').slice(1).join('/') : '',
      revenue: d.revenue || 0,
      orders: d.orders || 0
    }));
  }, [salesAnalytics]);

  // Chart data 2: Category distribution with Clean Minimalism palette
  const categorySalesData = [
    { name: 'Cat Food', value: 42, color: '#2563eb' },
    { name: 'Dog Food', value: 24, color: '#3b82f6' },
    { name: 'Cat Litter', value: 18, color: '#60a5fa' },
    { name: 'Care & Health', value: 10, color: '#64748b' },
    { name: 'Toys & Gear', value: 6, color: '#94a3b8' }
  ];

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchCust = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.includes(q);
        if (!matchNum && !matchCust && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Total BDT', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = (orders || []).map(o => [
      o.orderNumber,
      new Date(o.createdAt || o.date || Date.now()).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.city}"`,
      o.total,
      `"${o.paymentMethod}"`,
      o.paymentStatus,
      o.orderStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PawPlanetBD_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
            Sales Report Tracker & Financial Analytics
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time revenue logs, courier fulfillment rates, and customer orders tracking
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Gross Sales</div>
          <div className="text-2xl font-bold text-gray-900">৳{totalGrossRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-500 font-semibold mt-2">↑ 18.4% vs last period</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{totalOrdersCount}</div>
          <div className="text-xs text-blue-500 font-medium mt-2">{completedOrders} delivered successfully</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Average Order (AOV)</div>
          <div className="text-2xl font-bold text-gray-900">৳{averageOrderValue.toLocaleString()}</div>
          <div className="text-xs text-gray-400 font-medium mt-2">Per customer order in BDT</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Items Dispatched</div>
          <div className="text-2xl font-bold text-gray-900">{totalUnitsDispatched} units</div>
          <div className="text-xs text-gray-400 font-medium mt-2">Products delivered in Dhaka & beyond</div>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Weekly Revenue & Volume Trend</h3>
              <p className="text-xs text-gray-400">Gross sales performance over the past 7 days</p>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Daily Average: ৳14,200
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-semibold text-gray-800">Revenue by Category</h3>
            <p className="text-xs text-gray-400">Best performing product types</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1">
            {categorySalesData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Orders Tracking & Fulfillment Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Customer Orders Fulfillment Tracker</h3>
            <p className="text-xs text-gray-400">Live order status, payment verification, and dispatch controls</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID or phone..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 font-medium text-[11px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer & Location</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3">Total (BDT)</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3 text-right">View Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                  
                  {/* Order ID & Time */}
                  <td className="py-3 px-3">
                    <span className="font-mono font-semibold text-blue-600 block">{order.orderNumber}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3">
                    <strong className="text-gray-900 block font-medium">{order.customerName}</strong>
                    <span className="text-[11px] text-gray-500">{order.customerPhone}</span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-xs">{order.city}</span>
                  </td>

                  {/* Items */}
                  <td className="py-3 px-3">
                    <div className="space-y-0.5 max-w-xs">
                      {(order.items || []).slice(0, 2).map((it, idx) => (
                        <div key={idx} className="text-[11px] text-gray-600 truncate">
                          • {it.title} <span className="font-medium text-gray-900">x{it.quantity}</span>
                        </div>
                      ))}
                      {(order.items || []).length > 2 && (
                        <span className="text-[10px] text-blue-600 font-medium">
                          +{(order.items || []).length - 2} more items
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-900 text-xs">৳{order.total.toLocaleString()}</span>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-600 block font-medium">
                        {order.paymentMethod}
                      </span>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                          order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </td>

                  {/* Fulfillment Status Selector */}
                  <td className="py-3 px-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.orderStatus === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* View Details */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-500 hover:text-blue-700 font-medium text-xs cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="View invoice summary"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Order Invoice: {selectedOrder.orderNumber}</h3>
                <p className="text-[11px] text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Customer:</span>
                  <strong className="text-gray-900">{selectedOrder.customerName}</strong>
                  <div className="text-gray-600">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Destination:</span>
                  <div className="text-gray-800">{selectedOrder.deliveryAddress}</div>
                  <div className="text-gray-500 font-medium">{selectedOrder.city}</div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-2.5 bg-yellow-50 rounded-lg text-yellow-900 border border-yellow-200">
                  <strong>Delivery Note:</strong> {selectedOrder.notes}
                </div>
              )}

              <div>
                <span className="font-medium text-gray-800 block mb-2">Order Items:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-white">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt={it.title} className="w-8 h-8 object-cover rounded bg-gray-50 border border-gray-200" />
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-xs">{it.title}</p>
                          <span className="text-[10px] text-gray-400">৳{it.price} each</span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        x{it.quantity} = ৳{(it.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge:</span>
                  <span>৳{selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total Payable:</span>
                  <span>৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
