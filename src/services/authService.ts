import api from './api';
import { LoginRequest, RegisterRequest, AuthUser, ApiResponse } from '../types';

// Reemplaza estas rutas por las que exponga tu backend Java Spring Boot.
// Suelen estar bajo /api/auth/...

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.post<ApiResponse<AuthUser>>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Registration failed',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      // Si tu backend tiene endpoint de logout, llama aquí.
      const response = await api.post<ApiResponse<null>>('/auth/logout');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Logout failed',
      };
    }
  },

  validateToken: async (): Promise<ApiResponse<AuthUser>> => {
    try {
      // Aquí deberías pasar el token, normalmente ya lo hace Axios con headers.
      const response = await api.get<ApiResponse<AuthUser>>('/auth/validate');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Token validation failed',
      };
    }
  },

  // Si necesitas crear el admin, agrega lógica aquí para llamar a tu backend
  ensureAdminExists: async (): Promise<void> => {
    // Opcional: puedes hacer una petición a un endpoint de tu backend para crear el admin si no existe
  }
};