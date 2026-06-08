import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const fingerprint = localStorage.getItem('sessionFingerprint');
  if (fingerprint) config.headers['X-Session-Fingerprint'] = fingerprint;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('sessionFingerprint');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
