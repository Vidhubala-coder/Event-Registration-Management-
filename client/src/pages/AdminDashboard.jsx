import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { TableSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Plus, 
  Calendar, 
  Users, 
  Layers, 
  UserCheck, 
  PlusCircle,
  Settings,
  Edit2,
  Trash2,
  Ticket,
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fetch admin stats
  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get('/events/dashboard/stats');
      if (statsRes.data?.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch admin stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events list for simple CRUD actions
  const fetchEventsList = async () => {
    try {
      const res = await API.get('/events?limit=100');
      if (res.data?.success) {
        setEventsList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEventsList();
  }, []);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    const confirmDelete = window.confirm(`WARNING: Deleting "${eventTitle}" will permanently erase all associated registrations. Continue?`);
    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/events/${eventId}`);
      if (res.data?.success) {
        showToast('Event deleted successfully', 'success');
        // Reload dashboard data and events list
        setEventsList((prev) => prev.filter((e) => e._id !== eventId));
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical': return 'bg-indigo-500';
      case 'Cultural': return 'bg-rose-500';
      case 'Sports': return 'bg-emerald-500';
      case 'Workshop': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Portal Administrator Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage event items, registrations database, and attendance records.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/events/new"
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold gradient-btn shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
          <Link
            to="/admin/registrations"
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all"
          >
            <Ticket className="w-5 h-5" />
            <span>View Registrations</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 pulse-skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm flex items-center gap-4">
            <span className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Events</h3>
              <p className="text-3xl font-black mt-1">{stats?.stats?.totalEvents || 0}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm flex items-center gap-4">
            <span className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Registrations</h3>
              <p className="text-3xl font-black mt-1">{stats?.stats?.totalRegistrations || 0}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm flex items-center gap-4">
            <span className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Seats Occupied</h3>
              <p className="text-3xl font-black mt-1">{stats?.stats?.occupiedSeats || 0}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm flex items-center gap-4">
            <span className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <UserCheck className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upcoming</h3>
              <p className="text-3xl font-black mt-1">{stats?.stats?.upcomingEvents || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of details: Analytics Visuals vs Recent tickets */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Division Chart card */}
          <div className="lg:col-span-4 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-6">
            <h3 className="font-extrabold text-base">Category Distributions</h3>
            <div className="space-y-4">
              {stats?.categoryStats?.map((cat) => {
                const total = stats.stats.totalEvents || 1;
                const percent = (cat.count / total) * 100;
                return (
                  <div key={cat._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{cat._id}</span>
                      <span>{cat.count} events ({Math.round(percent)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getCategoryColor(cat._id)}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Registrations Ticket Table */}
          <div className="lg:col-span-8 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base">Recent Activity Log</h3>
              <Link to="/admin/registrations" className="text-xs font-bold text-violet-600 hover:underline">
                View All registrations
              </Link>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="pb-3 pr-3 font-bold uppercase tracking-wider">Attendee</th>
                    <th className="pb-3 pr-3 font-bold uppercase tracking-wider">Event Item</th>
                    <th className="pb-3 pr-3 font-bold uppercase tracking-wider">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentRegistrations?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-slate-400 font-semibold">
                        No registrations received yet.
                      </td>
                    </tr>
                  ) : (
                    stats?.recentRegistrations?.map((reg) => (
                      <tr key={reg._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 text-slate-700 dark:text-slate-350">
                        <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">{reg.studentName}</td>
                        <td className="py-3 pr-3 font-semibold">{reg.eventId?.title || 'Deleted Event'}</td>
                        <td className="py-3 pr-3">{new Date(reg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Manager: List of all Event items in database */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-6">
        <h3 className="font-extrabold text-lg">Manage Events Catalog</h3>

        {eventsLoading ? (
          <TableSkeleton />
        ) : eventsList.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">No events present in database. Click 'Create Event' to populate.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Title</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Category</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Seats Booked</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Event Status</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {eventsList.map((evt) => (
                  <tr key={evt._id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-500/5">
                    <td className="py-3.5 pr-3 font-extrabold text-slate-900 dark:text-white truncate max-w-[200px]">
                      <Link to={`/events/${evt._id}`} className="hover:underline">{evt.title}</Link>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full ${getCategoryColor(evt.category)}/10 text-slate-900 dark:text-white`}>
                        {evt.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 font-bold">
                      {evt.registeredCount} / {evt.totalSeats}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        evt.eventStatus === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-500' :
                        evt.eventStatus === 'Completed' ? 'bg-slate-500/10 text-slate-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {evt.eventStatus}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-right flex items-center justify-end gap-1.5">
                      {/* View attendee button */}
                      <Link
                        to={`/admin/registrations?eventId=${evt._id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                        title="View attendees"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      
                      {/* Edit event */}
                      <Link
                        to={`/admin/events/edit/${evt._id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                        title="Edit event details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete event */}
                      <button
                        onClick={() => handleDeleteEvent(evt._id, evt.title)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
