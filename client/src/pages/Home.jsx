import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/SkeletonLoader';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code, 
  Music, 
  Trophy, 
  BookOpen, 
  Users, 
  CalendarDays, 
  ArrowRight, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { t } = useLanguage();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingCount: 0,
    seatsLeft: 0,
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Load featured events (Upcoming, limit 3)
        const eventsRes = await API.get('/events?upcoming=true&limit=3');
        if (eventsRes.data?.success) {
          setFeaturedEvents(eventsRes.data.data);
          setStats((prev) => ({
            ...prev,
            upcomingCount: eventsRes.data.pagination.totalEvents,
          }));
        }

        // Get total events counts
        const allEvents = await API.get('/events?limit=100');
        if (allEvents.data?.success) {
          const events = allEvents.data.data;
          const totalSeats = events.reduce((sum, e) => sum + e.totalSeats, 0);
          const totalRegistered = events.reduce((sum, e) => sum + e.registeredCount, 0);
          setStats((prev) => ({
            ...prev,
            totalEvents: allEvents.data.pagination.totalEvents,
            seatsLeft: Math.max(0, totalSeats - totalRegistered),
          }));
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
  };

  const categories = [
    { name: 'Technical', icon: Code, color: 'from-blue-500 to-indigo-600', count: 'Hackathons, coding challenges, tech talks' },
    { name: 'Cultural', icon: Music, color: 'from-pink-500 to-rose-600', count: 'Fests, dance battles, music nights' },
    { name: 'Sports', icon: Trophy, color: 'from-emerald-400 to-teal-600', count: 'Football leagues, athletics, cricket tourneys' },
    { name: 'Workshop', icon: BookOpen, color: 'from-amber-400 to-orange-600', count: 'Hands-on training, AI panels, coding labs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 space-y-24">
      {/* 1. Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-violet-200 bg-violet-500/5 dark:border-violet-800 text-violet-600 dark:text-violet-400 text-xs font-extrabold uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>The ultimate campus portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
            {t('homeHeroTitle')}
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {t('homeHeroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link
              to="/events"
              className="gradient-btn px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 group transition-all text-base"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/my-registrations"
              className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-3.5 rounded-2xl font-bold transition-all text-base flex items-center justify-center"
            >
              View My Tickets
            </Link>
          </div>
        </motion.div>

        {/* Hero Decorative Graphics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-5 relative hidden lg:flex justify-center"
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
          
          <div className="relative rounded-3xl border border-white/20 overflow-hidden shadow-2xl p-4 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
              alt="Campus Events Hub"
              className="rounded-2xl max-w-full h-80 object-cover shadow-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* 2. Stats Dashboard Banner */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md"
      >
        <motion.div variants={itemVariants} className="text-center p-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
          <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-2">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-extrabold">{stats.totalEvents}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-wider">Total Cataloged Events</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center p-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
          <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-2">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-extrabold">{stats.upcomingCount}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-wider">{t('upcomingCount')}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center p-4">
          <div className="flex justify-center text-violet-600 dark:text-violet-400 mb-2">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-extrabold">{stats.seatsLeft}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-wider">Available Seats Left</p>
        </motion.div>
      </motion.div>

      {/* 3. Browse Categories */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{t('allCategories')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Filter and inspect events by type</p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[200px]"
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-md w-fit`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="mt-8 space-y-2">
                  <h3 className="text-xl font-extrabold">{cat.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{cat.count}</p>
                </div>

                <Link
                  to={`/events?category=${cat.name}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-violet-600 dark:text-violet-400 hover:opacity-85 transition-opacity"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Featured Events */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{t('featuredEvents')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Upcoming premium events closing registrations soon</p>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 group"
          >
            <span>See All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No upcoming events cataloged at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
