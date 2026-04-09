import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  getMe: () => api.get('/me'),
};

// Profile APIs
export const profileAPI = {
  getMyProfile: () => api.get('/profile/me'),
  createProfile: (data) => api.post('/profile', data),
  updateProfile: (data) => api.put('/profile/me', data),
};

// Scheme APIs
export const schemeAPI = {
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.category) params.append('category', filters.category);
    if (filters.occupation) params.append('occupation', filters.occupation);
    return api.get(`/schemes/?${params.toString()}`);
  },
  search: (query) => api.get(`/schemes/search?q=${query}`),
  get: (id) => api.get(`/schemes/${id}`),
  checkEligibility: (schemeId, userId) => api.get(`/schemes/${schemeId}/eligibility/${userId}`),
};

// Application APIs
export const applicationAPI = {
  apply: (schemeId) => api.post(`/apply/${schemeId}`),
  getMyApplications: () => api.get('/applications'),
  updateTracking: (appId, trackingId, trackingLink) =>
    api.put(`/applications/${appId}/tracking`, {
      tracking_id: trackingId,
      tracking_link: trackingLink,
    }),
};

// Recommendation APIs
export const recommendationAPI = {
  getRecommendations: () => api.get('/recommendations'),
};

// Admin APIs
export const adminAPI = {
  // Scheme Management
  createScheme: (data) => api.post('/admin/schemes/', data),
  updateScheme: (id, data) => api.put(`/admin/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/admin/schemes/${id}`),
  
  // User Management
  getUsers: () => api.get('/admin/users/'),
  createUser: (data) => api.post('/admin/users/', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Application Management
  getApplications: () => api.get('/admin/applications/'),
  updateApplicationStatus: (id, status) => api.put(`/admin/applications/${id}/status?status=${status}`),
};

// Chatbot APIs
export const chatAPI = {
  chat: (message) => api.post('/chatbot/chat', { message }),
  conversation: (message, history) => api.post('/chatbot/conversation', { message, history }),
};

export default api;
