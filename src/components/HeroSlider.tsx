import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  ShoppingBag, 
  MessageCircle, 
  Heart,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import { ProductCategory, AnimalType } from '../types';
import { STORE_INFO } from '../data/initialData';

interface HeroSliderProps {
  onSelectCategory: (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => void;
  onScrollToCatalog?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ 
  onSelectCategory, 
  onScrollToCatalog 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: 'FAST & SAFE DELIVERY',
      title: "Cox's Bazar Pet Shop & Care",
      subtitle: 'PREMIUM FOOD • HYGIENE • 24-48H LOCAL DELIVERY',
      description: "Authentic imported dry kibble, nutritious gravy pouches, clumping cat litter, and grooming essentials delivered to your door.",
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Shop Essentials',
      buttonAction: () => handleCategoryClick('All')
    },
    {
      id: 2,
      tag: '100% AUTHENTIC NUTRITION',
      title: 'Reflex Plus & Whiskas Specials',
      subtitle: 'DIRECTLY IMPORTED ORIGINAL PACKS',
      description: 'Reflex Plus Kitten & Adult, Me-O Seafood, Whiskas tuna gravy, and Drools nutrition in stock at verified prices.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Explore Pet Food',
      buttonAction: () => handleCategoryClick('Pet Food', 'cat')
    },
    {
      id: 3,
      tag: 'COMFORT & HYGIENE',
      title: 'Accessories, Carriers & Litter',
      subtitle: 'COLLARS, ASTRONAUT BAGS & ODOR-LOCK LITTER',
      description: 'Keep your pets playful and pristine with astronaut travel backpacks, sisal scratching posts, and gentle grooming kits.',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Browse Accessories',
      buttonAction: () => handleCategoryClick('Accessories & Toys')
    }
  ];

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCategoryClick = (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => {
    onSelectCategory(category, animal, searchTag);
    if (onScrollToCatalog) {
      onScrollToCatalog();
    } else {
      const catalogEl = document.getElementById('product-catalog-section');
      catalogEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sidebarCategories = [
    { 
      name: 'Cat Food', 
      icon: '🐱', 
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
    },
    { 
      name: 'Cat Toys', 
      icon: '🧶', 
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'cat' as AnimalType,
    },
    { 
      name: 'Cat Litter', 
      icon: '🚽', 
      category: 'Litter & Hygiene' as ProductCategory,
      animal: 'cat' as AnimalType,
    },
    { 
      name: 'Cat Care & Health', 
      icon: '🏥', 
      category: 'Healthcare & First Aid' as ProductCategory,
      animal: 'cat' as AnimalType,
    },
    { 
      name: 'Beds, Carriers & Apparel', 
      icon: '👕', 
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'all' as AnimalType,
    },
    { 
      name: 'Cat Accessories', 
      icon: '🐾', 
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'cat' as AnimalType,
    },
    { 
      name: 'Dog Care & Health', 
      icon: '🩺', 
      category: 'Healthcare & First Aid' as ProductCategory,
      animal: 'dog' as AnimalType,
    },
    { 
      name: 'Dog Food', 
      icon: '🐶', 
      category: 'Pet Food' as ProductCategory,
      animal: 'dog' as AnimalType,
    },
    { 
      name: 'Rabbit Food & Essentials', 
      icon: '🐰', 
      category: 'Pet Food' as ProductCategory,
      animal: 'rabbit' as AnimalType,
    },
    { 
      name: 'Bird Food & Feeder', 
      icon: '🦜', 
      category: 'Pet Food' as ProductCategory,
      animal: 'bird' as AnimalType,
    }
  ];

  const featuredCards = [
    {
      title: 'Cat Food',
      subtitle: 'Whiskas, Reflex & Me-O',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80',
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
      tag: 'dry food'
    },
    {
      title: 'Cat Treats',
      subtitle: 'Creamy Purees & Bites',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80',
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
      tag: 'treats'
    },
    {
      title: 'Collars & Harnesses',
      subtitle: 'Comfort leashes & tags',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=80',
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'cat' as AnimalType,
      tag: 'collar'
    },
    {
      title: 'Cat Litter',
      subtitle: 'Clumping & Odor-Lock',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=80',
      category: 'Litter & Hygiene' as ProductCategory,
      animal: 'cat' as AnimalType,
      tag: 'litter'
    },
    {
      title: 'Bowls & Hygiene',
      subtitle: 'Fountains, Scoops & Mats',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80',
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'cat' as AnimalType,
      tag: 'bowl'
    }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-100">
      
      {/* 1. Hero Container */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Clean Category Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden h-full flex flex-col justify-between">
              {sidebarCategories.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(item.category, item.animal, item.name)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left transition-all cursor-pointer group text-xs text-slate-700 hover:text-purple-700 hover:bg-purple-50/40 font-medium"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate group-hover:font-semibold transition-all">{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Modern Hero Banner */}
          <div className="lg:col-span-9">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 h-[340px] sm:h-[400px] lg:h-[430px] flex flex-col justify-between shadow-sm">
              
              {/* High-res Clean Background Image with soft dark gradient */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title} 
                  className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity transition-opacity duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-xl space-y-4 my-auto">
                
                {/* Clean tag pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase tracking-widest backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  <span>{slides[currentSlide].tag}</span>
                </div>

                {/* Clean, Modern Title */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-purple-300 uppercase">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
                  {slides[currentSlide].description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={slides[currentSlide].buttonAction}
                    className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{slides[currentSlide].buttonText}</span>
                  </button>

                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I would like to place an order.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm backdrop-blur-xs transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>

              </div>

              {/* Bottom Strip: Modern Dots & Location Notice */}
              <div className="relative z-10 px-6 sm:px-10 py-3 bg-slate-950/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
                
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === i ? 'w-6 bg-purple-400' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* City delivery info */}
                <div className="text-[11px] text-slate-400 font-medium">
                  Cox's Bazar Municipal Delivery • Call <strong className="text-white font-semibold">{STORE_INFO.phone}</strong>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. Featured Categories Section (Modern, Clean & Minimal) */}
      <section className="max-w-7xl mx-auto px-4 pt-2 pb-8 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700">
              FEATURED CATEGORIES
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Popular Pet Essentials
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Original food, clumping litter & accessories
          </p>
        </div>

        {/* Row of 5 Modern Clean Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {featuredCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(card.category, card.animal, card.tag)}
              className="group bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
            >
              {/* Image Container */}
              <div className="w-full h-28 sm:h-32 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center overflow-hidden mb-2.5 group-hover:bg-purple-50/40 transition-colors">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-normal">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
