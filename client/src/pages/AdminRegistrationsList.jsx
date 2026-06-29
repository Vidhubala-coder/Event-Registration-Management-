import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import TicketModal from '../components/TicketModal';
import { TableSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Trash2, 
  CheckCheck, 
  UserX, 
  UserMinus,
  QrCode,
  Users,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminRegistrationsList = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId') || '';

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  // Load events list for filter dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/events?limit=100');
        if (res.data?.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations based on event filter
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedEventId 
        ? `/registrations?eventId=${selectedEventId}` 
        : '/registrations';
      const res = await API.get(url);
      if (res.data?.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleUpdateAttendance = async (regId, status) => {
    try {
      const res = await API.put(`/registrations/${regId}/attendance`, { attendanceStatus: status });
      if (res.data?.success) {
        showToast(res.data.message, 'success');
        // Update local state item
        setRegistrations((prev) =>
          prev.map((reg) => (reg._id === regId ? { ...reg, attendanceStatus: status } : reg))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update attendance', 'error');
    }
  };

  const handleDeleteRegistration = async (regId, attendeeName) => {
    const confirmCancel = window.confirm(`WARNING: Cancel registration for ${attendeeName}? This will restore 1 seat capacity.`);
    if (!confirmCancel) return;

    try {
      const res = await API.delete(`/registrations/${regId}`);
      if (res.data?.success) {
        showToast('Registration cancelled successfully', 'success');
        setRegistrations((prev) => prev.filter((reg) => reg._id !== regId));
      }
    } catch (err) {
      showToast(err.message || 'Cancellation failed', 'error');
    }
  };

  // Filter registrations by search term locally
  const filteredRegistrations = registrations.filter((reg) => {
    const term = searchTerm.toLowerCase();
    return (
      reg.studentName.toLowerCase().includes(term) ||
      reg.rollNumber.toLowerCase().includes(term) ||
      reg.email.toLowerCase().includes(term) ||
      reg.department.toLowerCase().includes(term) ||
      reg.eventId?.title.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header breadcrumb & title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="mb-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Attendee Registrations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review check-ins, cancel passes, and track entry attendance status.</p>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/20 dark:bg-slate-900/30 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
            placeholder="Search attendees by name, roll, email, or event..."
          />
        </div>

        {/* Event Select Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
          >
            <option value="">All Events</option>
            {events.map((evt) => (
              <option key={evt._id} value={evt._id}>
                {evt.title} ({evt.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Database Registrations Table */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-4">
        {loading ? (
          <TableSkeleton rows={8} />
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="w-12 h-12 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No attendee records matching active queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Student Name</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Roll Number</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Department</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Event</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider">Attendance</th>
                  <th className="pb-3 pr-3 uppercase font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-500/5">
                    <td className="py-3.5 pr-3 font-bold text-slate-900 dark:text-white">
                      <div>{reg.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{reg.email}</div>
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-slate-500 dark:text-slate-400">{reg.rollNumber}</td>
                    <td className="py-3.5 pr-3 truncate max-w-[150px]">{reg.department}</td>
                    <td className="py-3.5 pr-3 truncate max-w-[150px] font-bold">
                      {reg.eventId?.title || <span className="text-rose-500">Deleted Event</span>}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded ${
                        reg.attendanceStatus === 'Present' ? 'bg-indigo-500/10 text-indigo-500' :
                        reg.attendanceStatus === 'Absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {reg.attendanceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-right flex items-center justify-end gap-1.5">
                      {/* Attendance Buttons */}
                      <button
                        onClick={() => handleUpdateAttendance(reg._id, 'Present')}
                        className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-indigo-500 hover:bg-indigo-500 hover:text-white ${
                          reg.attendanceStatus === 'Present' ? 'bg-indigo-500 text-white border-transparent' : ''
                        }`}
                        title="Mark Present"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateAttendance(reg._id, 'Absent')}
                        className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white ${
                          reg.attendanceStatus === 'Absent' ? 'bg-rose-500 text-white border-transparent' : ''
                        }`}
                        title="Mark Absent"
                      >
                        <UserX className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateAttendance(reg._id, 'Pending')}
                        className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-500 hover:text-white ${
                          reg.attendanceStatus === 'Pending' ? 'bg-slate-500 text-white border-transparent' : ''
                        }`}
                        title="Set Pending"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>

                      {/* View ticket details */}
                      <button
                        onClick={() => setActiveTicket(reg)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                        title="Scan/Inspect Ticket"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* Cancel registration */}
                      <button
                        onClick={() => handleDeleteRegistration(reg._id, reg.studentName)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white"
                        title="Cancel Registration"
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

      {/* Ticket Modal popup inspector */}
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

export default AdminRegistrationsList;
