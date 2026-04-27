import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
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

// Auth endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Bug endpoints
export const bugService = {
  getAllBugs: () => api.get('/bugs'),
  getBugById: (id) => api.get(`/bugs/${id}`),
  createBug: (data) => api.post('/bugs', data),
  updateBug: (id, data) => api.put(`/bugs/${id}`, data),
  deleteBug: (id) => api.delete(`/bugs/${id}`),
};

export default api;
