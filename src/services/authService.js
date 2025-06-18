import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/auth';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return {
        success: true,
        message: 'Login successful',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/registro`, userData);
      return {
        success: true,
        message: 'Registro exitoso',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  },

  logout: async () => {
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  },

  validateToken: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        message: 'Token válido',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Token inválido',
      };
    }
  },
};