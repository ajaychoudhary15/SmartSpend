import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// Normalize if user provides a full backend URL without /api in production (e.g. on Netlify)
if (rawBaseURL.startsWith('http') && !rawBaseURL.endsWith('/api') && !rawBaseURL.includes('/api/')) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL: rawBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartspend_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthRoute) {
        localStorage.removeItem('smartspend_token');
        localStorage.removeItem('smartspend_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
