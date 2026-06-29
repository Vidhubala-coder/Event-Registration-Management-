import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import TicketModal from '../components/TicketModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, ArrowLeft, Send, CheckCircle, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationForm = () => {
  const { id } = useParams();
  const { user, fetchRegistrations } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  // Form Fields
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');

  // Prefill user details if authenticated student
  useEffect(() => {
    if (user && user.role === 'student') {
      setStudentName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        if (res.data?.success) {
          setEvent(res.data.data);
        }
      } catch (err) {
        showToast('Event not found', 'error');
        navigate('/events');
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !rollNumber || !email || !phone || !department) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    // Phone validation (simple regex)
    const phoneRegex = /^[+]?[0-9\s-]{8,15}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        eventId: id,
        studentName,
        rollNumber,
        email,
        phone,
        department,
      };

      const res = await API.post('/registrations', payload);
      if (res.data?.success) {
        showToast('Registered successfully!', 'success');
        if (user) {
          await fetchRegistrations(user.email);
        }
        setSuccessTicket(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Business Administration',
    'Sciences & Humanities',
  ];

  if (loadingEvent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Details Card */}
        <div className="md:col-span-8 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('regFormTitle')}</h1>
            <p className="text-xs text-slate-400 mt-1">Please provide accurate details for entry validation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-medium text-sm"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('rollNumber')}
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-medium text-sm"
                  placeholder="CS2026101"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-medium text-sm"
                  placeholder="+1 (555) 012-3456"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-medium text-sm"
                placeholder="john@student.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t('department')}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-bold text-sm"
              >
                <option value="">-- {t('selectDept')} --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 mt-4 rounded-2xl font-bold gradient-btn flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-55"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Confirm Registration</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Small Event Preview Sidebar */}
        <div className="md:col-span-4 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-sm h-fit space-y-4">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Event Details</h2>
          <div className="space-y-3">
            <h3 className="font-bold text-base text-indigo-950 dark:text-white leading-snug">{event.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{event.category} • {event.time}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{event.venue}</p>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <img src={event.bannerImage} className="rounded-xl w-full h-24 object-cover" alt="Preview Banner" />
          </div>
        </div>
      </div>

      {/* Success Ticket Modal Popup */}
      <AnimatePresence>
        {successTicket && (
          <TicketModal
            registration={{ ...successTicket, eventId: event }}
            onClose={() => {
              setSuccessTicket(null);
              navigate(`/events/${id}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationForm;
