import React, { useState } from 'react';
import { Sparkles, CreditCard, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { POPULAR_BRANDS } from '../data/initialData';
import { ProductCategory } from '../types';

interface CuratedSectionsProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const CuratedSections: React.FC<CuratedSectionsProps> = ({ onSelectCategory }) => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'cat' | 'dog' | 'health'>('cat');

  const catProducts = products.filter(p => p.animalType === 'cat' || p.category === 'Pet Food').slice(0, 4);
  const dogProducts = products.filter(p => p.animalType === 'dog').slice(0, 4);
  const healthProducts = products.filter(p => p.category === 'Healthcare & First Aid' || p.category === 'Grooming Essentials').slice(0, 4);

  const displayProducts = activeTab === 'cat' 
    ? catProducts 
    : activeTab === 'dog' 
    ? (dogProducts.length > 0 ? dogProducts : catProducts) 
    : healthProducts;

  return (
    <div className="space-y-10">
      
      {/* 1. Curated Collections with Sleek Modern Tabs */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Header with Title and Modern Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700">
              CURATED COLLECTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Top Picks for Your Companion
            </h2>
          </div>

          {/* Clean Modern Tab Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cat')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'cat'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐱 Cats
            </button>
            <button
              onClick={() => setActiveTab('dog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dog'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐶 Dogs
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ Care & Health
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {displayProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Explore More link */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onSelectCategory(activeTab === 'health' ? 'Healthcare & First Aid' : 'Pet Food')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors cursor-pointer group"
          >
            <span>View all {activeTab === 'cat' ? 'cat essentials' : activeTab === 'dog' ? 'dog supplies' : 'healthcare items'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. Modern Clean VIP Privilege Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-purple-300" />
              Cox's Bazar Pet Club Privilege
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Enjoy 5% Lifetime Savings with Platinum Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Earn complimentary lifetime Platinum Membership on qualifying orders of ৳5,000+ or join our annual grooming & wellness program.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 justify-center md:justify-start">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>5% Lifetime Discount</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Priority 24h Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Free Nutrition Advice</span>
              </div>
            </div>
          </div>

          {/* Minimalist Card Representation */}
          <div className="shrink-0">
            <div className="w-64 h-38 rounded-2xl bg-gradient-to-tr from-purple-900/90 via-slate-800 to-slate-900 p-4 border border-purple-400/20 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold tracking-wider text-purple-200 text-[11px] uppercase">Cox's Bazar Pet Shop</span>
                <CreditCard className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <p className="text-[9px] text-purple-300/70 uppercase tracking-widest font-medium">VIP MEMBER</p>
                <p className="text-base font-black tracking-widest text-white">PLATINUM CLUB</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>VALID: COX'S BAZAR</span>
                <span>CBZ-PET-4700</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Modern Clean Authentic Brands Showcase */}
      <section id="brands-section" className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Authentic Brand Partners</h2>
            <p className="text-xs text-slate-500">100% genuine imported pet nutrition and accessories</p>
          </div>
          <span className="text-xs text-purple-700 font-semibold hidden sm:inline">100% Genuine Imported</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {POPULAR_BRANDS.map((brand, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col items-center justify-center text-center gap-0.5 group"
            >
              <span className="text-xs font-bold text-slate-800 tracking-wide group-hover:text-purple-700 transition-colors">
                {brand.logoText}
              </span>
              <span className="text-[10px] text-slate-400 font-normal truncate max-w-full">
                {brand.origin}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
