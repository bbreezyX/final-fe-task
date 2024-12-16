import axios from 'axios';

// Gunakan baseURL production
const API = axios.create({
  baseURL: 'https://be-final-task.vercel.app/api', // Backend production
});

// Tambahkan token JWT ke setiap request
API.interceptors.request.use((config) => {
  console.log('Request config:', config);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API
export const login = (data) => API.post('/users/login', data);
export const register = (data) => API.post('/users/signup', data);

// Task API
export const getTasks = () => API.get('/tasks');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
