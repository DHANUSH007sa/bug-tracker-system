import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crispy-happiness-976qqqwv6r763p7qw-5000.app.github.dev/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
