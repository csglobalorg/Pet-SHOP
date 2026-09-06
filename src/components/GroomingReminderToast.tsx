import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  X, 
  CheckCircle2, 
  Bell, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  User,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AppointmentBooking } from '../types';
import { SamsungEmoji } from './SamsungEmoji';

interface GroomingReminderToastProps {
  onOpenAccountModal?: () => void;
}

export const GroomingReminderToast: React.FC<GroomingReminderToastProps> = ({ 
  onOpenAccountModal 
}) => {
  const { 
    currentUser, 
    upcomingGroomingAppointments, 
    isReminderToastOpen, 
    dismissReminder 
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  // If user is not logged in or toast is closed or no upcoming appointments, do not render
  if (!currentUser.isLoggedIn || !isReminderToastOpen || upcomingGroomingAppointments.length === 0) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, upcomingGroomingAppointments.length - 1);
  const appointment: AppointmentBooking = upcomingGroomingAppointments[safeIndex] || upcomingGroomingAppointments[0];

  // Format relative date and time label
  const getRelativeDateLabel = (dateStr: string, timeStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const aptDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      aptDate.setHours(0, 0, 0, 0);
      const diffTime = aptDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return { tag: 'Today', full: `Today at ${timeStr}`, isUrgent: true };
      } else if (diffDays === 1) {
        return { tag: 'Tomorrow', full: `Tomorrow at ${timeStr}`, isUrgent: true };
      } else if (diffDays > 1 && diffDays <= 7) {
        return { tag: `In ${diffDays} days`, full: `${dateStr} at ${timeStr}`, isUrgent: false };
      }
    }
    return { tag: dateStr, full: `${dateStr} at ${timeStr}`, isUrgent: false };
  };

  const timeInfo = getRelativeDateLabel(appointment.preferredDate, appointment.preferredTime);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % upcomingGroomingAppointments.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + upcomingGroomingAppointments.length) % upcomingGroomingAppointments.length);
  };

  const handleDismissCurrent = () => {
    dismissReminder(appointment.id);
  };

  const handleViewDetails = () => {
    if (onOpenAccountModal) {
      onOpenAccountModal();
    }
    // Dismiss toast after taking action
    dismissReminder(appointment.id);
  };

  return (
    <aside 
      aria-label="Appointment Notifications"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.94 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-purple-200/90 shadow-2xl shadow-purple-900/15 overflow-hidden text-slate-800 backdrop-blur-md"
        >
          {/* Top Decorative Header Accent */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 px-4 py-2.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-xs tracking-wide">
                <Scissors className="w-3.5 h-3.5 text-purple-200" />
                <span>Upcoming Grooming Reminder</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {upcomingGroomingAppointments.length > 1 && (
                <span className="text-[11px] text-purple-200 bg-white/15 px-2 py-0.5 rounded-full font-medium">
                  {safeIndex + 1} of {upcomingGroomingAppointments.length}
                </span>
              )}
              <button
                type="button"
                onClick={handleDismissCurrent}
                aria-label="Dismiss appointment reminder"
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Card Content */}
          <div className="p-4 sm:p-5">
            {/* Pet & Service Identity */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0 shadow-xs">
                  <SamsungEmoji emoji={appointment.petType === 'cat' ? '🐱' : '🐶'} size="md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                      {appointment.petName}
                    </h4>
                    <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {appointment.petType}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-purple-700 mt-0.5">
                    {appointment.serviceName}
                  </p>
                </div>
              </div>

              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                appointment.status === 'Confirmed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {appointment.status}
              </span>
            </div>

            {/* Time & Date Highlight Banner */}
            <div className={`p-3 rounded-xl border mb-3 flex items-center justify-between gap-2 ${
              timeInfo.isUrgent 
                ? 'bg-purple-50/80 border-purple-200 text-purple-950' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-purple-200 flex items-center justify-center shrink-0 text-purple-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs text-purple-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{timeInfo.tag}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {timeInfo.full}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/80 px-2 py-1 rounded-lg shrink-0">
                {appointment.preferredTime}
              </span>
            </div>

            {/* Note or Pet Care Detail */}
            {appointment.notes && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3.5 italic line-clamp-2">
                "{appointment.notes}"
              </p>
            )}

            {/* Logged in Account indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3.5 px-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>Parent: {currentUser.name}</span>
              </span>
              <span>Cox's Bazar Spa Center</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              {upcomingGroomingAppointments.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous appointment reminder"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next appointment reminder"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleViewDetails}
                className="flex-1 py-2 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>View in Account</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleDismissCurrent}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
