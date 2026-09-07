import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  Tag, 
  ShoppingBag, 
  PhoneCall, 
  MessageCircle, 
  Store, 
  RotateCcw,
  Sparkles,
  Plus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory, AnimalType } from '../types';
import { STORE_INFO } from '../data/initialData';

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
  const { products, openAdminPortal, isAdminAuthenticated } = useStore();

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

  const categories: { label: string; labelBn: string; value: ProductCategory | 'All' }[] = [
    { label: 'All Products', labelBn: 'সব পণ্য', value: 'All' },
    { label: 'Pet Food', labelBn: 'খাবার (Food)', value: 'Pet Food' },
    { label: 'Litter & Hygiene', labelBn: 'লিটার ও হাইজিন', value: 'Litter & Hygiene' },
    { label: 'Accessories & Toys', labelBn: 'এক্সেসরিজ ও খেলনা', value: 'Accessories & Toys' },
    { label: 'Grooming Essentials', labelBn: 'গ্রুমিং আইটেম', value: 'Grooming Essentials' },
    { label: 'Healthcare & First Aid', labelBn: 'ওষুধ ও হেলথকেয়ার', value: 'Healthcare & First Aid' }
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

  const isTotalCatalogEmpty = products.length === 0;

  return (
    <section id="product-catalog-section" className="space-y-6 pt-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {selectedCategory === 'All' ? 'পণ্য ক্যাটালগ (Store Catalog)' : selectedCategory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ১০০% খাঁটি ও অথেনটিক পেট সাপ্লাই • {filteredProducts.length} টি পণ্য প্রদর্শিত
          </p>
        </div>

        {/* Sort & Animal & In-Stock Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          
          {/* Animal Type selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => handleAnimalChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল পেট
            </button>
            <button
              onClick={() => handleAnimalChange('cat')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'cat' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বিড়াল (Cat)
            </button>
            <button
              onClick={() => handleAnimalChange('dog')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'dog' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              কুকুর (Dog)
            </button>
            <button
              onClick={() => handleAnimalChange('bird')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'bird' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              পাখি (Bird)
            </button>
            <button
              onClick={() => handleAnimalChange('rabbit')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeAnimal === 'rabbit' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              খরগোশ
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* In Stock toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer shadow-xs hover:border-slate-300 transition-colors select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
              />
              <span>স্টকে আছে</span>
            </label>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy || 'popular'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="popular">জনপ্রিয়তা</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
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
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.value
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            {cat.labelBn}
          </button>
        ))}
      </div>

      {/* Brand Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-xs font-medium flex items-center gap-1 shrink-0">
          <Tag className="w-3 h-3 text-slate-500" />
          ব্র্যান্ড:
        </span>
        {featuredBrands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedBrand === brand
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            {brand === 'All' ? 'সকল ব্র্যান্ড' : brand}
          </button>
        ))}
      </div>

      {/* Products Grid or Boutique Human Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : isTotalCatalogEmpty ? (
        /* Authentic Human Boutique Empty State When 0 Products in DB */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center space-y-6 shadow-xs max-w-3xl mx-auto">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center text-amber-700 border border-amber-200/60 shadow-2xs">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>নতুন অথেনটিক স্টক শপে এসে পৌঁছেছে</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pt-1">
              ক্যাটালগে নতুন পণ্য আপলোড চলছে
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              কক্সবাজারের শোরুমে Reflex Plus, SmartHeart, Drools, Me-O, ক্যাট লিটার ও এক্সেসরিজের ফ্রেশ লট এসে পৌঁছেছে। অনলাইনে পণ্য যুক্ত করার কাজ চলমান রয়েছে। যেকোনো পণ্যের তাৎক্ষণিক অর্ডার বা হোম ডেলিভারির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I would like to know the price and availability of pet products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
            </a>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-slate-700" />
              <span>সরাসরি কল করুন ({STORE_INFO.phone})</span>
            </a>

            {/* Admin Quick Action Button */}
            {isAdminAuthenticated ? (
              <button
                onClick={() => openAdminPortal('products')}
                className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ প্রোডাক্ট যোগ করুন (Admin)</span>
              </button>
            ) : null}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <span>শোরুম খোলা: প্রতিদিন সকাল ১০:০০ টা – রাত ১০:০০ টা | চট্টগ্রাম রোড, কক্সবাজার</span>
          </div>

        </div>
      ) : (
        /* Filter Reset State when filters return 0 results */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">এই ফিল্টারে কোনো পণ্য মেলেনি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা ব্র্যান্ড নির্বাচন করুন অথবা ফিল্টার রিসেট করুন।
            </p>
          </div>
          <button
            onClick={() => {
              onSelectCategory('All');
              setSelectedBrand('All');
              handleAnimalChange('all');
              setInStockOnly(false);
              setInternalSearch('');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>ফিল্টার রিসেট করুন</span>
          </button>
        </div>
      )}
    </section>
  );
};
