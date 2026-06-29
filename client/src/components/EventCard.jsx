import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, User, Bookmark, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const { user, toggleBookmark, isAuthenticated, registrations } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const isBookmarked = user?.bookmarkedEvents?.includes(event._id) || false;
  const isRegistered = registrations?.some(
    (reg) => reg.eventId === event._id || reg.eventId?._id === event._id
  );

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const seatsLeft = Math.max(0, event.totalSeats - event.registeredCount);
  const fillPercentage = (event.registeredCount / event.totalSeats) * 100;

  // Category Theme classes
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Technical':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Cultural':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'Sports':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Workshop':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Banner / Media */}
      <div className="relative h-48 overflow-hidden shrink-0 group">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${getCategoryStyles(event.category)}`}>
          {event.category}
        </span>

        {/* Registered Badge */}
        {isRegistered && (
          <span className="absolute top-4 left-28 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm">
            Registered
          </span>
        )}

        {/* Bookmark Icon */}
        <button
          onClick={handleBookmark}
          className={`absolute top-4 right-4 p-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
            isBookmarked 
              ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg' 
              : 'bg-white/40 dark:bg-slate-950/40 border-white/20 text-white hover:bg-white hover:text-slate-900 dark:hover:bg-slate-950 dark:hover:text-white'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Event'}
        >
          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Deadline Indicator */}
        <div className="absolute bottom-4 left-4 text-xs text-white font-medium flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {new Date(event.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-extrabold text-lg line-clamp-1 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[40px]">
          {event.description}
        </p>

        {/* Detail Meta */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <User className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="truncate">{event.organiser}</span>
          </div>
        </div>

        {/* Progress Capacity bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            {seatsLeft === 0 ? (
              <span className="text-rose-500 font-bold">Sold Out</span>
            ) : seatsLeft < 15 ? (
              <span className="text-amber-500 pulse-skeleton font-bold">Filling Fast ({seatsLeft} {t('seatsLeft')})</span>
            ) : (
              <span className="text-slate-500">{seatsLeft} {t('seatsLeft')}</span>
            )}
            <span className="text-slate-400">{event.registeredCount}/{event.totalSeats} ({Math.round(fillPercentage)}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                fillPercentage >= 100 
                  ? 'bg-rose-500' 
                  : fillPercentage >= 85 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600'
              }`}
            />
          </div>
        </div>

        {/* Card Footer Button */}
        <div className="mt-6 pt-3">
          <Link
            to={`/events/${event._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
