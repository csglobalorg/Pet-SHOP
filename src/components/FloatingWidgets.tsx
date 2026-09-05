import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Phone, X, ExternalLink, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/initialData';

export const FloatingWidgets: React.FC = () => {
  const { cart, setIsCartOpen } = useStore();
  const [chatOpen, setChatOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <>
      {/* 1. Floating Cart Tab on Right Edge (Matches Mew Mew Shop style) */}
      <aside 
        aria-label="Quick cart"
        onClick={() => setIsCartOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center bg-purple-900 hover:bg-purple-950 text-white rounded-l-2xl shadow-2xl border-y border-l border-purple-700/60 overflow-hidden cursor-pointer group transition-all duration-200"
      >
        <div className="p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-purple-200 group-hover:scale-110 transition-transform" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 font-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-purple-200">
            Items
          </span>
        </div>
        <div className="w-full bg-white text-purple-950 px-2 py-1.5 text-center font-bold text-xs border-t border-purple-800">
          ৳{totalCartPrice.toLocaleString()}
        </div>
      </aside>

      {/* 2. Floating Messenger / Chat Bubble (Bottom Right) */}
      <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end">
        {chatOpen && (
          <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Chat with Pet Care Team</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online in Cox's Bazar
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5 text-xs text-slate-700 bg-slate-50/50">
              <p className="text-slate-600 leading-relaxed">
                Have questions regarding cat food, dog accessories, or vet appointments? Reach us instantly!
              </p>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I need some assistance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="w-full py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-purple-700" />
                <span>Direct Hotline ({STORE_INFO.phone})</span>
              </a>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-purple-700 hover:bg-purple-800 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer ring-4 ring-purple-200/60"
          aria-label="Open support chat"
        >
          {chatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};
