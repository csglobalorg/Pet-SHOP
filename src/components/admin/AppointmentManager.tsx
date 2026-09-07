import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  MessageSquare,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppointmentBooking, ServiceItem } from '../../types';
import { SamsungEmoji } from '../SamsungEmoji';

export const AppointmentManager: React.FC = () => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    services, 
    updateService, 
    addService, 
    deleteService 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'services'>('bookings');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Service Edit / Add Modal States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceItem>>({
    title: '',
    titleBn: '',
    iconName: 'Scissors',
    startingPrice: 500,
    duration: '45-60 mins',
    description: '',
    descriptionBn: '',
    category: 'Care',
    badge: 'Popular',
    features: ['Professional Service', 'Certified Caregiver']
  });

  const filteredAppointments = (appointments || []).filter(app => {
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchSearch = !search.trim() ||
      app.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      app.ownerPhone.includes(search) ||
      app.petName.toLowerCase().includes(search.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = (appointments || []).filter(a => a.status === 'Pending').length;

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormData({
      title: '',
      titleBn: '',
      iconName: 'Scissors',
      startingPrice: 400,
      duration: '45-60 mins',
      description: 'Professional hygiene and grooming care for pets in Cox\'s Bazar.',
      descriptionBn: 'কক্সবাজারে পোষা প্রাণীর প্রফেশনাল যত্ন ও হাইজিন কেয়ার।',
      category: 'Care',
      badge: 'New Service',
      features: ['Veterinary verified', 'Gentle handling']
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      titleBn: service.titleBn,
      iconName: service.iconName || 'Scissors',
      startingPrice: service.startingPrice,
      duration: service.duration,
      description: service.description,
      descriptionBn: service.descriptionBn,
      category: service.category || 'Care',
      badge: service.badge || '',
      features: service.features || []
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title || Number(serviceFormData.startingPrice) < 0) {
      alert('Please provide a valid service title and price.');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        ...serviceFormData,
        startingPrice: Number(serviceFormData.startingPrice)
      });
    } else {
      addService({
        title: serviceFormData.title || 'New Care Service',
        titleBn: serviceFormData.titleBn || serviceFormData.title || '',
        iconName: serviceFormData.iconName || 'Scissors',
        startingPrice: Number(serviceFormData.startingPrice) || 0,
        duration: serviceFormData.duration || 'Daily / Session',
        description: serviceFormData.description || '',
        descriptionBn: serviceFormData.descriptionBn || '',
        category: serviceFormData.category || 'Care',
        badge: serviceFormData.badge,
        features: serviceFormData.features || []
      });
    }

    setIsServiceModalOpen(false);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Top Banner & Sub-Tabs Switcher */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Care, Grooming & Service Control
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage appointment bookings, customer schedules, and live service pricing
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'bookings'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>Client Bookings</span>
            {pendingCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeSubTab === 'bookings' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'services'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Manage Services & Pricing</span>
            <span className="text-[10px] opacity-75">({services.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CLIENT BOOKINGS LIST */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search owner, phone, pet, service..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Bookings</option>
                <option value="Pending">Pending ({pendingCount})</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Grid of Appointments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.length === 0 ? (
              <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                No appointment schedules found matching your filter.
              </div>
            ) : (
              filteredAppointments.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        {app.serviceName}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.ownerName}</h4>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.ownerPhone}</span>
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                      <p className="font-medium flex items-center gap-1.5">
                        <SamsungEmoji emoji="🐾" size="xs" />
                        <span>Pet: <strong className="font-bold text-slate-900">{app.petName}</strong> ({app.petType})</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>Date: {app.preferredDate}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Time: {app.preferredTime}</span>
                      </p>
                      {app.notes && (
                        <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                          Notes: {app.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/880${app.ownerPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${app.ownerName}, contacting you from Cox's Bazar Pet Shop & Care to confirm your ${app.serviceName} appointment on ${app.preferredDate} at ${app.preferredTime}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="WhatsApp Confirmation"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      {app.status === 'Pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      {app.status === 'Confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                      {app.status !== 'Cancelled' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SERVICES & PRICING CONTROL */}
      {activeSubTab === 'services' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Guidance Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-purple-950">
                  Live Service Pricing & Booking Catalog Control
                </h4>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Changing any price or duration here will <strong>immediately update the customer "Book Care & Grooming" modal dropdown</strong> and the public service section!
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddService}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Care Service</span>
            </button>
          </div>

          {/* Service Cards Table/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase tracking-wider">
                      {srv.category || 'Care'}
                    </span>
                    {srv.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">
                      {srv.titleBn}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {srv.description}
                    </p>
                  </div>

                  {/* Pricing and Duration Card */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Starting Rate</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ৳{srv.startingPrice}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium block">Duration / Unit</span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 inline-block">
                        {srv.duration}
                      </span>
                    </div>
                  </div>

                  {/* Features Bullet Preview */}
                  {srv.features && srv.features.length > 0 && (
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      {srv.features.slice(0, 2).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditService(srv)}
                    className="flex-1 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Rate & Info</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${srv.title}"?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SERVICE ADD/EDIT MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingService ? 'Edit Service Rate & Details' : 'Add New Care Service'}
                </h3>
                <p className="text-xs text-slate-500">
                  Updates customer booking dropdown options & service cards
                </p>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Service Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.title || ''}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Pet Foster Care & Boarding"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Title (Bengali)
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.titleBn || ''}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                    placeholder="ফস্টার কেয়ার ও বোর্ডিং"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-purple-50/70 p-3 rounded-2xl border border-purple-100">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-purple-700" />
                    <span>Starting Price (৳ BDT) *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={serviceFormData.startingPrice ?? 0}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, startingPrice: Number(e.target.value) }))}
                    placeholder="500"
                    className="w-full px-3 py-2 text-sm font-extrabold text-purple-950 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>Duration / Unit *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.duration || ''}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. Daily / Weekly, 45-60 mins"
                    className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    value={serviceFormData.category || 'Care'}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="Care">Care & Foster</option>
                    <option value="Travel">Travel & Courier</option>
                    <option value="Social">Social & Cafe</option>
                    <option value="Adoption">Pet Adoption / Sale</option>
                    <option value="Health">Health & Vet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.badge || ''}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Popular, Top Rated, 24/7 Care"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Service Description (English)
                </label>
                <textarea
                  rows={2}
                  value={serviceFormData.description || ''}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what's included in this service..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Service Description (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={serviceFormData.descriptionBn || ''}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, descriptionBn: e.target.value }))}
                  placeholder="সার্ভিসের বাংলা বিবরণ..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Save & Apply Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
