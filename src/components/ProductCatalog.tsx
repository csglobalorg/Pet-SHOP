import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Check, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory, AnimalType } from '../types';
import { SamsungEmoji } from './SamsungEmoji';

interface ProductCatalogProps {
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | 'All') => void;
  externalSearchQuery?: string;
  selectedAnimal?: AnimalType;
  onSelectAnimal?: (animal: AnimalType) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  externalSearchQuery = '',
  selectedAnimal = 'all',
  onSelectAnimal
}) => {
  const { products } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [internalAnimal, setInternalAnimal] = useState<AnimalType>(selectedAnimal);
  const [internalSearch, setInternalSearch] = useState('');

  // Keep internalAnimal synced if parent updates
  React.useEffect(() => {
    setInternalAnimal(selectedAnimal);
  }, [selectedAnimal]);

  const activeAnimal = internalAnimal;
  const handleAnimalChange = (animal: AnimalType) => {
    setInternalAnimal(animal);
    if (onSelectAnimal) {
      onSelectAnimal(animal);
    }
  };

  const categories: { label: string; value: ProductCategory | 'All' }[] = [
    { label: '✨ All Products', value: 'All' },
    { label: 'Pet Food', value: 'Pet Food' },
    { label: 'Litter & Hygiene', value: 'Litter & Hygiene' },
    { label: 'Accessories & Toys', value: 'Accessories & Toys' },
    { label: 'Grooming Essentials', value: 'Grooming Essentials' },
    { label: 'Healthcare & First Aid', value: 'Healthcare & First Aid' }
  ];

  const featuredBrands = [
    'All',
    'Reflex Plus',
    'SmartHeart',
    'Drools',
    'Me-O',
    'Whiskas',
    'Lara',
    'Bioline',
    'Sanicat'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'All' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Animal filter
      if (activeAnimal !== 'all' && product.animalType !== 'all' && product.animalType !== activeAnimal) {
        return false;
      }
      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Search filter
      const activeSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();
      if (activeSearch) {
        const matchesTitle = product.title.toLowerCase().includes(activeSearch);
        const matchesBrand = product.brand.toLowerCase().includes(activeSearch);
        const matchesCat = product.category.toLowerCase().includes(activeSearch);
        const matchesSku = product.sku.toLowerCase().includes(activeSearch);
        if (!matchesTitle && !matchesBrand && !matchesCat && !matchesSku) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [products, selectedCategory, selectedBrand, activeAnimal, inStockOnly, externalSearchQuery, internalSearch, sortBy]);

  return (
    <section id="product-catalog-section" className="space-y-6 pt-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {selectedCategory === 'All' ? 'All Pet Supplies' : selectedCategory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Original pet food, care & accessories • {filteredProducts.length} items available
          </p>
        </div>

        {/* Sort & Animal & Quick In-Stock Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          
          {/* Animal Type selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => handleAnimalChange('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'all' ? 'bg-white text-purple-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pets
            </button>
            <button
              onClick={() => handleAnimalChange('cat')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                activeAnimal === 'cat' ? 'bg-white text-purple-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SamsungEmoji emoji="🐱" size="xs" />
              <span>Cats</span>
            </button>
            <button
              onClick={() => handleAnimalChange('dog')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                activeAnimal === 'dog' ? 'bg-white text-purple-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SamsungEmoji emoji="🐶" size="xs" />
              <span>Dogs</span>
            </button>
            <button
              onClick={() => handleAnimalChange('rabbit')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                activeAnimal === 'rabbit' ? 'bg-white text-purple-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SamsungEmoji emoji="🐰" size="xs" />
              <span>Rabbits</span>
            </button>
            <button
              onClick={() => handleAnimalChange('bird')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                activeAnimal === 'bird' ? 'bg-white text-purple-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SamsungEmoji emoji="🦜" size="xs" />
              <span>Birds</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* In Stock toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer shadow-xs hover:border-purple-300 transition-colors select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
              />
              <span>In Stock</span>
            </label>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Category Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.value
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            {cat.value === 'All' ? (
              <span className="inline-flex items-center gap-1.5">
                <SamsungEmoji emoji="✨" size="xs" />
                <span>All Products</span>
              </span>
            ) : (
              cat.label
            )}
          </button>
        ))}
      </div>

      {/* Brand Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-xs font-medium flex items-center gap-1 shrink-0">
          <Tag className="w-3 h-3 text-purple-600" />
          Brand:
        </span>
        {featuredBrands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedBrand === brand
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            {brand === 'All' ? 'All Brands' : brand}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center border border-slate-200 shadow-xs">
            <SamsungEmoji emoji="🐾" size="md" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or search with a different keyword. New supplies arrive frequently.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              setSelectedBrand('All');
              handleAnimalChange('all');
              setInStockOnly(false);
              setInternalSearch('');
            }}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
