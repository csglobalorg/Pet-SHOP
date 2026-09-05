import React from 'react';
import { 
  Scissors, 
  Apple, 
  Truck, 
  HeartPulse, 
  Calendar, 
  ShieldCheck, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  Clock, 
  PhoneCall, 
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO, STORE_POLICIES } from '../data/initialData';
import { ServiceItem } from '../types';

export const ServicesAndPolicies: React.FC = () => {
  const { services, openBookingModalForService } = useStore();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-purple-700" />;
      case 'Apple':
        return <Apple className="w-6 h-6 text-purple-700" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-purple-700" />;
      case 'HeartPulse':
      default:
        return <HeartPulse className="w-6 h-6 text-purple-700" />;
    }
  };

  const getPolicyIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Truck className="w-6 h-6 text-purple-600" />;
      case 1:
        return <RotateCcw className="w-6 h-6 text-purple-600" />;
      case 2:
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <section id="services-and-policies-section" className="py-12 sm:py-16 bg-white border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        {/* ================= 3. SERVICES SECTION ================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Our Services • Professional Pet Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Cox's Bazar Specialized Pet Care & Grooming
            </h2>
            <p className="text-sm text-slate-600">
              Grooming, veterinary coordination, and dietary counseling — dedicated care for your pets by our experienced team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    {(service.features || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration}
                    </span>
                    <span className="font-bold text-slate-900">
                      {service.startingPrice > 0 ? `৳${service.startingPrice}` : 'Free Consultation'}
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModalForService(service)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Consultation Banner */}
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base sm:text-lg text-white">
                Have questions or need emergency pet care guidance?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Our experienced team is available daily from 10:00 AM to 10:00 PM to assist you.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                <span>{STORE_INFO.phone}</span>
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I would like some advice.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-500 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= 4. POLICIES SECTION ================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Store Policies • Customer Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Standard Store Policies & Customer Protection
            </h2>
            <p className="text-sm text-slate-600">
              Transparent service and safe hygienic standards for your pets are our highest priorities
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
