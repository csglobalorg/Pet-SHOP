import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronRight, 
  Truck, 
  Sparkles, 
  ChevronDown,
  Fish,
  Bone,
  Sparkle,
  Utensils,
  ShieldCheck,
  Smile,
  Activity,
  Package,
  Layers,
  Tag
} from 'lucide-react';
import { ProductCategory, AnimalType } from '../types';

interface HeroBannerProps {
  onSelectCategory: (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => void;
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onScrollToCatalog
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const sidebarCategories = [
    { name: 'Cat Food', category: 'Pet Food' as ProductCategory, animal: 'cat' as AnimalType, icon: Fish },
    { name: 'Dog Food', category: 'Pet Food' as ProductCategory, animal: 'dog' as AnimalType, icon: Bone },
    { name: 'Cat Litter & Hygiene', category: 'Litter & Hygiene' as ProductCategory, animal: 'cat' as AnimalType, icon: Layers },
    { name: 'Feeding & Bowls', category: 'Accessories & Toys' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'bowl', icon: Utensils },
    { name: 'Collar & Harness', category: 'Accessories & Toys' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'collar', icon: ShieldCheck },
    { name: 'Grooming & Care', category: 'Grooming Essentials' as ProductCategory, animal: 'all' as AnimalType, icon: Sparkle },
    { name: 'Flea & Tick Control', category: 'Healthcare & First Aid' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'flea', icon: Activity },
    { name: 'Cat & Dog Toys', category: 'Accessories & Toys' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'toy', icon: Smile },
    { name: 'Cages & Carriers', category: 'Accessories & Toys' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'carrier', icon: Package },
    { name: 'Special Offers', category: 'Pet Food' as ProductCategory, animal: 'all' as AnimalType, searchTag: 'flash sale', icon: Tag }
  ];

  const slides = [
    {
      id: 1,
      tagline: "COX'S BAZAR PREMIER PET CARE",
      headline: "COX'S BAZAR",
      subHeadline: "PET SHOP & CARE",
      subline: "YOUR PET, OUR PASSION",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'All' as ProductCategory | 'All',
      actionText: "Shop Now"
    },
    {
      id: 2,
      tagline: "AUTHENTIC IMPORTED NUTRITION",
      headline: "PREMIUM PET FOOD",
      subHeadline: "& NUTRITION",
      subline: "REFLEX PLUS • SMARTHEART • DROOLS • NEKKO",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'Pet Food' as ProductCategory,
      actionText: "Explore Pet Food"
    },
    {
      id: 3,
      tagline: "CLEAN LIVING & HEALTHCARE",
      headline: "CAT LITTER &",
      subHeadline: "VET ESSENTIALS",
      subline: "ODOR-LOCK BENTONITE • FLEA SPOT-ON • GROOMING",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'Litter & Hygiene' as ProductCategory,
      actionText: "Shop Hygiene"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  const handleBannerClick = () => {
    onSelectCategory(current.actionCategory);
    onScrollToCatalog();
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
      
      {/* ================= DESKTOP VERTICAL CATEGORY SIDEBAR (Laptop View - Image 1) ================= */}
      <div className="hidden lg:block w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="bg-[#4a154b] text-white px-4 py-3 flex items-center justify-between font-bold text-xs tracking-wider uppercase">
          <span>Categories</span>
          <ChevronDown className="w-4 h-4 text-purple-200" />
        </div>
        
        <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
          {sidebarCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectCategory(item.category, item.animal, item.searchTag);
                  onScrollToCatalog();
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-purple-50/70 hover:text-[#4a154b] transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#4a154b] transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= HERO CAROUSEL BANNER (Laptop & Mobile View) ================= */}
      <div className="flex-1 min-w-0">
        <div 
          onClick={handleBannerClick}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs group cursor-pointer bg-[#fcf9f6] h-full min-h-[220px] sm:min-h-[320px] lg:min-h-[390px] flex flex-col justify-center"
        >
          {/* Banner Graphic Canvas */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={current.image}
              alt="Cox's Bazar Pet Shop Banner"
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay for crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent w-full sm:w-2/3" />
          </div>

          {/* Overlay Content */}
          <div className="relative flex flex-col justify-center px-4 sm:px-8 md:px-12 max-w-xl space-y-2 sm:space-y-3 z-10 py-6">
            
            {/* Playful Brand Header matching Mew Mew Shop BD typography */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-[#4a154b] tracking-wider uppercase bg-[#4a154b]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {current.tagline}
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 font-sans leading-none">
                {current.headline} <br />
                <span className="text-[#4a154b]">{current.subHeadline}</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1">
                {current.subline}
              </p>
            </div>

            {/* Feature Pills exactly matching the Mew Mew Shop screenshot */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-white/95 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
                <ShoppingBag className="w-3 h-3 text-[#4a154b]" />
                <span>PREMIUM QUALITY</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-white/95 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>PET ESSENTIALS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-white/95 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>FAST & SAFE DELIVERY</span>
              </span>
            </div>

            {/* Quick Action Link */}
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#4a154b] group-hover:underline">
                <span>{current.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

          </div>

          {/* Dots Indicator at Bottom Center matching screenshot */}
          <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 bg-[#4a154b]'
                    : 'w-1.5 bg-slate-400/60 hover:bg-slate-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
