import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/SkeletonLoader';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventList = () => {
  const { t } = useLanguage();
  const socket = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters from URL
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'latest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(searchParam);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasMore: false,
  });

  // Search Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch events list
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (categoryParam !== 'All') queryParams.append('category', categoryParam);
      if (searchParam) queryParams.append('search', searchParam);
      if (sortParam) queryParams.append('sort', sortParam);
      queryParams.append('page', pageParam);
      queryParams.append('limit', 6);

      const res = await API.get(`/events?${queryParams.toString()}`);
      if (res.data?.success) {
        setEvents(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load events list:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, sortParam, pageParam]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time updates socket subscription
  useEffect(() => {
    if (!socket) return;

    const handleSeatUpdate = ({ eventId, registeredCount }) => {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt._id === eventId ? { ...evt, registeredCount } : evt
        )
      );
    };

    const handleEventUpdate = (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt._id === updatedEvent._id ? { ...evt, ...updatedEvent } : evt
        )
      );
    };

    const handleEventDelete = (deletedEventId) => {
      setEvents((prevEvents) =>
        prevEvents.filter((evt) => evt._id !== deletedEventId)
      );
    };

    const handleEventCreate = (newEvent) => {
      // Add if category matches current filter or if filter is All
      if (categoryParam === 'All' || categoryParam === newEvent.category) {
        setEvents((prevEvents) => [newEvent, ...prevEvents]);
      }
    };

    socket.on('seatUpdate', handleSeatUpdate);
    socket.on('eventUpdated', handleEventUpdate);
    socket.on('eventDeleted', handleEventDelete);
    socket.on('eventCreated', handleEventCreate);

    return () => {
      socket.off('seatUpdate', handleSeatUpdate);
      socket.off('eventUpdated', handleEventUpdate);
      socket.off('eventDeleted', handleEventDelete);
      socket.off('eventCreated', handleEventCreate);
    };
  }, [socket, categoryParam]);

  // Handle Search input change with suggestions
  useEffect(() => {
    if (!searchVal.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await API.get(`/events?search=${searchVal}&limit=5`);
        if (res.data?.success) {
          setSuggestions(res.data.data.map(e => e.title));
        }
      } catch (err) {
        console.error(err);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [searchVal]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const newParams = new URLSearchParams(searchParams);
    if (searchVal) {
      newParams.set('search', searchVal);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to page 1 on new search
    setSearchParams(newParams);
  };

  const selectSuggestion = (val) => {
    setSearchVal(val);
    setShowSuggestions(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', val);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', cat);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortType);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchVal('');
    setSearchParams({});
  };

  const categoriesList = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">Find Campus Events</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Filter workshops, competitions, and matches happening soon.</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white/20 dark:bg-slate-900/30 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-6 relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all font-medium text-sm"
            placeholder="Search events by title, description or tags..."
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                setSearchParams(newParams);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(sug)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Category selector */}
        <div className="lg:col-span-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <select
            value={categoryParam}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <ArrowUpDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <select
            value={sortParam}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
          >
            <option value="latest">Latest Added</option>
            <option value="soonest">Upcoming Date</option>
            <option value="oldest">Past Dates</option>
            <option value="seats">Total Seats</option>
          </select>
        </div>
      </div>

      {/* Events Grid layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No results found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your search keywords, switching categories, or clearing active filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(pageParam - 1)}
            disabled={pageParam === 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    pageParam === pageNum
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pageParam + 1)}
            disabled={pageParam === pagination.totalPages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
