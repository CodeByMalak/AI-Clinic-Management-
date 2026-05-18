import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create axios instance with base URL pointing to our backend API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token from localStorage and load user on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('mediflow_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Configure token header for validation check
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data);
        } else {
          // Token invalid, clean up
          localStorage.removeItem('mediflow_token');
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (err) {
        console.error('Failed to validate token on load:', err.message);
        localStorage.removeItem('mediflow_token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data;
        localStorage.setItem('mediflow_token', userData.token);
        
        // Add to current axios requests
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        setUser(userData);
        setLoading(false);
        return userData;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Registration handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const newUserData = response.data;
        localStorage.setItem('mediflow_token', newUserData.token);
        
        // Add to current axios requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newUserData.token}`;
        
        setUser(newUserData);
        setLoading(false);
        return newUserData;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please check details.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('mediflow_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  // Clear errors manually if needed
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the Auth Context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
