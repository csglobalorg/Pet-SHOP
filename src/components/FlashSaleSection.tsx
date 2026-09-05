import React, { useState, useEffect } from 'react';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const FlashSaleSection: React.FC<{ onExploreAll?: () => void }> = ({ onExploreAll }) => {
  const { products } = useStore();

  // 12 hour countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);

  if (flashSaleProducts.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
            <Zap className="w-5 h-5 fill-current text-purple-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Special Flash Sale
              </h2>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Limited Time
              </span>
            </div>
            <p className="text-xs text-slate-500">Exclusive discounts on premium pet food and essentials for Cox's Bazar pet parents</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
          <Clock className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-semibold text-slate-700">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-xs">
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-slate-400">:</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-slate-400">:</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {flashSaleProducts.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

      {/* Footer link */}
      {onExploreAll && (
        <div className="text-center pt-2">
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer transition-colors"
          >
            <span>View All Flash Deals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
