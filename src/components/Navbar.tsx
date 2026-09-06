import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  User,
  MessageCircle,
  LayoutDashboard,
  Store,
  Scan,
  Lock,
  Bell,
  Scissors
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { STORE_INFO } from '../data/initialData';
import { Logo } from './Logo';
import { SamsungEmoji } from './SamsungEmoji';

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
    triggerGroomingReminderCheck
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catFoodOpen, setCatFoodOpen] = useState(false);
  const [dogFoodOpen, setDogFoodOpen] = useState(false);
  const [catLitterOpen, setCatLitterOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-3 sm:px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left contact info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href={`tel:${STORE_INFO.phone}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium text-[11px]"
            >
              <PhoneCall className="w-3 h-3 text-purple-400" />
              <span>{STORE_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span>Cox's Bazar, Bangladesh</span>
            </div>
          </div>

          {/* Center discount ticker */}
          <div className="hidden md:flex items-center gap-2 font-medium text-white text-[11px]">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Use Code: <strong className="bg-purple-900/80 px-1.5 py-0.5 rounded text-purple-200 font-mono tracking-wider">CBZPET10</strong> for 10% OFF</span>
          </div>

          {/* Right quick links */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => setIsOrderTrackOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <Truck className="w-3 h-3 text-purple-400" />
              <span className="hidden xs:inline">Track Order</span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            
            {/* View Switcher: Storefront vs Admin Protected Portal */}
            {activeView === 'admin' ? (
              <button
                onClick={() => setActiveView('store')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              >
                <Store className="w-3 h-3 text-amber-300" />
                <span>Storefront</span>
              </button>
            ) : (
              <button
                onClick={() => openAdminPortal()}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer hover:bg-slate-800"
                title="Staff Portal (Passcode Protected)"
              >
                <Lock className="w-2.5 h-2.5 text-purple-400" />
                <span>Staff Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header (Exact Mew Mew Shop style: Circular Logo, Pill Search, Account Pill, Basket Pill) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Circular Brand Logo */}
          <div 
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white border border-purple-200 p-0.5 shadow-sm flex items-center justify-center overflow-hidden ring-2 ring-purple-100 hover:scale-105 transition-transform">
              <Logo className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans block leading-tight">
                Cox's Bazar <span className="text-purple-700">Pet Shop</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                YOUR PET, OUR PASSION
              </span>
            </div>
          </div>

          {/* Centered Pill Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative min-w-0"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search food, toys, care..."
                className="w-full pl-3.5 sm:pl-5 pr-8 sm:pr-12 py-2 sm:py-2.5 rounded-full border border-slate-300 bg-white hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-xs transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-700 cursor-pointer transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && filteredSearchProducts.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-1.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50/70">
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
                        {product.brand} • <span className="text-purple-700 font-medium">{product.category}</span>
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

          {/* Right Buttons: Hello User, Account & My Basket(0) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Upcoming Grooming Alert Bell */}
            {currentUser.isLoggedIn && upcomingGroomingAppointments.length > 0 && (
              <button
                type="button"
                onClick={() => triggerGroomingReminderCheck()}
                title={`You have ${upcomingGroomingAppointments.length} upcoming grooming reminder(s). Click to view!`}
                className="relative p-1.5 sm:p-2 rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {upcomingGroomingAppointments.length}
                </span>
              </button>
            )}

            {/* Hello User, Account button */}
            <button
              onClick={() => onOpenAccountModal?.('account')}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 hover:border-purple-400 hover:bg-purple-50/50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <User className="w-4 h-4 text-purple-700" />
              <span>
                {currentUser.isLoggedIn 
                  ? `Hello ${currentUser.name.split(' ')[0] || 'User'} , Account` 
                  : 'Sign In / Account'}
              </span>
              {currentUser.isLoggedIn && upcomingGroomingAppointments.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Upcoming appointment reminder" />
              )}
            </button>

            {/* My Basket button: sleek circular button with badge on mobile, full pill on sm+ */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Cart with ${totalCartCount} items`}
              className="sm:hidden relative w-9 h-9 rounded-full border border-slate-300 hover:border-purple-500 hover:bg-purple-50 flex items-center justify-center text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-purple-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 hover:border-purple-500 hover:bg-purple-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-purple-700" />
              <span>My Basket({totalCartCount})</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navbar / Menu bar (Matches Mew Mew Shop navigation) */}
      <nav className="border-t border-slate-200 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          <div className="flex items-center space-x-1 lg:space-x-4 text-xs font-semibold text-slate-700">
            
            {/* Categories button (aligned with sidebar below) */}
            <div className="w-60 py-2.5 flex items-center gap-2 text-slate-900 font-bold">
              <Menu className="w-4 h-4 text-purple-700" />
              <span className="tracking-wide">Categories</span>
            </div>

            {/* Nav Menu Links */}
            <button 
              onClick={() => handleCategoryClick('All')}
              className={`py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer ${
                selectedCategory === 'All' ? 'text-purple-700 font-bold' : ''
              }`}
            >
              Home
            </button>

            <button 
              onClick={() => onOpenAccountModal?.('privilege')}
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer text-slate-700"
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
                className={`py-2.5 px-2 flex items-center gap-1 hover:text-purple-700 transition-colors cursor-pointer ${
                  selectedCategory === 'Pet Food' ? 'text-purple-700 font-bold' : ''
                }`}
              >
                <span>Cat Food</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {catFoodOpen && (
                <div className="absolute left-0 top-full w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Dry Cat Food (Kibble)
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Wet Pouches & Gravy
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Kitten Growth Food
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setCatFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
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
                className="py-2.5 px-2 flex items-center gap-1 hover:text-purple-700 transition-colors cursor-pointer text-slate-700"
              >
                <span>Dog Food</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {dogFoodOpen && (
                <div className="absolute left-0 top-full w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Adult Dog Kibbles
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Puppy Nutrition
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Pet Food'); setDogFoodOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Chew Sticks & Biscuits
                  </button>
                </div>
              )}
            </div>

            {/* Cat Toys */}
            <button 
              onClick={() => handleCategoryClick('Accessories & Toys')}
              className={`py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer ${
                selectedCategory === 'Accessories & Toys' ? 'text-purple-700 font-bold' : ''
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
                className={`py-2.5 px-2 flex items-center gap-1 hover:text-purple-700 transition-colors cursor-pointer ${
                  selectedCategory === 'Litter & Hygiene' ? 'text-purple-700 font-bold' : ''
                }`}
              >
                <span>Cat Litter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {catLitterOpen && (
                <div className="absolute left-0 top-full w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Bentonite Clumping Litter
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
                  >
                    Odor Control Charcoal Silica
                  </button>
                  <button 
                    onClick={() => { handleCategoryClick('Litter & Hygiene'); setCatLitterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-slate-700 text-xs font-medium"
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
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer font-bold text-purple-700"
            >
              Reflex
            </button>

            {/* Services */}
            <a 
              href="#services-and-policies-section"
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer text-purple-900 font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Services</span>
            </a>

            {/* Pet Sale & Adoption */}
            <a 
              href="#pet-sale-showcase-section"
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer text-slate-700 font-semibold"
            >
              Pet Sale & Adoption
            </a>

            {/* Blog */}
            <a 
              href="#pet-care-blog-section"
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer text-slate-700"
            >
              Blog
            </a>

            {/* Gift Cards */}
            <button 
              onClick={() => onOpenAccountModal?.('giftcards')}
              className="py-2.5 px-2 hover:text-purple-700 transition-colors cursor-pointer text-slate-700"
            >
              Gift Cards
            </button>

          </div>

          <div className="text-xs text-purple-800 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Open (10 AM - 10 PM)</span>
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
              <span>{currentUser.isLoggedIn ? `Account (${currentUser.name.split(' ')[0]})` : 'Sign In / Account'}</span>
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
                <SamsungEmoji emoji="🏡" size="xs" />
                <span>Foster Care</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 flex items-center gap-1.5"
              >
                <SamsungEmoji emoji="✂️" size="xs" />
                <span>Grooming Spa</span>
              </a>
              <a
                href="#pet-sale-showcase-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 flex items-center gap-1.5"
              >
                <SamsungEmoji emoji="🐾" size="xs" />
                <span>Pet Sale & Kittens</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center gap-1.5"
              >
                <SamsungEmoji emoji="🚚" size="xs" />
                <span>Pet Courier</span>
              </a>
              <a
                href="#services-and-policies-section"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 col-span-2 flex items-center justify-center gap-1.5"
              >
                <SamsungEmoji emoji="☕" size="xs" />
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
              className="text-left px-3 py-2 rounded-xl bg-purple-50 text-purple-900 font-bold flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="✨" size="xs" />
              <span>All Products</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Pet Food'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="🐱" size="xs" />
              <span>Cat Food</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Accessories & Toys'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="🧶" size="xs" />
              <span>Cat Toys</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Litter & Hygiene'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="🚽" size="xs" />
              <span>Cat Litter</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Grooming Essentials'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="✨" size="xs" />
              <span>Grooming</span>
            </button>
            <button
              onClick={() => { handleCategoryClick('Healthcare & First Aid'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <SamsungEmoji emoji="🏥" size="xs" />
              <span>Health & Vet</span>
            </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
