import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);

  const fetchRegistrations = async (email) => {
    if (!email) return;
    try {
      const res = await API.get(`/registrations/student?email=${email.toLowerCase()}`);
      if (res.data?.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user registrations:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchRegistrations(user.email);
    } else {
      setRegistrations([]);
    }
  }, [user]);

  // Fetch current user details on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data?.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Sign up handler
  const signup = async (name, email, password, role) => {
    try {
      const res = await API.post('/auth/signup', { name, email, password, role });
      if (res.data?.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Bookmark toggle handler
  const toggleBookmark = async (eventId) => {
    if (!user) return { success: false, error: 'Must be logged in to bookmark events' };
    try {
      const res = await API.put(`/auth/bookmark/${eventId}`);
      if (res.data?.success) {
        // Update user state local bookmarks array
        setUser((prev) => ({
          ...prev,
          bookmarkedEvents: res.data.bookmarkedEvents,
        }));
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Bookmark action failed' };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        toggleBookmark,
        isAdmin,
        isAuthenticated: !!user,
        registrations,
        fetchRegistrations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
