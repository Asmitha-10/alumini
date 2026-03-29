import axios from 'axios';

const defaultApiUrl =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

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
