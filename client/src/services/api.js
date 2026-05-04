import api from '../api/axios';

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

// Activity endpoints
export const activityService = {
  getActivities: () => api.get('/activity'),
};

export default api;