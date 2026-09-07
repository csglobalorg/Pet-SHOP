import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
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

  const slides = [
    {
      id: 1,
      tagline: "COX'S BAZAR PET SHOP",
      subline: "YOUR PET, OUR PASSION",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'All' as ProductCategory | 'All',
      actionText: "Shop Now"
    },
    {
      id: 2,
      tagline: "PREMIUM CAT & DOG FOOD",
      subline: "REFLEX PLUS • SMARTHEART • DROOLS • ME-O",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'Pet Food' as ProductCategory,
      actionText: "Explore Pet Food"
    },
    {
      id: 3,
      tagline: "CAT LITTER & ACCESSORIES",
      subline: "ODOR-LOCK BENTONITE • COLLARS • CARRIERS",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&auto=format&fit=crop&q=80",
      actionCategory: 'Litter & Hygiene' as ProductCategory,
      actionText: "Shop Accessories"
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
    <div className="w-full">
      {/* Banner Container matching Mew Mew Shop BD style */}
      <div 
        onClick={handleBannerClick}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs group cursor-pointer bg-[#fcf9f6]"
      >
        {/* Banner Graphic Canvas */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] w-full overflow-hidden">
          <img
            src={current.image}
            alt="Cox's Bazar Pet Shop Banner"
            className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay for crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent sm:w-2/3" />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 max-w-xl space-y-2 sm:space-y-3 z-10">
            
            {/* Playful Brand Header matching Mew Mew Shop BD typography */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-[#4a154b] tracking-wider uppercase bg-[#4a154b]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                COX'S BAZAR PREMIER PET CARE
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 font-sans leading-none">
                COX'S BAZAR <br />
                <span className="text-[#4a154b]">PET SHOP & CARE</span>
              </h1>
            </div>

            {/* Feature Pills exactly matching the Mew Mew Shop screenshot */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
                <ShoppingBag className="w-3 h-3 text-[#4a154b]" />
                <span>PREMIUM QUALITY</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>PET ESSENTIALS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-700 shadow-2xs">
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
