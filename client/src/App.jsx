import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Styling
import MainLayout from './layouts/MainLayout';
import { Loader2 } from 'lucide-react';

// Pages
import Home from './pages/Home';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import RegistrationForm from './pages/RegistrationForm';
import MyRegistrations from './pages/MyRegistrations';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm';
import AdminEditEvent from './pages/AdminEditEvent';
import AdminRegistrationsList from './pages/AdminRegistrationsList';

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <SocketProvider>
              <AuthProvider>
                <MainLayout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/register/:id" element={<RegistrationForm />} />
                    <Route path="/my-registrations" element={<MyRegistrations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Admin Protected Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/events/new"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminEventForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/events/edit/:id"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminEditEvent />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/registrations"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminRegistrationsList />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </AuthProvider>
            </SocketProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
