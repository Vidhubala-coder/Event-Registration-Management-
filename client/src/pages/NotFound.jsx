import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <span className="inline-block p-5 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-xl">
          <ShieldAlert className="w-16 h-16" />
        </span>
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight leading-none text-slate-900 dark:text-white">404</h1>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            The page you are looking for does not exist or has been relocated by the system administrators.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-bold gradient-btn rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
