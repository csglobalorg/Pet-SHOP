import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  Clock, 
  Calendar,
  ExternalLink,
  Lock
} from 'lucide-react';
import { ProductCategory } from '../types';
import { STORE_INFO, STORE_POLICIES } from '../data/initialData';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onSelectCategory?: (category: ProductCategory) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  const { openBookingModalForService } = useStore();

  return (
    <footer id="contact-footer-section" className="bg-slate-950 text-slate-400 border-t border-purple-900/30">
      
      {/* Top Value Strip */}
      <div className="border-b border-slate-900 py-8 px-4 bg-purple-950/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center shrink-0 border border-purple-700/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Cox's Bazar Delivery</h4>
              <p className="text-xs text-purple-200/70 mt-0.5">Prompt 24 to 48 hour delivery</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center shrink-0 border border-purple-700/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">100% Authentic Food</h4>
              <p className="text-xs text-purple-200/70 mt-0.5">Reflex, Drools, Me-O, Whiskas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center shrink-0 border border-purple-700/40">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Hotline & Support</h4>
              <p className="text-xs text-purple-200/70 mt-0.5">{STORE_INFO.phone}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center shrink-0 border border-purple-700/40">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">48h Return Policy</h4>
              <p className="text-xs text-purple-200/70 mt-0.5">Intact seals & safe exchange</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & Address Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white overflow-hidden shrink-0 border border-purple-400/40 p-0.5 flex items-center justify-center shadow-xs">
                <Logo className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Cox's Bazar Pet Shop <span className="text-purple-400">& Care</span>
                </span>
                <p className="text-[11px] text-purple-300 uppercase tracking-wide font-semibold">
                  Your Pet, Our Passion • Cox's Bazar
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              {STORE_INFO.aboutBengali}
            </p>

            {/* Direct Contact Info List */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Address:</strong> {STORE_INFO.address}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>Phone / Mobile:</strong>{' '}
                  <a href={`tel:${STORE_INFO.phone}`} className="text-white hover:text-purple-300 font-medium transition-colors">
                    {STORE_INFO.phone}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>WhatsApp:</strong>{' '}
                  <a 
                    href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop!')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    {STORE_INFO.whatsapp} (Direct Chat)
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${STORE_INFO.email}`} className="text-slate-200 hover:text-white transition-colors">
                    {STORE_INFO.email}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>Operating Hours:</strong> {STORE_INFO.operatingHours}
                </span>
              </div>
            </div>
          </div>

          {/* Product Categories Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onSelectCategory?.('Pet Food')} 
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left"
                >
                  Pet Food — Reflex, Drools, Me-O, Whiskas, Lara
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory?.('Litter & Hygiene')} 
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left"
                >
                  Litter & Hygiene — Bentonite Cat Litter & Trays
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory?.('Accessories & Toys')} 
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left"
                >
                  Accessories & Toys — Collars, Leashes, Bowls & Scratchers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory?.('Grooming Essentials')} 
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left"
                >
                  Grooming Essentials — Anti-Tick Shampoos & Brushes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory?.('Healthcare & First Aid')} 
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left"
                >
                  Healthcare & First Aid — Dewormers, Sprays & Pastes
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Policies Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Services & Policies
            </h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-1">
                <span className="text-purple-300 font-semibold block">Grooming & Care Booking:</span>
                <p className="text-[11px] text-slate-300">
                  Book a direct slot for nail clipping, ear cleaning, and medicated baths.
                </p>
                <button
                  onClick={() => openBookingModalForService()}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs text-white font-semibold hover:text-purple-200 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open Appointment Booking →</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-white font-medium block">Health & Safety Advisory:</span>
                <p className="text-[11px] text-slate-400">
                  No antibiotics or prescription medicines are sold without a registered veterinary surgeon's prescription.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={STORE_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Facebook / {STORE_INFO.brandName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Messenger / WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright and admin */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name} ({STORE_INFO.brandName}). All rights reserved. Chittagong, Cox's Bazar - 4700.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-purple-400/80 font-serif italic text-xs">
              "{STORE_INFO.tagline}"
            </span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Staff Access (Protected by Passcode)"
            >
              <Lock className="w-3 h-3 text-purple-500/70" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
