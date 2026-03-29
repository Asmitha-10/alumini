import axios from 'axios';

const resolveDevApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  const protocol = process.env.REACT_APP_API_PROTOCOL || 'http:';
  const host = window.location.hostname || 'localhost';
  const port = process.env.REACT_APP_API_PORT || '5000';

  return `${protocol}//${host}:${port}/api`;
};

const defaultApiUrl = process.env.NODE_ENV === 'production' ? '/api' : resolveDevApiUrl();

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultApiUrl,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
