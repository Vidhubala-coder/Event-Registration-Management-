import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Loader2, Save, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminEditEvent = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [organiser, setOrganiser] = useState('');
  const [totalSeats, setTotalSeats] = useState(50);
  const [deadline, setDeadline] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [eventStatus, setEventStatus] = useState('Upcoming');

  // Load existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        if (res.data?.success) {
          const event = res.data.data;
          setTitle(event.title);
          setDescription(event.description);
          setCategory(event.category);
          setVenue(event.venue);
          setOrganiser(event.organiser);
          setTotalSeats(event.totalSeats);
          setBannerImage(event.bannerImage);
          setEventStatus(event.eventStatus);
          setTagsInput(event.tags?.join(', ') || '');
          setTime(event.time);

          // Convert date objects to ISO string dates for input default value
          if (event.date) {
            setDate(new Date(event.date).toISOString().split('T')[0]);
          }
          if (event.deadline) {
            setDeadline(new Date(event.deadline).toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        showToast('Event not found', 'error');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !date || !time || !venue || !organiser || !totalSeats || !deadline) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const eventDate = new Date(date);
    const deadlineDate = new Date(deadline);
    if (deadlineDate > eventDate) {
      showToast('Registration deadline must be before the event date', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title,
        description,
        category,
        date: eventDate,
        time,
        venue,
        organiser,
        totalSeats: parseInt(totalSeats, 10),
        deadline: deadlineDate,
        tags: tagsArray,
        eventStatus,
        bannerImage,
      };

      const res = await API.put(`/events/${id}`, payload);
      if (res.data?.success) {
        showToast('Event updated successfully!', 'success');
        navigate('/admin');
      }
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Technical', 'Cultural', 'Sports', 'Workshop'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Edit form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-xl"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Edit Event Details</h1>
          <p className="text-xs text-slate-400 mt-1">Modify details for: {title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
            />
          </div>

          {/* Category, Seats & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Seats Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                required
                min="1"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
              >
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
              />
            </div>
          </div>

          {/* Venue & Organiser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Organiser Department / Club <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={organiser}
                onChange={(e) => setOrganiser(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
              />
            </div>
          </div>

          {/* Deadline & Banner Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Registration Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Banner Image URL
              </label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Event Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl font-bold gradient-btn flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Save Changes</span>
                <Save className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminEditEvent;
