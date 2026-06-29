import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        setSent(true);
        showToast('Reset email sent successfully!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Error requesting reset', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-xl"
      >
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        {!sent ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Enter your email address to receive a password reset link in the server logs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                    placeholder="you@student.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold gradient-btn disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4 border border-emerald-500/20">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Check Server Logs!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
              A recovery URL link has been successfully logged to the backend terminal server console for secure verification.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Resend email
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
