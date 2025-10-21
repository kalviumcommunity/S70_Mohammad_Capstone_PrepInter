import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signIn';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgotpassword', { email }),
  verifyOTP: (data) => api.post('/users/verifyotp', data),
  resetPassword: (data) => api.post('/users/resetpassword', data),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('profilePicture', file);
    return api.post('/users/picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Interview API
export const interviewAPI = {
  startInterview: (data) => api.post('/interviews/start', data),
  getInterviews: () => api.get('/interviews'),
  getInterviewById: (id) => api.get(`/interviews/${id}`),
  updateInterview: (id, data) => api.put(`/interviews/${id}`, data),
  deleteInterview: (id) => api.delete(`/interviews/${id}`),
  getNextQuestion: () => api.get('/interview/question'),
  submitAnswer: (data) => api.post('/interview/answer', data),
  completeInterview: (id) => api.put(`/interviews/${id}/complete`),
  skipQuestion: () => api.post('/interviews/skip'),
};

// Analytics API
export const analyticsAPI = {
  getProgress: (params) => api.get('/analytics/progress', { params }),
  getHistory: (params) => api.get('/analytics/history', { params }),
  getInsights: () => api.get('/analytics/insights'),
  getLatest: () => api.get('/analytics/latest'),
  getRecommendations: () => api.get('/analytics/recommendations'),
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentHistory: () => api.get('/payments/history'),
  getSubscriptionStatus: () => api.get('/payments/subscription'),
};

export default api;
