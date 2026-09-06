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
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppointmentBooking } from '../../types';
import { SamsungEmoji } from '../SamsungEmoji';

export const AppointmentManager: React.FC = () => {
  const { appointments, updateAppointmentStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-purple-600" />
              <span>Pet Grooming & Vet Care Bookings</span>
            </h2>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {pendingCount} Pending Bookings
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage pet grooming, baths, medicated treatments, and vet consultation appointment requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter || 'All'}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
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
            <div key={app.id} className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    {app.serviceName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
  );
};
