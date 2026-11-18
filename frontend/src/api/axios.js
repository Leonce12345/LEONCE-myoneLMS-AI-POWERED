import axios from 'axios';

// We use the same base URL logic as your Login.jsx
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// This interceptor automatically runs before every request
api.interceptors.request.use(
  (config) => {
    // It grabs the token you saved during login
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;