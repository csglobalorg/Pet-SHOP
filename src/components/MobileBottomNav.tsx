import React from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  User, 
  MessageCircle,
  Home
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/initialData';

interface MobileBottomNavProps {
  onOpenAccountModal: (tab?: 'account' | 'privilege' | 'giftcards' | 'grooming') => void;
  onSelectCategory?: (category: any) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onOpenAccountModal,
  onSelectCategory
}) => {
  const { cart, setIsCartOpen } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCategories = () => {
    const el = document.getElementById('product-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    if (onSelectCategory) onSelectCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1 safe-area-pb"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* 1. Categories (Matches screenshot) */}
        <button
          onClick={scrollToCategories}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-[#4a154b] transition-colors cursor-pointer group"
        >
          <LayoutGrid className="w-5 h-5 text-slate-700 group-hover:text-[#4a154b] transition-colors" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-slate-700">
            Categories
          </span>
        </button>

        {/* 2. My Basket (Matches screenshot with badge) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-[#4a154b] transition-colors cursor-pointer group relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-[#4a154b] transition-colors" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white font-black rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-slate-700">
            My Basket
          </span>
        </button>

        {/* 3. Center Elevated Home Button (Matches screenshot with cute circular logo) */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center -mt-4 cursor-pointer group"
          aria-label="Home"
        >
          <div className="w-12 h-12 rounded-full bg-white border-2 border-[#4a154b] p-0.5 shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img 
              src="/brand_logo.png" 
              alt="Home" 
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/original_logo.jpg';
              }}
            />
          </div>
        </button>

        {/* 4. My Profile (Matches screenshot) */}
        <button
          onClick={() => onOpenAccountModal('account')}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-[#4a154b] transition-colors cursor-pointer group"
        >
          <User className="w-5 h-5 text-slate-700 group-hover:text-[#4a154b] transition-colors" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-slate-700">
            My Profile
          </span>
        </button>

        {/* 5. Chat (Matches screenshot with Message bubble) */}
        <a
          href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop!')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-emerald-600 transition-colors cursor-pointer group"
        >
          <MessageCircle className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-slate-700">
            Chat
          </span>
        </a>

      </div>
    </nav>
  );
};
