import api from './api';
import { Photo, PhotoCreateRequest, PageResponse, ApiResponse } from '../types';

// Puedes pasar el idUsuario autenticado a los métodos para que userLiked siempre sea correcto.
export const photoService = {
  obtenerFotos: async (
    pagina = 0,
    tamaño = 10,
    idUsuario?: number
  ): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const respuesta = await api.get('/fotografias', {
        params: { page: pagina, size: tamaño, ...(idUsuario ? { idUsuario } : {}) },
      });
      if (respuesta.data && Array.isArray(respuesta.data.content)) {
        const mapped = {
          ...respuesta.data,
          content: respuesta.data.content.map((foto: any) => ({
            id: foto.idFoto,
            userId: foto.idUsuario,
            url: foto.url,
            description: foto.descripcion,
            datePosted: foto.fechaPublicacion,
            nombreUsuario: foto.nombreUsuario,
            idFoto: foto.idFoto,
            idUsuario: foto.idUsuario,
            fechaPublicacion: foto.fechaPublicacion,
            userLiked: foto.userLiked,
            likesCount: foto.likesCount,
            commentsCount: foto.commentsCount,
          })),
        };
        return {
          success: true,
          data: mapped,
        };
      }
      return { success: false, message: 'Formato inesperado' };
    } catch (error) {
      return { success: false, message: 'No se pudieron obtener las fotos.' };
    }
  },

  obtenerFotosDeUsuario: async (
    idUsuario: number,
    pagina = 0,
    tamaño = 10,
    idUsuarioAuth?: number
  ): Promise<ApiResponse<PageResponse<Photo>>> => {
    try {
      const respuesta = await api.get<ApiResponse<PageResponse<Photo>>>(`/fotografias/user/${idUsuario}`, {
        params: { page: pagina, size: tamaño, ...(idUsuarioAuth ? { idUsuarioAuth } : {}) },
      });
      return respuesta.data;
    } catch (error) {
      return {
        success: false,
        message: 'No se pudieron obtener las fotos del usuario.',
      };
    }
  },

  obtenerFoto: async (id: number, idUsuario?: number): Promise<any> => {
    try {
      const respuesta = await api.get(`/fotografias/${id}`, {
        params: idUsuario ? { idUsuario } : {},
      });
      if (respuesta.data && respuesta.data.idFoto) {
        return respuesta.data;
      }
      if (respuesta.data && respuesta.data.data) {
        return respuesta.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  subirFoto: async (datosFoto: PhotoCreateRequest & { idUsuario: number }): Promise<ApiResponse<Photo>> => {
    try {
      const formData = new FormData();
      formData.append('descripcion', datosFoto.description);
      formData.append('imageFile', datosFoto.imageFile);
      formData.append('nombreUsuario', datosFoto.nombreUsuario.toString());

      const respuesta = await api.post<ApiResponse<Photo>>('/fotografias/upload', formData, {
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

darLikeAFoto: async (idFoto: number, idUsuario: number) => {
  const res = await api.post(`/fotografias/${idFoto}/like`, { idUsuario });
  return { success: res.data.success, likesCount: res.data.likesCount };
},
quitarLikeAFoto: async (idFoto: number, idUsuario: number) => {
  const res = await api.delete(`/fotografias/${idFoto}/like`, { data: { idUsuario } });
  return { success: res.data.success, likesCount: res.data.likesCount };
},

  // === COMENTARIOS ===
  obtenerComentarios: async (idFoto: number) => {
    try {
      const res = await api.get(`/comentarios/foto/${idFoto}`);
      return {
        success: res.data.success,
        data: res.data.data
      };
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  subirComentario: async (idFoto: number, contenido: string, idUsuario: number) => {
    try {
      const res = await api.post("/comentarios", {
        idFoto,
        idUsuario,
        contenido,
      });
      return {
        success: res.data.success,
        data: res.data.data
      };
    } catch (error) {
      return { success: false };
    }
  },
};