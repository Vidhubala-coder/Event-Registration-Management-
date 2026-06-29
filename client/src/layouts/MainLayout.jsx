import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Bookmark, 
  Ticket 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navEvents'), path: '/events' },
    { name: t('navAbout'), path: '/about' },
    { name: t('navContact'), path: '/contact' },
  ];

  return (
    <div className={`min-h-screen flex flex-col gradient-bg ${isDark ? 'dark gradient-bg-dark text-slate-100' : 'text-slate-900'}`}>
      {/* Sticky Glass Navbar */}
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${isDark ? 'glass-nav-dark' : 'glass-nav-light'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                  <Calendar className="w-5 h-5" />
                </span>
                <span className="gradient-text font-sans">EventPulse</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions Panel */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>{locale === 'en' ? 'ES' : 'EN'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
              </button>

              {/* Authentication Actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:opacity-85"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('navAdminDashboard')}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/my-registrations"
                      className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Ticket className="w-4.5 h-4.5" />
                      <span>{t('navMyRegistrations')}</span>
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold max-w-[90px] truncate">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title={t('navLogout')}
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
                  >
                    {t('navLogin')}
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-bold gradient-btn px-4 py-2 rounded-xl shadow-sm"
                  >
                    {t('navSignup')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                      isActive(link.path)
                        ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Globe className="w-4.5 h-4.5" />
                    <span>{locale === 'en' ? 'Español' : 'English'}</span>
                  </button>

                  {isAuthenticated ? (
                    <>
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-violet-600 dark:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4.5 h-4.5" />
                          <span>{t('navAdminDashboard')}</span>
                        </Link>
                      ) : (
                        <Link
                          to="/my-registrations"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Ticket className="w-4.5 h-4.5" />
                          <span>{t('navMyRegistrations')}</span>
                        </Link>
                      )}
                      
                      <div className="px-3 py-2 text-sm text-slate-400">
                        Logged in as: <strong className="text-slate-700 dark:text-slate-200">{user.name}</strong>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <LogOut className="w-4.5 h-4.5" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-2">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-2 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                      >
                        {t('navLogin')}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-2 gradient-btn rounded-xl font-bold text-sm"
                      >
                        {t('navSignup')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="flex items-center gap-2 font-extrabold text-xl">
                <Calendar className="w-5 h-5 text-violet-600" />
                <span className="gradient-text font-sans">EventPulse</span>
              </span>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                A modern event cataloguing and ticket registration ecosystem supporting real-time capacities updates and entry authentications.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Navigation</h4>
              <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                <Link to="/events" className="hover:text-violet-600 transition-colors">Find Events</Link>
                <Link to="/my-registrations" className="hover:text-violet-600 transition-colors">My Tickets</Link>
                <Link to="/about" className="hover:text-violet-600 transition-colors">Project Specifications</Link>
                <Link to="/contact" className="hover:text-violet-600 transition-colors">Contact Support</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tech Specifications</h4>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Frontend: React, Tailwind CSS, Framer Motion, Axios, Socket.IO Client.<br />
                Backend: Node.js, Express, MongoDB Atlas, Mongoose, Socket.IO.
              </p>
              <div className="mt-4 text-xs text-slate-500">
                &copy; {new Date().getFullYear()} EventPulse. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
