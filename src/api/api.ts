import axios from 'axios';

// Determine Base URL
// If VITE_API_URL is set, use it.
// Otherwise, if in Production, use relative '/api' (handled by Traefik/Nginx proxy).
// If in Development, use localhost:3001.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Helper to get static asset URLs (removes /api suffix if present)
export const getAssetUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // Already absolute
  
  // If base URL is relative '/api', asset root is just empty string (relative to root)
  // If base URL is http://localhost:3001/api, asset root is http://localhost:3001
  const root = API_BASE_URL.replace(/\/api$/, '');
  return `${root}${path}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
