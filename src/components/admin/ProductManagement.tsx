import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, AlertTriangle, Check, X, Filter, Package, ArrowUpDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, restockProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pet Food' as ProductCategory,
    price: 0,
    originalPrice: 0,
    stock: 20,
    sku: '',
    brand: 'Reflex Plus',
    animalType: 'cat' as 'cat' | 'dog' | 'bird' | 'other',
    description: '',
    weightOrSize: '',
    badgeText: '',
    isFlashSale: false,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80'
  });

  const categories: ProductCategory[] = [
    'Pet Food',
    'Litter & Hygiene',
    'Accessories & Toys',
    'Grooming Essentials',
    'Healthcare & First Aid'
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (stockFilter === 'low' && (product.stock > 8 || product.stock === 0)) return false;
    if (stockFilter === 'out' && product.stock > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchTitle && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'Cat Food',
      price: 1200,
      originalPrice: 1400,
      stock: 25,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: 'Reflex Plus',
      animalType: 'cat',
      description: 'Premium balanced food formula with omega fatty acids and essential vitamins for active Bangladeshi pets.',
      weightOrSize: '1.5 kg',
      badgeText: 'New Import',
      isFlashSale: false,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stock: p.stock,
      sku: p.sku,
      brand: p.brand,
      animalType: p.animalType,
      description: p.description,
      weightOrSize: p.weightOrSize || '',
      badgeText: p.badgeText || '',
      isFlashSale: !!p.isFlashSale,
      image: p.image
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.price <= 0) {
      alert('Please enter valid product title and price.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
        weightOrSize: formData.weightOrSize || undefined,
        badgeText: formData.badgeText || undefined
      });
    } else {
      addProduct({
        ...formData,
        originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
        weightOrSize: formData.weightOrSize || undefined,
        badgeText: formData.badgeText || undefined,
        rating: 4.8,
        reviewCount: 12,
        soldCount: 0
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the store catalog?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Product Catalog Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Total {products.length} products listed • Add new items, update prices & manage stock
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, brand..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category & Stock filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock (≤ 8 left)</option>
            <option value="out">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Sold</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts.map(p => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 8;

                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    {/* Info */}
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate max-w-xs">{p.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span className="font-mono">SKU: {p.sku}</span>
                            <span>• {p.brand}</span>
                            {p.weightOrSize && <span>• {p.weightOrSize}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 text-xs text-gray-600">
                      <span className="inline-block px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Stock & Quick update */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {isOutOfStock ? (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            OUT OF STOCK
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {p.stock} LOW STOCK
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {p.stock} IN STOCK
                          </span>
                        )}

                        <button
                          onClick={() => {
                            const qtyStr = window.prompt(`Enter restock quantity to add to "${p.title}":`, '10');
                            if (qtyStr) {
                              const qty = parseInt(qtyStr, 10);
                              if (!isNaN(qty) && qty > 0) {
                                restockProduct(p.id, qty, 'Manual admin restock quick action');
                              }
                            }
                          }}
                          className="text-[10px] text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          +Restock
                        </button>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 font-medium text-gray-900">
                      <div>
                        <span>৳{p.price.toLocaleString()}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            ৳{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Units Sold */}
                    <td className="py-3 text-gray-600 text-xs">
                      {p.soldCount || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-blue-500 hover:text-blue-700 font-medium text-xs cursor-pointer px-1 py-0.5 rounded"
                          title="Edit product"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="text-gray-400 hover:text-red-600 font-medium text-xs cursor-pointer px-1 py-0.5 rounded"
                          title="Delete product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-gray-400 space-y-2">
            <Package className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs">No products match your search/filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {editingProduct ? `Edit Product: ${editingProduct.sku}` : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Reflex Plus Adult Cat Food Salmon"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none font-medium text-gray-800"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Pet Type</label>
                    <select
                      value={formData.animalType}
                      onChange={(e) => setFormData({ ...formData, animalType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none text-gray-800"
                    >
                      <option value="cat">Cat 🐱</option>
                      <option value="dog">Dog 🐶</option>
                      <option value="bird">Bird / Small Pet 🦜</option>
                      <option value="other">Universal / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Reflex Plus"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Sale Price (BDT) *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Original Price (BDT)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-blue-600 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Weight / Pack Size</label>
                    <input
                      type="text"
                      value={formData.weightOrSize}
                      onChange={(e) => setFormData({ ...formData, weightOrSize: e.target.value })}
                      placeholder="e.g. 1.5 kg or 10 L"
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Badge Label (Optional)</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      placeholder="e.g. Best Seller, New, 20% OFF"
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="flashSaleCheck"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="flashSaleCheck" className="font-medium text-gray-700 cursor-pointer">
                    Feature on Homepage Flash Sale with Live Countdown
                  </label>
                </div>

              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
