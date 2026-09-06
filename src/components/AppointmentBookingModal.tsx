import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle2, Phone, User, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AnimalType } from '../types';
import { STORE_INFO } from '../data/initialData';

export const AppointmentBookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedServiceForBooking, 
    services,
    bookAppointment 
  } = useStore();

  const [serviceId, setServiceId] = useState<string>(selectedServiceForBooking?.id || services[0]?.id || 'srv-grooming');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<AnimalType>('cat');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookedDetails, setBookedDetails] = useState<{ id: string; service: string } | null>(null);

  if (!isBookingModalOpen) return null;

  const activeService = services.find(s => s.id === serviceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || !petName) return;

    const res = bookAppointment({
      serviceId: activeService.id,
      serviceName: `${activeService.titleBn} (${activeService.title})`,
      ownerName,
      ownerPhone,
      petName,
      petType,
      preferredDate,
      preferredTime,
      notes
    });

    setBookedDetails({
      id: res.id,
      service: activeService.titleBn
    });
    setBookingSuccess(true);
  };

  const handleClose = () => {
    setBookingSuccess(false);
    setBookedDetails(null);
    setIsBookingModalOpen(false);
  };

  const timeSlots = [
    '10:30 AM', '11:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '08:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-purple-100 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 px-4 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Book Care & Grooming
              </h3>
              <p className="text-[11px] sm:text-xs text-purple-200">
                Cox's Bazar Pet Shop & Care
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">
                Appointment Booked Successfully!
              </h4>
              <p className="text-sm text-slate-600 mt-1.5">
                Booking ID: <span className="font-mono font-bold text-purple-700">{bookedDetails?.id}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Service: {bookedDetails?.service} | Date: {preferredDate} ({preferredTime})
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-xs text-purple-900 border border-purple-100 text-left space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Our team will reach out to you shortly
              </div>
              <p className="text-purple-800">
                For immediate confirmation, message us directly on WhatsApp or call: <strong>{STORE_INFO.phone}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent(
                  `Hello Cox's Bazar Pet Shop! I have booked an appointment for ${bookedDetails?.service} (ID: ${bookedDetails?.id}). Pet: ${petName}, Date: ${preferredDate} (${preferredTime}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
            {/* Service Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Service *
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium transition-all"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {s.startingPrice > 0 ? `৳${s.startingPrice}` : 'Free Consultation'} ({s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Service-Specific Micro Guidance Card */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-900 space-y-1">
              <div className="font-semibold flex items-center justify-between">
                <span>{activeService?.title}</span>
                <span className="text-purple-700 font-bold">
                  {activeService?.startingPrice > 0 ? `Starts ৳${activeService.startingPrice}` : 'Free Inquiry'}
                </span>
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                {activeService?.description}
              </p>
            </div>

            {/* Pet Parent & Pet details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Pet Parent) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="01854-444344"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pet name and Animal Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milo / Kitty / Tommy"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pet Type
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value as AnimalType)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                >
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="all">Other</option>
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Preferred Time *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Sensitive paws, nervous with nail clipping, needs tick bath..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
