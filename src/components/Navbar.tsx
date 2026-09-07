import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  User,
  MessageCircle,
  LayoutDashboard,
  Store,
  Scan,
  Lock,
  Bell,
  Scissors,
  Home,
  Coffee,
  Heart,
  Fish,
  Bone,
  Layers,
  Utensils,
  ShieldCheck,
  Sparkle,
  Activity,
  Smile,
  Package,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { STORE_INFO } from '../data/initialData';
import { Logo } from './Logo';

interface NavbarProps {
  onSelectCategory?: (category: ProductCategory | 'All') => void;
  selectedCategory?: string;
  onSearch?: (query: string) => void;
  onOpenAccountModal?: (tab?: 'account' | 'privilege' | 'giftcards' | 'grooming') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSelectCategory, 
  selectedCategory = 'All',
  onSearch,
  onOpenAccountModal
}) => {
  const { 
    cart, 
    setIsCartOpen, 
    activeView, 
    setActiveView, 
    setAdminTab,
    openAdminPortal,
    setIsOrderTrackOpen,
    products,
    setSelectedProductForDetail,
    currentUser,
    upcomingGroomingAppointments,
    triggerGroomingReminderCheck,
    isAdminAuthenticated,
    wishlist,
    storeSettings
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catFoodOpen, setCatFoodOpen] = useState(false);
  const [dogFoodOpen, setDogFoodOpen] = useState(false);
  const [catLitterOpen, setCatLitterOpen] = useState(false);

  // Toggle state for Browse Categories dropdown
  const [isBrowseCategoriesOpen, setIsBrowseCategoriesOpen] = useState(false);
  const browseCategoriesRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or on ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (browseCategoriesRef.current && !browseCategoriesRef.current.contains(e.target as Node)) {
        setIsBrowseCategoriesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBrowseCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const browseCategoriesList = [
    { name: 'Cat Food', category: 'Pet Food' as ProductCategory, searchTag: 'cat', icon: Fish },
    { name: 'Dog Food', category: 'Pet Food' as ProductCategory, searchTag: 'dog', icon: Bone },
    { name: 'Cat Litter & Hygiene', category: 'Litter & Hygiene' as ProductCategory, searchTag: 'litter', icon: Layers },
    { name: 'Feeding & Bowls', category: 'Accessories & Toys' as ProductCategory, searchTag: 'bowl', icon: Utensils },
    { name: 'Collar & Harness', category: 'Accessories & Toys' as ProductCategory, searchTag: 'collar', icon: ShieldCheck },
    { name: 'Grooming & Care', category: 'Grooming Essentials' as ProductCategory, searchTag: 'shampoo', icon: Sparkle },
    { name: 'Flea & Tick Control', category: 'Healthcare & First Aid' as ProductCategory, searchTag: 'flea', icon: Activity },
    { name: 'Cat & Dog Toys', category: 'Accessories & Toys' as ProductCategory, searchTag: 'toy', icon: Smile },
    { name: 'Cages & Carriers', category: 'Accessories & Toys' as ProductCategory, searchTag: 'carrier', icon: Package },
    { name: 'Special Offers', category: 'Pet Food' as ProductCategory, searchTag: 'flash sale', icon: Tag }
  ];

  const handleLogoClick = () => {
    setActiveView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredSearchProducts = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    const catSection = document.getElementById('product-catalog-section');
    catSection?.scrollIntoView({ behavior: 'smooth' });
    setShowSearchDropdown(false);
  };

  const handleCategoryClick = (cat: ProductCategory | 'All') => {
    onSelectCategory?.(cat);
    const catSection = document.getElementById('product-catalog-section');
    catSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Notice Bar matching deep purple Mew Mew Shop style */}
      <div className="bg-[#4a154b] text-white text-xs px-3 sm:px-4 py-1.5 border-b border-[#3c103d]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left contact info */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] font-medium">
            <span className="hidden xs:inline text-purple-200">★</span>
            <a 
              href={`tel:${storeSettings?.phone || STORE_INFO.phone}`} 
              className="flex items-center gap-1.5 hover:text-purple-200 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-purple-300" />
              <span>{storeSettings?.phone || STORE_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-purple-300/40">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-purple-200 text-[11px]">
              <MapPin className="w-3 h-3 text-purple-300" />
              <span>Cox's Bazar, Bangladesh</span>
            </div>
            {storeSettings?.isAnnouncementActive && storeSettings?.announcementNotice ? (
              <span className="hidden md:inline text-purple-200 font-bold">
                • {storeSettings.announcementNotice}
              </span>
            ) : (
              <span className="hidden md:inline text-purple-200 font-bold">
                • ফ্রি ডেলিভারি ও অরিজিনাল পেট ফুড
              </span>
            )}
          </div>

          {/* Right quick links */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <a
              href={`https://wa.me/${storeSettings?.whatsappDigits || STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
            <span className="text-purple-300/40">|</span>
            <button 
              onClick={() => setIsOrderTrackOpen(true)}
              className="flex items-center gap-1 hover:text-purple-200 transition-colors font-medium cursor-pointer"
            >
              <Truck className="w-3 h-3 text-purple-300" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE HEADER (Exact Mew Mew Shop layout from user screenshot) ================= */}
      <div className="md:hidden px-3 pt-2.5 pb-2.5 bg-white">
        {/* Row 1: Left Menu button with text, Center round Logo, Right Cart bag with red badge */}
        <div className="flex items-center justify-between">
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center text-slate-700 hover:text-[#4a154b] p-1 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-slate-800" />
            <span className="text-[10px] font-semibold text-slate-500 leading-none mt-0.5">Menu</span>
          </button>

          <div 
            onClick={handleLogoClick}
            className="cursor-pointer select-none"
            title="Cox's Bazar Pet Shop & Care"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-purple-200 p-0.5 shadow-xs flex items-center justify-center overflow-hidden">
              <Logo className="w-full h-full object-contain rounded-full" />
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 text-slate-800 cursor-pointer"
            aria-label={`Cart with ${totalCartCount} items`}
          >
            <ShoppingBag className="w-7 h-7 text-slate-800" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
              {totalCartCount}
            </span>
          </button>
        </div>

        {/* Row 2: Search input with placeholder 'What can we help you find?' */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 relative">
          <input
            type="text"
            value={searchQuery || ''}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            placeholder="What can we help you find?"
            className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#4a154b] focus:ring-1 focus:ring-[#4a154b] shadow-2xs transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4a154b] cursor-pointer p-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* Circular Brand Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            title="Cox's Bazar Pet Shop & Care"
          >
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#4a154b]/30 p-0.5 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
              <Logo className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-sans block leading-tight">
                Cox's Bazar <span className="text-[#4a154b]">Pet Shop</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                YOUR PET, OUR PASSION
              </span>
            </div>
          </div>

          {/* Centered Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative min-w-0"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery || ''}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="What can we help you find?"
                className="w-full pl-5 pr-12 py-2.5 rounded-lg border border-slate-300 bg-white hover:border-[#4a154b]/50 focus:outline-none focus:ring-2 focus:ring-[#4a154b] focus:border-[#4a154b] text-sm text-slate-800 placeholder:text-slate-400 shadow-xs transition-all"
              />
              <button 
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#4a154b] cursor-pointer transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && filteredSearchProducts.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-1.5 text-[10px] font-bold text-[#4a154b] uppercase tracking-wider bg-purple-50/70">
                  Matching Products ({filteredSearchProducts.length})
                </div>
                {filteredSearchProducts.map(product => (
                  <div
                    key={product.id}
                    onMouseDown={() => {
                      setSelectedProductForDetail(product);
                      setShowSearchDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-purple-50/60 flex items-center gap-3 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                  >
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-9 h-9 object-cover rounded-lg bg-slate-50 shrink-0 border border-slate-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {product.brand} • <span className="text-[#4a154b] font-medium">{product.category}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900">৳{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Right Buttons: Hello User, Account, Wishlist & My Basket(0) */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* User Account */}
            <button
              onClick={() => onOpenAccountModal?.('account')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-300 hover:border-[#4a154b] hover:bg-purple-50/30 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <User className="w-4 h-4 text-[#4a154b]" />
              <span>
                {currentUser.isLoggedIn 
                  ? `Hello ${currentUser.name.split(' ')[0] || 'User'}` 
                  : 'Sign In / Account'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                const catSection = document.getElementById('product-catalog-section');
                catSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-300 hover:border-[#4a154b] hover:bg-purple-50/30 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            {/* My Basket button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a154b]/30 bg-purple-50/40 hover:bg-purple-100/60 text-[#4a154b] text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#4a154b]" />
              <span>My Basket ({totalCartCount})</span>
            </button>

          </div>
        </div>
      </div>

      {/* Sub-navbar / Menu bar (Matches Mew Mew Shop navigation) */}
      <nav className="border-t border-slate-200 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-0.5 lg:gap-1.5 xl:gap-2.5 text-[13px] font-medium text-slate-700 overflow-x-auto no-scrollbar py-0.5">
            
            {/* Categories dropdown toggle button */}
            <div ref={browseCategoriesRef} className="relative shrink-0 mr-1 xl:mr-2">
              <button 
                type="button"
                onClick={() => setIsBrowseCategoriesOpen(prev => !prev)}
                className={`w-52 xl:w-60 py-2.5 px-3.5 bg-[#4a154b] text-white flex items-center justify-between font-bold cursor-pointer select-none transition-all whitespace-nowrap ${
                  isBrowseCategoriesOpen ? 'rounded-t-xl bg-[#3c103d]' : 'rounded-xl hover:bg-[#3c103d]'
                }`}
                aria-expanded={isBrowseCategoriesOpen}
                aria-label="Toggle Categories Dropdown"
              >
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-purple-200 shrink-0" />
                  <span className="tracking-wide text-xs xl:text-sm">Browse Categories</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-purple-200 transition-transform duration-200 shrink-0 ${
                  isBrowseCategoriesOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu - Toggles & Hides smoothly on click / outside click */}
              {isBrowseCategoriesOpen && (
                <div className="absolute left-0 top-full w-52 xl:w-60 bg-white rounded-b-2xl border-x border-b border-purple-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  {browseCategoriesList.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onSelectCategory?.(item.category);
                          if (onSearch && item.searchTag) {
                            onSearch(item.searchTag);
                          }
                          const catSection = document.getElementById('product-catalog-section');
                          catSection?.scrollIntoView({ behavior: 'smooth' });
                          setIsBrowseCategoriesOpen(false); // Closes/hides immediately upon clicking!
                        }}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-purple-50 hover:text-[#4a154b] transition-colors cursor-pointer group text-left whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="truncate text-xs font-semibold text-slate-700 group-hover:text-[#4a154b]">{item.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#4a154b] transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Nav Menu Links - Perfectly formatted in a single row without text wrapping */}
            <button 
              onClick={() => handleCategoryClick('All')}
              className={`py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'All' ? 'text-[#4a154b] font-bold' : ''
              }`}
            >
              Home
            </button>

            <button 
              onClick={() => onOpenAccountModal?.('privilege')}
              className="py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer text-slate-700 whitespace-nowrap"
            >
              Privilege Club
            </button>

            {/* Cat Food Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCatFoodOpen(true)}
              onMouseLeave={() => setCatFoodOpen(false)}
            >
              <button 
                onClick={() => handleCategoryClick('Pet Food')}
                className={`py-3 px-2 xl:px-2.5 inline-flex items-center gap-1 hover:text-[#4a154b] transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'Pet Food' ? 'text-[#4a154b] font-bold' : 'text-slate-700'
                }`}
              >
                <span>Cat Food</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {catFoodOpen && (
                <div className="absolute left-0 top-full w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Dry Cat Food (Kibble)
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Wet Pouches & Gravy
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Kitten Growth Food
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Cat Treats & Puree
                  </button>
                </div>
              )}
            </div>

            {/* Dog Food Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDogFoodOpen(true)}
              onMouseLeave={() => setDogFoodOpen(false)}
            >
              <button 
                onClick={() => handleCategoryClick('Pet Food')}
                className="py-3 px-2 xl:px-2.5 inline-flex items-center gap-1 hover:text-[#4a154b] transition-colors cursor-pointer text-slate-700 whitespace-nowrap"
              >
                <span>Dog Food</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {dogFoodOpen && (
                <div className="absolute left-0 top-full w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Adult Dog Kibbles
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Puppy Nutrition
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Chew Sticks & Biscuits
                  </button>
                </div>
              )}
            </div>

            {/* Cat Toys */}
            <button 
              onClick={() => handleCategoryClick('Accessories & Toys')}
              className={`py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'Accessories & Toys' ? 'text-[#4a154b] font-bold' : 'text-slate-700'
              }`}
            >
              Cat Toys
            </button>

            {/* Cat Litter Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCatLitterOpen(true)}
              onMouseLeave={() => setCatLitterOpen(false)}
            >
              <button 
                onClick={() => handleCategoryClick('Litter & Hygiene')}
                className={`py-3 px-2 xl:px-2.5 inline-flex items-center gap-1 hover:text-[#4a154b] transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'Litter & Hygiene' ? 'text-[#4a154b] font-bold' : 'text-slate-700'
                }`}
              >
                <span>Cat Litter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {catLitterOpen && (
                <div className="absolute left-0 top-full w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Bentonite Clumping Litter
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Odor Control Charcoal Silica
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium whitespace-nowrap"
                  >
                    Litter Trays & Scoops
                  </button>
                </div>
              )}
            </div>

            {/* Reflex Brand */}
            <button 
              onClick={() => {
                if (onSearch) onSearch('Reflex');
                const catSection = document.getElementById('product-catalog-section');
                catSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-2 xl:px-2.5 hover:text-[#3c103d] transition-colors cursor-pointer font-bold text-[#4a154b] whitespace-nowrap"
            >
              Reflex
            </button>

            {/* Services */}
            <a 
              href="#services-and-policies-section"
              className="py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer text-[#4a154b] font-bold inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Services</span>
            </a>

            {/* Pet Adoption */}
            <a 
              href="#pet-sale-showcase-section"
              className="py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer text-slate-700 whitespace-nowrap"
            >
              Pet Adoption
            </a>

            {/* Blog */}
            <a 
              href="#pet-care-blog-section"
              className="py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer text-slate-700 whitespace-nowrap"
            >
              Blog
            </a>

            {/* Gift Cards */}
            <button 
              onClick={() => onOpenAccountModal?.('giftcards')}
              className="py-3 px-2 xl:px-2.5 hover:text-[#4a154b] transition-colors cursor-pointer text-slate-700 whitespace-nowrap"
            >
              Gift Cards
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                onOpenAccountModal?.('account');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-purple-900"
            >
              <User className="w-4 h-4 text-purple-700" />
              <span>{currentUser.isLoggedIn ? `Account (${currentUser.name.split(' ')[0]})` : 'Sign In / Sign Up'}</span>
            </button>
            <button
              onClick={() => {
                onOpenAccountModal?.('grooming');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <Scissors className="w-3 h-3" />
              <span>Grooming</span>
              {currentUser.isLoggedIn && upcomingGroomingAppointments.length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] px-1 rounded-full font-black">
                  {upcomingGroomingAppointments.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Grooming Alert if user has upcoming appointments */}
          {currentUser.isLoggedIn && upcomingGroomingAppointments.length > 0 && (
            <div 
              onClick={() => {
                triggerGroomingReminderCheck();
                setMobileMenuOpen(false);
              }}
              className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="text-purple-950 font-bold">
                  {upcomingGroomingAppointments[0].petName}'s Grooming is coming up!
                </span>
              </div>
              <span className="text-purple-700 font-bold shrink-0">View Toast →</span>
            </div>
          )}

          {/* Dedicated Services & Pet Sale shortcuts */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Specialized Services
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5 text-purple-700" />
                <span>Foster Care</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5 text-purple-700" />
                <span>Grooming Spa</span>
              </a>
              <a
                href="#pet-sale-showcase-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>Pet Sale & Adoption</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                <span>Pet Courier</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 col-span-2 flex items-center justify-center gap-1.5"
              >
                <Coffee className="w-3.5 h-3.5 text-emerald-700" />
                <span>Beachside Pet Cafe & Lounge</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Shop Categories
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { handleCategoryClick('All'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>All Products</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Pet Food'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>🐱 Cat Food</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Accessories & Toys'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>🎒 Accessories</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Litter & Hygiene'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>✨ Cat Litter</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Grooming Essentials'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>✂️ Grooming</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Healthcare & First Aid'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>🌿 Health & Vet</span>
            </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
