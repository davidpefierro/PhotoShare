import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de token expirado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data?.message) {
      console.error('Error de API:', error.response.data.message);
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;