import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthUser, ApiResponse } from '../types';
<<<<<<< HEAD
=======

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/auth';
>>>>>>> develop

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    try {
<<<<<<< HEAD
      const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
      return response.data;
=======
      const response = await axios.post(`${API_URL}/login`, credentials);
      return {
        success: true,
        message: 'Login successful',
        data: response.data,
      };
>>>>>>> develop
    } catch (error: any) {
      console.error('Error de login:', error.response?.data);
      return {
        success: false,
<<<<<<< HEAD
        message: error.response?.data?.message || 'Error al iniciar sesión',
=======
        message: error.response?.data?.message || error.message || 'Login failed',
>>>>>>> develop
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    try {
<<<<<<< HEAD
      const response = await api.post<ApiResponse<AuthUser>>('/auth/register', userData);
      return response.data;
=======
      const response = await axios.post(`${API_URL}/registro`, userData);
      return {
        success: true,
        message: 'Registro exitoso',
        data: response.data,
      };
>>>>>>> develop
    } catch (error: any) {
      console.error('Error de registro:', error.response?.data);
      return {
        success: false,
<<<<<<< HEAD
        message: error.response?.data?.message || 'Error al registrar usuario',
=======
        message: error.response?.data?.message || error.message || 'Registration failed',
>>>>>>> develop
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
<<<<<<< HEAD
    try {
      const response = await api.post<ApiResponse<null>>('/auth/logout');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cerrar sesión',
      };
    }
=======
    // Si el backend mantiene sesión, haz la petición aquí. Si solo usas JWT en frontend, simplemente borra el token.
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
>>>>>>> develop
  },

  validateToken: async (token: string): Promise<ApiResponse<AuthUser>> => {
    try {
<<<<<<< HEAD
      const response = await api.get<ApiResponse<AuthUser>>('/auth/validate');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al validar token',
=======
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
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Token inválido',
>>>>>>> develop
      };
    }
  }
};