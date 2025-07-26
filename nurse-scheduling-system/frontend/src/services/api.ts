import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  getProfile: () =>
    api.get('/users/me').then(res => res.data),
};

// User API
export const userAPI = {
  getAll: () =>
    api.get('/users').then(res => res.data),
  
  create: (userData: any) =>
    api.post('/users', userData).then(res => res.data),
  
  update: (id: number, userData: any) =>
    api.patch(`/users/${id}`, userData).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/users/${id}`).then(res => res.data),
};

// Nurse API
export const nurseAPI = {
  getAll: () =>
    api.get('/nurses').then(res => res.data),
  
  getOne: (id: number) =>
    api.get(`/nurses/${id}`).then(res => res.data),
  
  create: (nurseData: any) =>
    api.post('/nurses', nurseData).then(res => res.data),
  
  update: (id: number, nurseData: any) =>
    api.patch(`/nurses/${id}`, nurseData).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/nurses/${id}`).then(res => res.data),
  
  getAvailable: (date: string, shiftId: number) =>
    api.get(`/nurses/available?date=${date}&shiftId=${shiftId}`).then(res => res.data),
};

// Schedule API
export const scheduleAPI = {
  getByMonth: (monthYear: string) =>
    api.get(`/schedules?monthYear=${monthYear}`).then(res => res.data),
  
  getNurseSchedule: (nurseId: number, monthYear: string) =>
    api.get(`/schedules/nurse/${nurseId}?monthYear=${monthYear}`).then(res => res.data),
  
  generate: (data: { startDate: string; endDate: string; monthYear: string }) =>
    api.post('/schedules/generate', data).then(res => res.data),
  
  createAssignment: (data: { date: string; nurse_id: number; shift_id: number }) =>
    api.post('/schedules/assignments', data).then(res => res.data),
  
  updateAssignment: (id: number, data: any) =>
    api.patch(`/schedules/assignments/${id}`, data).then(res => res.data),
  
  deleteAssignment: (id: number) =>
    api.delete(`/schedules/assignments/${id}`).then(res => res.data),
};

// Request API
export const requestAPI = {
  getAll: () =>
    api.get('/requests').then(res => res.data),
  
  getMy: () =>
    api.get('/requests/my-requests').then(res => res.data),
  
  getOne: (id: number) =>
    api.get(`/requests/${id}`).then(res => res.data),
  
  createLeaveRequest: (data: { requester_id: number; leave_start_date: string; leave_end_date: string }) =>
    api.post('/requests/leave', data).then(res => res.data),
  
  createShiftExchangeRequest: (data: {
    requester_id: number;
    target_nurse_id: number;
    source_assignment_id: number;
    target_assignment_id: number;
  }) =>
    api.post('/requests/shift-exchange', data).then(res => res.data),
  
  updateStatus: (id: number, data: { status: string }) =>
    api.patch(`/requests/${id}/status`, data).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/requests/${id}`).then(res => res.data),
};

// Shift API
export const shiftAPI = {
  getAll: () =>
    api.get('/shifts').then(res => res.data),
  
  getOne: (id: number) =>
    api.get(`/shifts/${id}`).then(res => res.data),
  
  create: (shiftData: any) =>
    api.post('/shifts', shiftData).then(res => res.data),
  
  update: (id: number, shiftData: any) =>
    api.patch(`/shifts/${id}`, shiftData).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/shifts/${id}`).then(res => res.data),
  
  initialize: () =>
    api.post('/shifts/initialize').then(res => res.data),
};

export default api;