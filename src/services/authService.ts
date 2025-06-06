import api from './api';
import { LoginRequest, RegisterRequest, AuthUser, ApiResponse } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Error de login:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.post<ApiResponse<AuthUser>>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error de registro:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/logout');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cerrar sesión',
      };
    }
  },

  validateToken: async (): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.get<ApiResponse<AuthUser>>('/auth/validate');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al validar token',
      };
    }
  },
};