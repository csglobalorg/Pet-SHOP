import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { FlashSaleSection } from './components/FlashSaleSection';
import { CuratedSections } from './components/CuratedSections';
import { ProductCatalog } from './components/ProductCatalog';
import { ServicesAndPolicies } from './components/ServicesAndPolicies';
import { PetCareBlogAndReviews } from './components/PetCareBlogAndReviews';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AccountModal } from './components/AccountModal';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ProductCategory, AnimalType } from './types';

const StoreContent: React.FC = () => {
  const { activeView, setActiveView, openAdminPortal } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState<'account' | 'privilege' | 'giftcards'>('account');

  const handleSelectCategory = (cat: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => {
    setSelectedCategory(cat);
    if (animal) {
      setSelectedAnimal(animal);
    } else {
      setSelectedAnimal('all');
    }
    if (searchTag && !searchTag.toLowerCase().includes('food') && !searchTag.toLowerCase().includes('accessories')) {
      setSearchQuery(searchTag);
    } else if (searchTag?.toLowerCase().includes('treat')) {
      setSearchQuery('treat');
    } else if (searchTag?.toLowerCase().includes('collar')) {
      setSearchQuery('collar');
    } else if (searchTag?.toLowerCase().includes('litter')) {
      setSearchQuery('litter');
    } else if (searchTag?.toLowerCase().includes('bowl')) {
      setSearchQuery('bowl');
    }

    // Smooth scroll down to catalog
    const el = document.getElementById('product-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('product-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenAccountModal = (tab: 'account' | 'privilege' | 'giftcards' = 'account') => {
    setAccountModalTab(tab);
    setAccountModalOpen(true);
  };

  if (activeView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-purple-100 selection:text-purple-900">
      
      {/* Primary Navigation with Brand Logo & Pill Search & Account Pill */}
      <Navbar 
        onSearch={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        onOpenAccountModal={handleOpenAccountModal}
      />

      {/* Hero with Sidebar & Banner + Featured Categories (Exact Mew Mew Shop layout) */}
      <HeroSlider 
        onSelectCategory={handleSelectCategory} 
        onScrollToCatalog={handleScrollToCatalog}
      />

      {/* Main Storefront Flow */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-12">
        
        {/* Live Flash Deals with Countdown */}
        <FlashSaleSection onExploreAll={() => handleSelectCategory('All')} />

        {/* Main Product Catalog with live filtering & sort */}
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedAnimal={selectedAnimal}
          onSelectAnimal={setSelectedAnimal}
          externalSearchQuery={searchQuery}
        />

        {/* Services & Standard Policies & Guidelines */}
        <ServicesAndPolicies />

        {/* Curated Pet Corners (Dear Cat, Dear Dog, Tick & Flea, VIP Platinum Card, Brands) */}
        <CuratedSections onSelectCategory={handleSelectCategory} />

        {/* Pet Care Blog Guides & Customer Reviews */}
        <PetCareBlogAndReviews />

      </main>

      {/* Footer with Full Contact & Policy Details */}
      <Footer 
        onSelectCategory={handleSelectCategory} 
        onOpenAdmin={() => openAdminPortal()} 
      />

      {/* Floating Right Docked Cart & Bottom Right Messenger Bubble (Matches Screenshot) */}
      <FloatingWidgets />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <OrderTrackModal />
      <AppointmentBookingModal />
      <AccountModal 
        isOpen={accountModalOpen} 
        onClose={() => setAccountModalOpen(false)} 
        defaultTab={accountModalTab} 
      />
      <AdminAuthModal />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
