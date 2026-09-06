import React, { useState } from 'react';
import { 
  Home,
  Scissors, 
  Sparkles, 
  Truck, 
  Coffee,
  HeartPulse, 
  Calendar, 
  ShieldCheck, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  Clock, 
  PhoneCall, 
  MessageCircle,
  BadgeCheck,
  ChevronRight,
  Heart,
  MapPin,
  Sparkle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO, STORE_POLICIES } from '../data/initialData';
import { ServiceItem, PetListing } from '../types';

export const ServicesAndPolicies: React.FC = () => {
  const { services, petListings, openBookingModalForService, setIsBookingModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPetFilter, setSelectedPetFilter] = useState<'all' | 'cat' | 'dog' | 'bird' | 'rabbit'>('all');
  const [activePetForModal, setActivePetForModal] = useState<PetListing | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-purple-700" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-purple-700" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-700" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-purple-700" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-purple-700" />;
      case 'HeartPulse':
      default:
        return <HeartPulse className="w-5 h-5 text-purple-700" />;
    }
  };

  const getPolicyIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 1:
        return <RotateCcw className="w-5 h-5 text-purple-600" />;
      case 2:
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  // Filter services based on activeTab
  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.id === activeTab);

  const filteredPets = selectedPetFilter === 'all'
    ? petListings
    : petListings.filter(p => p.animalType === selectedPetFilter);

  const serviceCategories = [
    { id: 'all', label: 'All Services', icon: Sparkle },
    { id: 'srv-foster', label: 'Foster Care', icon: Home },
    { id: 'srv-grooming', label: 'Grooming', icon: Scissors },
    { id: 'srv-petsale', label: 'Pet Sale & Adoption', icon: Sparkles },
    { id: 'srv-courier', label: 'Pet Courier', icon: Truck },
    { id: 'srv-petcafe', label: 'Pet Cafe', icon: Coffee },
  ];

  const handleInquirePet = (pet: PetListing) => {
    const saleService = services.find(s => s.id === 'srv-petsale') || services[0];
    openBookingModalForService({
      ...saleService,
      title: `Pet Inquiry: ${pet.name} (${pet.breed})`,
      description: `Inquiry for ${pet.breed} (${pet.age}, ${pet.gender}) at ৳${pet.price.toLocaleString()}.`,
    });
  };

  return (
    <section id="services-and-policies-section" className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-semibold border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Complete Pet Ecosystem in Cox's Bazar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Foster Care • Grooming • Pet Sale • Courier • Pet Cafe
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Everything your pet needs under one roof: warm foster boarding, certified veterinary grooming, ethical pedigree pet sales, climate-controlled pet transport, and our beachside pet cafe lounge.
          </p>
        </div>

        {/* ================= INTERACTIVE SERVICE FILTER TABS ================= */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[44px] ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-md shadow-purple-900/10'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= SERVICES CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-[11px] rounded-full border border-purple-100">
                      {service.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-800 mt-0.5">
                    {service.titleBn}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features Pill List */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {(service.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price, Duration & Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {service.duration}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {service.startingPrice > 0 ? `Starts ৳${service.startingPrice}` : 'Free Consultation'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openBookingModalForService(service)}
                    className="py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Book / Inquire</span>
                  </button>

                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent(`Hello! I would like to inquire about ${service.title} in Cox's Bazar.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DEDICATED PET SALE & ETHICAL ADOPTION SHOWCASE ================= */}
        {(activeTab === 'all' || activeTab === 'srv-petsale') && (
          <div id="pet-sale-showcase-section" className="rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 p-6 sm:p-10 border border-purple-100 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ethical Breeding & Rescue Adoption</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  Available Pets for Sale & Adoption
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Purebred Persian kittens, British Shorthairs, playful puppies, hand-tamed birds & rescue kittens. 100% vaccinated, dewormed with veterinary health passports.
                </p>
              </div>

              {/* Animal Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {(['all', 'cat', 'dog', 'bird', 'rabbit'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPetFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize min-h-[36px] ${
                      selectedPetFilter === type
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {type === 'all' ? 'All Breeds' : type === 'cat' ? 'Cats & Kittens' : type === 'dog' ? 'Puppies' : type === 'bird' ? 'Birds' : 'Rabbits'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div 
                  key={pet.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Pet Image with Badges */}
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img 
                        src={pet.imageUrl} 
                        alt={pet.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-xs">
                          {pet.gender} • {pet.age}
                        </span>
                        {pet.isAdoption && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md">
                            Adoption Star
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-xs text-slate-900 font-black text-sm rounded-xl shadow-md border border-slate-100">
                          {pet.isAdoption ? `Adoption: ৳${pet.price.toLocaleString()}` : `৳${pet.price.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                            {pet.name}
                          </h4>
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {pet.breed}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {pet.description}
                        </p>
                      </div>

                      {/* Health Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pet.vaccinated && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-md border border-emerald-100">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            Vaccinated
                          </span>
                        )}
                        {pet.dewormed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-semibold rounded-md border border-blue-100">
                            <Check className="w-3 h-3 text-blue-600" />
                            Dewormed
                          </span>
                        )}
                        {pet.healthPassport && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-semibold rounded-md border border-purple-100">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            Health Passport
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-purple-600" />
                        <span>{pet.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleInquirePet(pet)}
                      className="w-full py-2 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[40px]"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Meet Pet</span>
                    </button>

                    <a
                      href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent(`Hello Cox's Bazar Pet Shop! I am interested in ${pet.name} (${pet.breed}, Age: ${pet.age}). Is it currently available for visit?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-semibold text-xs transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Ethical Guarantee Footer */}
            <div className="bg-white rounded-2xl p-5 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Our Ethical Adoption & Sale Guarantee</h5>
                  <p className="text-slate-600 mt-0.5">
                    We never sell sick or unvaccinated pets. Each pet comes with 7-day health support & transition guidance.
                  </p>
                </div>
              </div>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center gap-2 shrink-0 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-700" />
                <span>Call Pet Dept ({STORE_INFO.phone})</span>
              </a>
            </div>
          </div>
        )}

        {/* ================= PET CAFE BEACHSIDE SPOTLIGHT ================= */}
        {(activeTab === 'all' || activeTab === 'srv-petcafe') && (
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
                <Coffee className="w-3.5 h-3.5" />
                <span>Cox's Bazar Beachside Pet Cafe & Lounge</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Relax With Coffee While Playing With Adorable Kittens & Pups
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you have a furry baby or just love animal cuddles, visit our beachside pet cafe! Sip on freshly roasted coffee, savor delicious bakery snacks, treat your pet to organic pup-cups, and unwind in a sanitized, pet-safe environment.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Open Daily</span>
                  <span className="text-xs font-bold text-white">10 AM - 10 PM</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Location</span>
                  <span className="text-xs font-bold text-white">Cox's Bazar Beach</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Resident Pets</span>
                  <span className="text-xs font-bold text-white">Cuddle Kittens</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Treats</span>
                  <span className="text-xs font-bold text-white">Pup-Cups & Coffee</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const cafeService = services.find(s => s.id === 'srv-petcafe') || services[0];
                    openBookingModalForService(cafeService);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve a Table / Visit</span>
                </button>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello! I would like to visit the Pet Cafe in Cox\'s Bazar. Can I reserve a spot?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Cafe Desk</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. POLICIES SECTION ================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Store Policies • Customer Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Standard Store Policies & Customer Protection
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Transparent service, genuine product guarantees, and safe hygienic standards for your pets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORE_POLICIES.map((policy, idx) => (
              <div 
                key={policy.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  {getPolicyIcon(idx)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {policy.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                  {policy.description}
                </p>

                {idx === 2 && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-medium rounded-lg border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Veterinary Surgeon Prescription Required
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
