import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import TicketModal from '../components/TicketModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Ticket, 
  Calendar, 
  MapPin, 
  Loader2, 
  AlertCircle, 
  Trash2, 
  QrCode,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyRegistrations = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // Fetch registrations helper
  const fetchMyTickets = useCallback(async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await API.get(`/registrations/student?email=${email.toLowerCase()}`);
      if (res.data?.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Prefill and search if student user is authenticated on load
  useEffect(() => {
    if (user && user.role === 'student') {
      setEmailInput(user.email);
      fetchMyTickets(user.email);
    }
  }, [user, fetchMyTickets]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailInput) {
      showToast('Please enter an email address', 'warning');
      return;
    }
    fetchMyTickets(emailInput);
  };

  const handleCancelRegistration = async (regId, eventTitle) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel your registration for: ${eventTitle}?`);
    if (!confirmCancel) return;

    try {
      const res = await API.delete(`/registrations/${regId}`);
      if (res.data?.success) {
        showToast('Registration cancelled successfully', 'success');
        // Update local state list to remove/update
        setRegistrations((prev) => prev.filter((r) => r._id !== regId));
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Ticket className="w-8 h-8 text-violet-500" />
          <span>{t('myRegTitle')}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('myRegSearchDesc')}</p>
      </div>

      {/* Email Search Box */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white/20 dark:bg-slate-900/30 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
            placeholder="Enter your registered email (e.g. john@student.com)"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="gradient-btn px-6 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{t('searchBtn')}</span>}
        </button>
      </form>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-350 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('noRegs')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {registrations.map((reg) => {
                const event = reg.eventId;
                if (!event) return null; // Avoid crash if event was hard deleted
                const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <motion.div
                    key={reg._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Ticket Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          reg.registrationStatus === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {reg.registrationStatus}
                        </span>
                        
                        {reg.attendanceStatus === 'Present' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
                            <Award className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-lg text-indigo-950 dark:text-white line-clamp-1 leading-snug">
                        {event.title}
                      </h3>

                      <div className="flex flex-col gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
                          <span>{formattedDate} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Actions Divider */}
                    <hr className="border-slate-100 dark:border-slate-800 my-4" />

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-500 hover:text-white dark:hover:bg-violet-600 hover:shadow-md text-sm font-bold transition-all"
                      >
                        <QrCode className="w-4.5 h-4.5" />
                        <span>View Ticket</span>
                      </button>

                      {reg.registrationStatus === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelRegistration(reg._id, event.title)}
                          className="p-2.5 rounded-2xl border border-rose-200 dark:border-rose-800/80 text-rose-500 hover:bg-rose-500 hover:text-white transition-all hover:shadow-md"
                          title="Cancel Registration"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Ticket QR Modal */}
      <AnimatePresence>
        {activeTicket && (
          <TicketModal
            registration={activeTicket}
            onClose={() => setActiveTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRegistrations;
