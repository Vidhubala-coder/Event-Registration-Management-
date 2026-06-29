import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';
import { EventDetailSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  Share2, 
  Star, 
  Users, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Ticket,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetail = () => {
  const { id } = useParams();
  const { user, toggleBookmark, isAuthenticated, registrations } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const socket = useSocket();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const userRegistration = registrations?.find(
    (reg) => reg.eventId === id || reg.eventId?._id === id
  );
  const isRegistered = !!userRegistration;
  
  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  const isBookmarked = user?.bookmarkedEvents?.includes(id) || false;

  useEffect(() => {
    const loadEventData = async () => {
      setLoading(true);
      try {
        // Fetch current event
        const res = await API.get(`/events/${id}`);
        if (res.data?.success) {
          const eventData = res.data.data;
          setEvent(eventData);

          // Fetch related events of same category
          const relatedRes = await API.get(`/events?category=${eventData.category}&limit=4`);
          if (relatedRes.data?.success) {
            // Filter out current event
            const filtered = relatedRes.data.data.filter((e) => e._id !== id).slice(0, 3);
            setRelatedEvents(filtered);
          }
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
        showToast('Event not found', 'error');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    loadEventData();
  }, [id, navigate]);

  // Real-time socket updates for seats and details
  useEffect(() => {
    if (!socket || !event) return;

    const handleSeatUpdate = ({ eventId, registeredCount }) => {
      if (eventId === event._id) {
        setEvent((prev) => ({ ...prev, registeredCount }));
      }
    };

    const handleEventUpdate = (updatedEvent) => {
      if (updatedEvent._id === event._id) {
        setEvent(updatedEvent);
        showToast('This event has been updated by the administrator.', 'info');
      }
    };

    const handleEventDelete = (deletedEventId) => {
      if (deletedEventId === event._id) {
        showToast('This event has been deleted by the administrator.', 'warning');
        navigate('/events');
      }
    };

    socket.on('seatUpdate', handleSeatUpdate);
    socket.on('eventUpdated', handleEventUpdate);
    socket.on('eventDeleted', handleEventDelete);

    return () => {
      socket.off('seatUpdate', handleSeatUpdate);
      socket.off('eventUpdated', handleEventUpdate);
      socket.off('eventDeleted', handleEventDelete);
    };
  }, [socket, event, showToast, navigate]);

  // Countdown timer calculation
  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => {
      const deadlineDate = new Date(event.deadline).getTime();
      const now = new Date().getTime();
      const difference = deadlineDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Please login to bookmark events', 'warning');
      return;
    }
    const res = await toggleBookmark(event._id);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Event link copied to clipboard!', 'info');
  };

  if (loading) return <EventDetailSkeleton />;
  if (!event) return null;

  const seatsLeft = Math.max(0, event.totalSeats - event.registeredCount);
  const formattedEventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/events" className="hover:text-slate-600 transition-colors">Events</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">{event.title}</span>
      </div>

      {/* 2. Top Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800/80 h-96 shrink-0 bg-slate-900">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Floating details */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-600/10 backdrop-blur-md text-violet-400">
              {event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-400" />
                {formattedEventDate}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-violet-400" />
                {event.venue}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-2xl border backdrop-blur-md transition-colors ${
                isBookmarked 
                  ? 'bg-yellow-500 border-yellow-500 text-white' 
                  : 'bg-white/15 hover:bg-white/30 border-white/20 text-white'
              }`}
              title="Bookmark Event"
            >
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-white/20 bg-white/15 hover:bg-white/30 text-white transition-colors"
              title="Share Event"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Event Details Body grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Descriptions */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-4">
            <h2 className="text-xl font-extrabold">Event Description</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
              {event.description}
            </p>

            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Event Gallery */}
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-violet-500" />
              <span>Event Gallery</span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=300" className="rounded-xl object-cover h-24 w-full" alt="Gallery 1" />
              <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=300" className="rounded-xl object-cover h-24 w-full" alt="Gallery 2" />
              <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300" className="rounded-xl object-cover h-24 w-full" alt="Gallery 3" />
            </div>
          </div>
        </div>

        {/* Right Column: Register and Countdown Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Countdown Clock */}
          {!timeLeft.expired && (
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md text-center space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-violet-500" />
                <span>{t('countdown')}</span>
              </h3>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl">
                  <span className="text-xl font-extrabold block">{timeLeft.days}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl">
                  <span className="text-xl font-extrabold block">{timeLeft.hours}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hrs</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl">
                  <span className="text-xl font-extrabold block">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Mins</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl">
                  <span className="text-xl font-extrabold block">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Secs</span>
                </div>
              </div>
            </div>
          )}

          {/* Registration Info Panel */}
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-6">
            <h3 className="text-lg font-extrabold">Registration Details</h3>
            
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Organiser</span>
                <span>{event.organiser}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Timings</span>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deadline Date</span>
                <span>{new Date(event.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Live Seats Remaining</span>
                <span className={seatsLeft === 0 ? 'text-rose-500 font-bold' : seatsLeft < 15 ? 'text-amber-500 font-bold' : ''}>
                  {seatsLeft === 0 ? 'Sold Out' : `${seatsLeft} / ${event.totalSeats}`}
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            {isRegistered ? (
              <button
                onClick={() => setShowTicketModal(true)}
                className="w-full text-center py-3.5 rounded-2xl block font-bold bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>View Ticket</span>
              </button>
            ) : event.eventStatus === 'Cancelled' ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center text-sm font-bold flex items-center gap-2 justify-center">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Event Cancelled</span>
              </div>
            ) : event.eventStatus === 'Completed' ? (
              <div className="p-4 bg-slate-500/10 border border-slate-500/20 text-slate-500 rounded-2xl text-center text-sm font-bold flex items-center gap-2 justify-center">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Event Finished</span>
              </div>
            ) : timeLeft.expired ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center text-sm font-bold flex items-center gap-2 justify-center">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Registrations Closed</span>
              </div>
            ) : seatsLeft === 0 ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center text-sm font-bold flex items-center gap-2 justify-center">
                <Users className="w-5 h-5 shrink-0" />
                <span>Sold Out</span>
              </div>
            ) : (
              <Link
                to={`/register/${event._id}`}
                className="w-full text-center py-3.5 rounded-2xl block font-bold gradient-btn shadow-md hover:shadow-lg transition-all"
              >
                {t('btnRegister')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4. Related Events */}
      {relatedEvents.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200/60 dark:border-slate-800/80">
          <h2 className="text-2xl font-extrabold">Related {event.category} Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showTicketModal && userRegistration && (
          <TicketModal
            registration={userRegistration}
            onClose={() => setShowTicketModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetail;
