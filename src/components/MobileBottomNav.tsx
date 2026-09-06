import React from 'react';
import { 
  Store, 
  Sparkles, 
  ShoppingBag, 
  User, 
  HeartHandshake,
  CalendarCheck2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onOpenAccountModal: (tab?: 'account' | 'privilege' | 'giftcards' | 'grooming') => void;
  onSelectCategory?: (category: any) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onOpenAccountModal,
  onSelectCategory
}) => {
  const { cart, setIsCartOpen, upcomingGroomingAppointments } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const hasGroomingAlert = upcomingGroomingAppointments.length > 0;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* 1. Shop / Home */}
        <button
          onClick={() => {
            if (onSelectCategory) onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-purple-700 transition-colors cursor-pointer group"
        >
          <Store className="w-5 h-5 group-active:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            Shop
          </span>
        </button>

        {/* 2. Services (Foster, Grooming, Cafe, Courier) */}
        <button
          onClick={() => scrollToSection('services-and-policies-section')}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-purple-700 transition-colors cursor-pointer group relative"
        >
          <Sparkles className="w-5 h-5 group-active:scale-110 transition-transform text-purple-700" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-purple-800">
            Services
          </span>
          <span className="absolute top-0 right-3 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>

        {/* 3. Pet Sale & Adoption */}
        <button
          onClick={() => scrollToSection('pet-sale-showcase-section')}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-purple-700 transition-colors cursor-pointer group"
        >
          <HeartHandshake className="w-5 h-5 group-active:scale-110 transition-transform text-rose-600" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            Pet Sale
          </span>
        </button>

        {/* 4. Cart with badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-purple-700 transition-colors cursor-pointer group relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-active:scale-110 transition-transform" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-purple-700 text-white font-black rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalCartCount > 9 ? '9+' : totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            {totalCartCount > 0 ? `৳${totalCartPrice.toLocaleString()}` : 'Cart'}
          </span>
        </button>

        {/* 5. Account / Reminders */}
        <button
          onClick={() => onOpenAccountModal(hasGroomingAlert ? 'grooming' : 'account')}
          className="flex flex-col items-center justify-center w-full py-1 text-slate-600 active:text-purple-700 transition-colors cursor-pointer group relative"
        >
          <div className="relative">
            {hasGroomingAlert ? (
              <CalendarCheck2 className="w-5 h-5 text-purple-700 group-active:scale-110 transition-transform" />
            ) : (
              <User className="w-5 h-5 group-active:scale-110 transition-transform" />
            )}
            {hasGroomingAlert && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${hasGroomingAlert ? 'text-purple-700 font-bold' : ''}`}>
            {hasGroomingAlert ? 'Care' : 'Account'}
          </span>
        </button>

      </div>
    </nav>
  );
};
