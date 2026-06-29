import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast('Message sent successfully! We will get back to you shortly.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Support</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Need help with tickets, certificate issuance, or admin listings? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
        {/* Support contacts info */}
        <div className="md:col-span-4 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg">Support Channels</h3>
            
            <div className="flex gap-4">
              <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 h-fit shrink-0">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Email Address</h4>
                <p className="text-sm font-semibold mt-0.5">support@eventpulse.edu</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 h-fit shrink-0">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Phone Hotline</h4>
                <p className="text-sm font-semibold mt-0.5">+1 (555) 192-8234</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 h-fit shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Campus Office</h4>
                <p className="text-sm font-semibold mt-0.5 leading-normal">Building 4, Sector B, Main University Campus</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-4 text-xs text-slate-400 leading-normal">
            Our support desk is available Monday to Friday, 9:00 AM to 5:00 PM for on-campus verification assistance.
          </div>
        </div>

        {/* Contact Form panel */}
        <div className="md:col-span-8 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
                  placeholder="john@student.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
                placeholder="e.g. Question regarding Hackathon ticket check-in"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Message Detail
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-sm"
                placeholder="Write your support request here..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-2xl font-bold gradient-btn flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
