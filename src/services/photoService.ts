import api from './api';
import { Photo, PhotoCreateRequest, PageResponse, ApiResponse } from '../types';

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
            userLiked: foto.userLiked,     // este campo lo pone el backend según el usuario autenticado
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

userLiked: async (idFoto: number, idUsuario: number): Promise<boolean> => {
  try {
    const res = await api.get(`/fotografias/${idFoto}/liked`, {
      params: { idUsuario },
    });
    // Admite true, "true" o incluso { liked: true }
    if (typeof res.data === 'boolean') return res.data;
    if (typeof res.data === 'string') return res.data === "true";
    if (typeof res.data === 'object' && res.data.liked !== undefined) return !!res.data.liked;
    return false;
  } catch (e) {
    return false;
  }
},
eliminarComentario: async (idComentario: number, nombreUsuario: string) => {
  try {
    const response = await api.delete(`/comentarios/${idComentario}?nombreUsuario=${encodeURIComponent(nombreUsuario)}`);
    return { success: response.status === 200 || response.status === 204 };
  } catch (error) {
    return { success: false, error };
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

  darLikeAFoto: async (idFoto, idUsuario) => {
    const res = await api.post(`/fotografias/${idFoto}/like`, { idUsuario });
    return { success: res.data.success, likesCount: res.data.likesCount };
  },
  quitarLikeAFoto: async (idFoto, idUsuario) => {
    const res = await api.delete(`/fotografias/${idFoto}/like`, { params: { idUsuario } });
    return { success: res.data.success, likesCount: res.data.likesCount };
  },

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
reportarFoto: async ({ idReportador, idDenunciado, motivo, idFoto }) => {
  try {
    const res = await api.post('/reportes', {
      idReportador,
      idDenunciado,
      motivo,
      tipoContenido: 'Foto',
      idFoto,
    });
    return res.data;
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error desconocido' };
  }
},
};