import React from 'react';
import { 
  ShoppingBag, 
  Scissors, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles,
  ChevronRight,
  Heart
} from 'lucide-react';
import { ProductCategory, AnimalType } from '../types';
import { STORE_INFO } from '../data/initialData';
import { useStore } from '../context/StoreContext';

interface HeroSectionProps {
  onSelectCategory: (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => void;
  onScrollToCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  onScrollToCatalog
}) => {
  const { openBookingModalForService, services } = useStore();

  const handleCategoryClick = (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => {
    onSelectCategory(category, animal, searchTag);
    onScrollToCatalog();
  };

  const handleBookGrooming = () => {
    const groomingService = services.find(s => s.id === 'srv-grooming') || services[0];
    openBookingModalForService(groomingService);
  };

  const categoryCards: {
    title: string;
    titleBn: string;
    category: ProductCategory | 'All';
    animal?: AnimalType;
    icon: string;
    description: string;
  }[] = [
    {
      title: 'Cat Food & Nutrition',
      titleBn: 'ক্যাট ফুড ও নিউট্রিশন',
      category: 'Pet Food',
      animal: 'cat',
      icon: '🐱',
      description: 'Reflex Plus, Me-O, Whiskas & Gravy'
    },
    {
      title: 'Dog Food & Treats',
      titleBn: 'ডগ ফুড ও চিবানো ট্রিট',
      category: 'Pet Food',
      animal: 'dog',
      icon: '🐶',
      description: 'Drools, SmartHeart & Puppy growth'
    },
    {
      title: 'Clumping Cat Litter',
      titleBn: 'ক্যাট লিটার ও হাইজিন',
      category: 'Litter & Hygiene',
      animal: 'cat',
      icon: '✨',
      description: 'Bentonite, Charcoal odor-lock & trays'
    },
    {
      title: 'Accessories & Carriers',
      titleBn: 'এক্সেসরিজ ও ক্যারিয়ার',
      category: 'Accessories & Toys',
      animal: 'all',
      icon: '🎒',
      description: 'Astronaut bags, harness & sisal trees'
    },
    {
      title: 'Grooming & Health Care',
      titleBn: 'গ্রুমিং ও হেলথ কেয়ার',
      category: 'Healthcare & First Aid',
      animal: 'all',
      icon: '🌿',
      description: 'Anti-tick shampoo, vitamins & first aid'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Main Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Authentic Local Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>কক্সবাজারের বিশ্বস্ত পেট শপ ও কেয়ার সেন্টার</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-medium">Daily 10 AM – 10 PM</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  আপনার প্রিয় পোষ্যের <br />
                  <span className="text-slate-900">খাঁটি পুষ্টি ও স্বাস্থ্যকর যত্ন</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl pt-1">
                  কক্সবাজারে সরাসরি আমদানিকৃত অথেনটিক পেট ফুড, ক্যাট লিটার, এক্সেসরিজ, প্রফেশনাল গ্রুমিং স্পা এবং নির্ভরযোগ্য ফস্টার বোর্ডিং সেবা।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={onScrollToCatalog}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>পণ্য ক্যাটালগ দেখুন</span>
                </button>

                <button
                  onClick={handleBookGrooming}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:border-slate-400 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Scissors className="w-4 h-4 text-purple-600" />
                  <span>গ্রুমিং বুকিং</span>
                </button>

                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>{STORE_INFO.phone}</span>
                </a>
              </div>

              {/* 3 Real Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-900">দ্রুত ডেলিভারি</span>
                    <span className="text-[11px] text-slate-500">কক্সবাজার শহরে ২৪-৪৮ ঘণ্টা</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-900">১০০% অথেনটিক ফুড</span>
                    <span className="text-[11px] text-slate-500">অরিজিনাল সিলপ্যাক গ্যারান্টি</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-900">সরাসরি শোরুম সাপোর্ট</span>
                    <span className="text-[11px] text-slate-500">প্রতিদিন ১০ AM – ১০ PM</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 aspect-4/3 sm:aspect-5/4 lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000&auto=format&fit=crop&q=80"
                  alt="Pet care and nutrition at Cox's Bazar Pet Shop"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Minimal Overlay Card */}
                <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none">
                        Reflex • SmartHeart • Drools • Me-O
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        International nutrition & care essentials
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I would like to order pet supplies.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0 shadow-2xs"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Category Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryCards.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(item.category, item.animal)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 hover:shadow-sm transition-all text-left group cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl select-none">{item.icon}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                {item.titleBn}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
