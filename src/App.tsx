import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedCategories } from './components/FeaturedCategories';
import { MewMewStoreSections } from './components/MewMewStoreSections';
import { ProductCatalog } from './components/ProductCatalog';
import { ServicesAndPolicies } from './components/ServicesAndPolicies';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AccountModal } from './components/AccountModal';
import { GroomingReminderToast } from './components/GroomingReminderToast';
import { FloatingWidgets } from './components/FloatingWidgets';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ProductCategory, AnimalType } from './types';

const StoreContent: React.FC = () => {
  const { activeView, openAdminPortal } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState<'account' | 'privilege' | 'giftcards' | 'grooming'>('account');

  const handleSelectCategory = (cat: ProductCategory | 'All', animal?: AnimalType, searchTag?: string) => {
    setSelectedCategory(cat);
    if (animal) {
      setSelectedAnimal(animal);
    } else {
      setSelectedAnimal('all');
    }
    if (searchTag && !searchTag.toLowerCase().includes('food') && !searchTag.toLowerCase().includes('accessories')) {
      setSearchQuery(searchTag);
    } else if (searchTag?.toLowerCase().includes('adult')) {
      setSearchQuery('adult');
    } else if (searchTag?.toLowerCase().includes('kitten')) {
      setSearchQuery('kitten');
    } else if (searchTag?.toLowerCase().includes('collar')) {
      setSearchQuery('collar');
    } else if (searchTag?.toLowerCase().includes('litter')) {
      setSearchQuery('litter');
    } else if (searchTag?.toLowerCase().includes('bowl')) {
      setSearchQuery('bowl');
    } else if (searchTag?.toLowerCase().includes('shampoo')) {
      setSearchQuery('shampoo');
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

  const handleOpenAccountModal = (tab: 'account' | 'privilege' | 'giftcards' | 'grooming' = 'account') => {
    setAccountModalTab(tab);
    setAccountModalOpen(true);
  };

  if (activeView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-slate-900 font-sans flex flex-col selection:bg-purple-100 selection:text-[#4a154b] pb-16 md:pb-0">
      
      {/* Primary Navigation matching Mew Mew Shop layout */}
      <Navbar 
        onSearch={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        onOpenAccountModal={handleOpenAccountModal}
      />

      {/* Main Storefront Flow */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-10">
        
        {/* Mew Mew Shop Style Hero Banner */}
        <HeroBanner 
          onSelectCategory={handleSelectCategory} 
          onScrollToCatalog={handleScrollToCatalog}
        />

        {/* Featured Categories (Centered Headline + Card Grid matching screenshot) */}
        <FeaturedCategories 
          onSelectCategory={handleSelectCategory}
        />

        {/* Mew Mew Shop BD Signature Layout: Flash Sale, Turkish Banner, Cat, Dog, Flea, Brands, Top Sellers, VIP Card, Accessory Tabs, Reviews, App banner */}
        <MewMewStoreSections 
          onSelectCategory={handleSelectCategory}
          onOpenAccountModal={handleOpenAccountModal}
        />

        {/* Main Product Catalog with live filtering & boutique state */}
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedAnimal={selectedAnimal}
          onSelectAnimal={setSelectedAnimal}
          externalSearchQuery={searchQuery}
        />

        {/* Real Services & Store Policies */}
        <ServicesAndPolicies />

      </main>

      {/* Footer */}
      <Footer 
        onSelectCategory={handleSelectCategory} 
        onOpenAdmin={() => openAdminPortal()} 
      />

      {/* Floating Right Docked Cart & Bottom Right Messenger Bubble */}
      <FloatingWidgets />

      {/* Mobile Bottom Navigation Bar (Categories, My Basket, Center Home, My Profile, Chat) */}
      <MobileBottomNav 
        onOpenAccountModal={handleOpenAccountModal}
        onSelectCategory={handleSelectCategory}
      />

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

      {/* Local Notification for Real Grooming Appointments */}
      <GroomingReminderToast onOpenAccountModal={() => handleOpenAccountModal('grooming')} />

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
