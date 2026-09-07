import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
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

  const handleOpenAccountModal = (tab: 'account' | 'privilege' | 'giftcards' | 'grooming' = 'account') => {
    setAccountModalTab(tab);
    setAccountModalOpen(true);
  };

  if (activeView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans flex flex-col selection:bg-slate-200 selection:text-slate-900 pb-16 md:pb-0">
      
      {/* Primary Navigation with Brand Logo, Search Bar, WhatsApp & Basket */}
      <Navbar 
        onSearch={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        onOpenAccountModal={handleOpenAccountModal}
      />

      {/* Main Storefront Flow */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12 sm:space-y-16">
        
        {/* Modern Minimal Boutique Hero */}
        <HeroSection 
          onSelectCategory={handleSelectCategory} 
          onScrollToCatalog={handleScrollToCatalog}
        />

        {/* Main Product Catalog with live filtering & boutique empty state */}
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedAnimal={selectedAnimal}
          onSelectAnimal={setSelectedAnimal}
          externalSearchQuery={searchQuery}
        />

        {/* Real Services (Grooming Spa, Foster Boarding, Safe Transport, Pet Cafe) & Store Policies */}
        <ServicesAndPolicies />

      </main>

      {/* Modern Clean Footer with Authentic Store Details & Hidden Admin Trigger */}
      <Footer 
        onSelectCategory={handleSelectCategory} 
        onOpenAdmin={() => openAdminPortal()} 
      />

      {/* Floating Right Docked Cart & Bottom Right Messenger Bubble */}
      <FloatingWidgets />

      {/* Modern Mobile Bottom Navigation Bar (Shop, Services, Cart, Account) */}
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

      {/* Local Notification / Toast System for Upcoming Grooming Appointments */}
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
