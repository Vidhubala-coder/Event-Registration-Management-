import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, Users, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, role);
    setLoading(false);

    if (res.success) {
      showToast('Account created successfully!', 'success');
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/events');
      }
    } else {
      showToast(res.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('navSignup')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create an EventPulse account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {t('fullName')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {t('email')}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                placeholder="john@student.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Users className="w-5 h-5" />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all appearance-none cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="student" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Student</option>
                <option value="admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Admin</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 rounded-2xl font-bold gradient-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 justify-center mt-1"
            >
              <span>Login instead</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
