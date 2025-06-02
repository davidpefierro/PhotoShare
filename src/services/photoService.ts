import api from './api';
import { Photo, PhotoCreateRequest, PageResponse, ApiResponse } from '../types';

export const photoService = {
  getPhotos: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const response = await api.get<ApiResponse<PageResponse<Photo>>>('/photos', {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch photos.',
      };
    }
  },

  getUserPhotos: async (userId: number, page = 0, size = 10): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const response = await api.get<ApiResponse<PageResponse<Photo>>>(`/photos/user/${userId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user photos.',
      };
    }
  },

  getPhoto: async (id: number): Promise<ApiResponse<Photo>> => {
    try {
      const response = await api.get<ApiResponse<Photo>>(`/photos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch photo details.',
      };
    }
  },

  uploadPhoto: async (photoData: PhotoCreateRequest): Promise<ApiResponse<Photo>> => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('description', photoData.description);
      formData.append('imageFile', photoData.imageFile);

      const response = await api.post<ApiResponse<Photo>>('/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload photo.',
      };
    }
  },

  deletePhoto: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/photos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete photo.',
      };
    }
  },

  likePhoto: async (id: number): Promise<ApiResponse<{ liked: boolean }>> => {
    try {
      const response = await api.post<ApiResponse<{ liked: boolean }>>(`/photos/${id}/like`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to like photo.',
      };
    }
  },

  unlikePhoto: async (id: number): Promise<ApiResponse<{ liked: boolean }>> => {
    try {
      const response = await api.delete<ApiResponse<{ liked: boolean }>>(`/photos/${id}/like`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to unlike photo.',
      };
    }
  },
};