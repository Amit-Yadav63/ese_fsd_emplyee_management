import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  const fallbackUrl = 'http://localhost:5000/api';
  const baseUrl = (url || fallbackUrl).replace(/\/+$/, '');

  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
