import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  MessageCircle,
  Tag,
  Gift,
  ExternalLink,
  Award,
  CheckCircle,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { POPULAR_BRANDS, STORE_INFO, BLOG_POSTS, TESTIMONIALS } from '../data/initialData';
import { ProductCategory, AnimalType } from '../types';

interface MewMewStoreSectionsProps {
  onSelectCategory: (cat: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => void;
  onOpenAccountModal?: (tab?: 'account' | 'privilege' | 'giftcards' | 'grooming') => void;
}

export const MewMewStoreSections: React.FC<MewMewStoreSectionsProps> = ({
  onSelectCategory,
  onOpenAccountModal
}) => {
  const { products, addToCart, setSelectedProductForDetail } = useStore();
  const [selectedAccessoryTab, setSelectedAccessoryTab] = useState<'toys' | 'litter' | 'health' | 'collar' | 'feeding'>('toys');

  // Filter products for each section
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  const catProducts = products.filter(p => p.animalType === 'cat' && !p.isFlashSale).slice(0, 4);
  const dogProducts = products.filter(p => p.animalType === 'dog').slice(0, 4);
  const healthProducts = products.filter(p => p.category === 'Healthcare & First Aid' || p.category === 'Grooming Essentials').slice(0, 4);
  const topSellingCatFood = products.filter(p => p.category === 'Pet Food' && p.animalType === 'cat').slice(1, 5);

  const accessoryProducts = products.filter(p => {
    if (selectedAccessoryTab === 'toys') return p.category === 'Accessories & Toys' && (p.tags?.includes('toy') || p.title.toLowerCase().includes('toy') || p.title.toLowerCase().includes('mouse') || p.title.toLowerCase().includes('ball'));
    if (selectedAccessoryTab === 'litter') return p.category === 'Litter & Hygiene';
    if (selectedAccessoryTab === 'health') return p.category === 'Healthcare & First Aid' || p.category === 'Grooming Essentials';
    if (selectedAccessoryTab === 'collar') return p.tags?.includes('collar') || p.title.toLowerCase().includes('collar');
    if (selectedAccessoryTab === 'feeding') return p.tags?.includes('bowl') || p.tags?.includes('feeding') || p.title.toLowerCase().includes('bowl');
    return true;
  }).slice(0, 8);

  const scrollToCatalog = () => {
    const el = document.getElementById('product-catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 sm:space-y-12">

      {/* ================= 1. PROMO BANNER STRIP ================= */}
      <div className="bg-gradient-to-r from-[#4a154b] via-[#631c64] to-[#4a154b] text-white rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Gift className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5">
              <span>প্রথম অর্ডারে পান ৫% ফ্ল্যাট ছাড়!</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                কুপন: CBZ5
              </span>
            </div>
            <p className="text-[11px] text-purple-200">
              কক্সবাজার সদরে দ্রুততম হোম ডেলিভারি ও ১০০% অরিজিনাল পেট ফুড নিশ্চয়তা
            </p>
          </div>
        </div>

        <button 
          onClick={scrollToCatalog}
          className="px-4 py-1.5 bg-white text-[#4a154b] hover:bg-purple-50 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
        >
          অর্ডার করুন &gt;
        </button>
      </div>

      {/* ================= 2. FLASH SALE SECTION ================= */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <h2 className="text-base sm:text-xl font-black text-[#4a154b] tracking-tight uppercase">
                Flash Sale
              </h2>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                HOT DEALS
              </span>
            </div>
            
            <button 
              onClick={() => {
                onSelectCategory('All', 'all', 'flash sale');
                scrollToCatalog();
              }}
              className="text-xs font-bold text-[#4a154b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {flashSaleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ================= 3. TURKISH NO. 1 BRAND BANNER STRIP ================= */}
      <div 
        onClick={() => {
          onSelectCategory('Pet Food', 'cat', 'Reflex');
          scrollToCatalog();
        }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-4 sm:p-8 cursor-pointer group shadow-sm"
      >
        <div className="relative z-10 max-w-xl text-white space-y-2">
          <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
            AUTHENTIC IMPORT
          </span>
          <h3 className="text-lg sm:text-3xl font-black tracking-tight leading-tight">
            TURKISH NO. 1 CAT & DOG NUTRITION <br />
            <span className="text-purple-300">REFLEX PLUS • 100% SEALPACK</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Rich in XOS Prebiotics, Omega 3 & 6 for silky coat, strong immunity, and easy digestion.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#4a154b] rounded-full text-xs font-bold group-hover:bg-purple-50 transition-colors">
              <span>Explore Reflex Collection</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 sm:opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80')" }} />
      </div>

      {/* ================= 4. FOR YOUR CAT SECTION ================= */}
      {catProducts.length > 0 && (
        <section className="space-y-4">
          {/* Header Banner matching Mew Mew Shop */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-purple-50 p-4 sm:p-5 border border-purple-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4a154b] shadow-xs">
                <img 
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80" 
                  alt="Cat"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#4a154b] uppercase tracking-wider block">
                  FOR YOUR
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#4a154b] tracking-tight leading-none">
                  CAT
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('Pet Food', 'cat');
                scrollToCatalog();
              }}
              className="text-xs font-bold text-[#4a154b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {catProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ================= 5. FOR YOUR DOG SECTION ================= */}
      {dogProducts.length > 0 && (
        <section className="space-y-4">
          {/* Header Banner matching Mew Mew Shop */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-purple-50 to-pink-50 p-4 sm:p-5 border border-purple-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-800 shadow-xs">
                <img 
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=200&auto=format&fit=crop&q=80" 
                  alt="Dog"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                  FOR YOUR
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-purple-900 tracking-tight leading-none">
                  DOG
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('Pet Food', 'dog');
                scrollToCatalog();
              }}
              className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {dogProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ================= 6. TICK & FLEA CONTROL SECTION ================= */}
      {healthProducts.length > 0 && (
        <section className="space-y-4">
          {/* Header Banner matching Mew Mew Shop */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-purple-50 to-pink-50 p-4 sm:p-5 border border-purple-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-700 shadow-xs flex items-center justify-center bg-white">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  HEALTH & HYGIENE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight leading-none">
                  FLEA & TICK CONTROL
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('Healthcare & First Aid', 'all', 'flea');
                scrollToCatalog();
              }}
              className="text-xs font-bold text-[#4a154b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {healthProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ================= 7. FEATURED BRANDS SECTION ================= */}
      <section className="space-y-3 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-[#4a154b] uppercase tracking-wider">
            Featured Brands
          </h3>
          <span className="text-xs font-bold text-[#4a154b] hover:underline cursor-pointer">
            See All &gt;
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-3 items-center">
          {POPULAR_BRANDS.map((b, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectCategory('Pet Food', 'all', b.name);
                scrollToCatalog();
              }}
              className="p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-[#4a154b] bg-white hover:bg-purple-50/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#4a154b] transition-colors tracking-tight">
                {b.logoText}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 truncate w-full">
                {b.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= 8. TOP SELLER CAT FOOD SECTION ================= */}
      {topSellingCatFood.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-[#4a154b] tracking-tight uppercase">
              TOP SELLER CAT FOOD
            </h2>
            <button 
              onClick={() => {
                onSelectCategory('Pet Food', 'cat');
                scrollToCatalog();
              }}
              className="text-xs font-bold text-[#4a154b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {topSellingCatFood.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ================= 9. PLATINUM MEMBERSHIP CARD VIP BANNER ================= */}
      <div 
        onClick={() => onOpenAccountModal?.('privilege')}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2a082c] via-[#4a154b] to-[#2a082c] p-5 sm:p-8 text-white cursor-pointer shadow-md group border border-purple-400/20"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              PLATINUM PRIVILEGE
            </span>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Receive a Gift of <span className="text-amber-300">5000৳</span> <br className="hidden sm:inline" />
              with PLATINUM MEMBERSHIP CARD
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Enjoy 10% instant discount on all food & accessories, free home delivery anywhere in Cox's Bazar, and VIP grooming lounge access.
            </p>
          </div>

          <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-full font-black text-xs uppercase tracking-wider shadow-lg transition-transform group-hover:scale-105 shrink-0 cursor-pointer">
            Get Membership Card
          </button>
        </div>
      </div>

      {/* ================= 10. INTERACTIVE ACCESSORY TABS & SHOWCASE ================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        {/* Tab Switcher matching Mew Mew Shop */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {[
            { id: 'toys', label: 'Cat Toys' },
            { id: 'litter', label: 'Cat Litter' },
            { id: 'health', label: 'Cat Care & Health' },
            { id: 'collar', label: 'Collar' },
            { id: 'feeding', label: 'Feeding & Bowls' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedAccessoryTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedAccessoryTab === tab.id
                  ? 'bg-[#4a154b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {accessoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= 11. STORE SEO / TRUST INFORMATION BOX ================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200/90 text-center space-y-3">
        <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
          Your Trusted Online Pet Store in Cox's Bazar
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Cox's Bazar Pet Shop & Care is dedicated to providing authentic pet food, safe cat litter, veterinary healthcare essentials, and premium accessories for dogs, cats, birds, and rabbits across Chittagong and Cox's Bazar. All pet foods are directly imported, 100% sealed, and stored in climate-controlled conditions.
        </p>
      </section>

      {/* ================= 12. BLOG / ADVICE GUIDES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-xl font-black text-[#4a154b] tracking-tight uppercase">
            Pet Care Guides & News
          </h3>
          <span className="text-xs font-bold text-[#4a154b] hover:underline cursor-pointer">
            View All Blogs &gt;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BLOG_POSTS.map(post => (
            <div 
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#4a154b] uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#4a154b] transition-colors line-clamp-2 mt-1">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{post.readTime}</span>
                  <span className="text-[#4a154b] font-bold">Read More &gt;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 13. LOVED BY PET PARENTS (CUSTOMER REVIEWS) ================= */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-[#4a154b] uppercase tracking-widest">
            COMMUNITY LOVE
          </span>
          <h3 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
            Loved By Thousands of Happy Customers
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Discover genuine experiences, real feedback, and stories from our verified pet parents across Cox's Bazar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((review, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-9 h-9 rounded-full object-cover border border-purple-200" 
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{review.name}</h5>
                  <span className="text-[10px] text-slate-400 block">{review.location} • {review.pet}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 14. APP & 1-CLICK WHATSAPP ORDER BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 sm:p-10 border border-purple-200 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] font-bold text-[#4a154b] uppercase tracking-wider bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">
            FAST & CONVENIENT
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your pet's shop, now in your pocket.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Food, litter, toys and vet essentials delivered across Cox's Bazar. Reorder your pet's favourites in one tap on WhatsApp, follow your delivery live, and get a nudge the moment a treat is back in stock.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I want to order pet food.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp (1-Click)</span>
            </a>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4a154b] hover:bg-[#3c103d] text-white font-bold text-xs shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline: {STORE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
