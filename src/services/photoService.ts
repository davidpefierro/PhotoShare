import api from './api';
import { Photo, PhotoCreateRequest, PageResponse, ApiResponse } from '../types';

export const photoService = {
  obtenerFotos: async (pagina = 0, tamaño = 10): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const respuesta = await api.get<ApiResponse<PageResponse<Photo>>>('/fotografias', {
        params: { page: pagina, size: tamaño },
      });
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudieron obtener las fotos.',
      };
    }
  },

  obtenerFotosDeUsuario: async (idUsuario: number, pagina = 0, tamaño = 10): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const respuesta = await api.get<ApiResponse<PageResponse<Photo>>>(`/fotografias/user/${idUsuario}`, {
        params: { page: pagina, size: tamaño },
      });
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudieron obtener las fotos del usuario.',
      };
    }
  },

  obtenerFoto: async (id: number): Promise<ApiResponse<Photo>> => {
    try {
      const respuesta = await api.get<ApiResponse<Photo>>(`/fotografias/${id}`);
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudo obtener el detalle de la foto.',
      };
    }
  },

  subirFoto: async (datosFoto: PhotoCreateRequest & { idUsuario: number }): Promise<ApiResponse<Photo>> => {
    try {
      // Crear FormData para la subida del archivo
      const formData = new FormData();
      formData.append('descripcion', datosFoto.description);
      formData.append('imageFile', datosFoto.imageFile);
      formData.append('idUsuario', datosFoto.idUsuario.toString());

      const respuesta = await api.post<ApiResponse<Photo>>('/api/fotografias/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudo subir la foto.',
      };
    }
  },

  eliminarFoto: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const respuesta = await api.delete<ApiResponse<null>>(`/fotografias/${id}`);
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudo eliminar la foto.',
      };
    }
  },

  darLikeAFoto: async (id: number): Promise<ApiResponse<{ liked: boolean }>> => {
    try {
      const respuesta = await api.post<ApiResponse<{ liked: boolean }>>(`/fotografias/${id}/like`);
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudo dar like a la foto.',
      };
    }
  },

  quitarLikeAFoto: async (id: number): Promise<ApiResponse<{ liked: boolean }>> => {
    try {
      const respuesta = await api.delete<ApiResponse<{ liked: boolean }>>(`/fotografias/${id}/like`);
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudo quitar el like a la foto.',
      };
    }
  },
};