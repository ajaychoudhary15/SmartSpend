import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('smartspend_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartspend_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('smartspend_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('smartspend_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Authentication token invalid or expired');
          localStorage.removeItem('smartspend_token');
          localStorage.removeItem('smartspend_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('smartspend_token', res.data.token);
      localStorage.setItem('smartspend_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, currency) => {
    const res = await authApi.register({ name, email, password, currency });
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('smartspend_token', res.data.token);
      localStorage.setItem('smartspend_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('smartspend_token');
    localStorage.removeItem('smartspend_user');
    setUser(null);
    setToken(null);
  };

  const updateUserCurrency = async (newCurrency) => {
    try {
      const res = await authApi.updateProfile({ currency: newCurrency });
      if (res.success && res.data) {
        const updated = { ...user, currency: res.data.currency };
        setUser(updated);
        localStorage.setItem('smartspend_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to update currency preference', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUserCurrency,
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
