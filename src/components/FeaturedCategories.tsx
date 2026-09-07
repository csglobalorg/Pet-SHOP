import React from 'react';
import { ProductCategory, AnimalType } from '../types';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'cat-adult-food',
      title: 'ADULT FOOD',
      titleBn: 'এডাল্ট ফুড',
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'adult',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-kitten-food',
      title: 'KITTEN FOOD',
      titleBn: 'কিটেন ফুড',
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'kitten',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-collar',
      title: 'COLLAR',
      titleBn: 'কলার ও বেল্ট',
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'all' as AnimalType,
      searchTag: 'collar',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'clumping-cat-litter',
      title: 'CLUMPING CAT LITTER',
      titleBn: 'ক্যাট লিটার',
      category: 'Litter & Hygiene' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'litter',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'litter-accessories',
      title: 'CAT LITTER ACCESSORIES',
      titleBn: 'লিটার ট্রে ও স্কুপ',
      category: 'Litter & Hygiene' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'scoop',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-harness',
      title: 'HARNESS',
      titleBn: 'হারনেস ও লিড',
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'all' as AnimalType,
      searchTag: 'harness',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-tick-flea',
      title: 'CAT TICK & FLEA CONTROL',
      titleBn: 'টিক ও ফ্লি কেয়ার',
      category: 'Healthcare & First Aid' as ProductCategory,
      animal: 'all' as AnimalType,
      searchTag: 'flea',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'deworming-tablet',
      title: 'DEWORMING TABLET',
      titleBn: 'কৃমির ঔষধ',
      category: 'Healthcare & First Aid' as ProductCategory,
      animal: 'all' as AnimalType,
      searchTag: 'deworm',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-pouches',
      title: 'CAT POUCHES',
      titleBn: 'ক্যাট পাউচ',
      category: 'Pet Food' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'pouch',
      image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'cat-toys',
      title: 'CAT TOYS',
      titleBn: 'বিড়ালের খেলনা',
      category: 'Accessories & Toys' as ProductCategory,
      animal: 'cat' as AnimalType,
      searchTag: 'toy',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const handleClick = (item: typeof categories[0]) => {
    onSelectCategory(item.category, item.animal, item.searchTag);
    const el = document.getElementById('product-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      
      {/* Centered Headline matching Mew Mew Shop */}
      <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
        <h2 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          Trusted Online Pet Shop in Bangladesh <br />
          <span className="text-slate-700">for Authentic Pet Food & Accessories</span>
        </h2>
        
        <h3 className="text-xs sm:text-sm font-extrabold text-[#4a154b] tracking-wider uppercase">
          FEATURED CATEGORIES
        </h3>
      </div>

      {/* Categories Grid (Matches 2 rows of 5 on desktop, and clean 2-column or 3-column on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-4">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-[#4a154b]/50 p-2 sm:p-3 flex flex-col items-center justify-between text-center transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.97]"
          >
            {/* Card Image Container */}
            <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Category Label below image matching exact Mew Mew Shop typography */}
            <div className="w-full">
              <span className="block text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight group-hover:text-[#4a154b] transition-colors uppercase leading-tight">
                {item.title}
              </span>
            </div>
          </button>
        ))}
      </div>

    </section>
  );
};
