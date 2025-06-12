import { create } from 'zustand';
import { Photo, PageResponse } from '../types';
import { photoService } from '../services/photoService';

interface PhotoState {
  photos: Photo[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  error: string | null;
  
  // Actions
  fetchPhotos: (refresh?: boolean) => Promise<void>;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: number, updatedPhoto: Partial<Photo>) => void;
  removePhoto: (id: number) => void;
  toggleLike: (id: number) => Promise<void>;
}

export const usePhotoStore = create<PhotoState>()((set, get) => ({
  photos: [],
  loading: false,
  hasMore: true,
  currentPage: 0,
  error: null,
  
 fetchPhotos: async (refresh = false) => {
  try {
    set({ loading: true, error: null });
    const page = refresh ? 0 : get().currentPage;
    const response = await photoService.obtenerFotos(page);

    if (response.success && response.data && Array.isArray(response.data.content)) {
      const pageData = response.data;
      set((state) => {
        // Mezclar y ordenar por fecha descendente
        const allPhotos = refresh
          ? pageData.content
          : [...state.photos, ...pageData.content];
        allPhotos.sort(
          (a, b) =>
            new Date(b.fechaPublicacion).valueOf() -
            new Date(a.fechaPublicacion).valueOf()
        );
        return {
          photos: allPhotos,
          hasMore: !pageData.last,
          currentPage: refresh ? 1 : state.currentPage + 1,
          loading: false,
        };
      });
    } else {
      set({ error: response.message || 'No se pudieron obtener las fotos.', loading: false });
    }
  } catch (error) {
    set({ error: 'Failed to fetch photos', loading: false });
  }
},
  
  addPhoto: (photo) => {
    set((state) => ({
      photos: [photo, ...state.photos],
    }));
  },
  
  updatePhoto: (id, updatedPhoto) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, ...updatedPhoto } : photo
      ),
    }));
  },
  
removePhoto: (id) => {
  set((state) => ({
    photos: state.photos.filter(f => f.idFoto !== id)
  }));
},
  
 toggleLike: async (id) => {
  const photo = get().photos.find((p) => p.id === id);
  if (!photo) return;

  // Optimistic update
  set((state) => ({
    photos: state.photos.map((p) =>
      p.id === id
        ? {
            ...p,
            userLiked: !p.userLiked,
            likesCount: p.userLiked ? p.likesCount - 1 : p.likesCount + 1,
          }
        : p
    ),
  }));

  try {
    const response = photo.userLiked
      ? await photoService.unlikePhoto(id)
      : await photoService.likePhoto(id);

    if (response.success && response.data) {
      // Si el backend devuelve la foto actualizada, úsala
      set((state) => ({
        photos: state.photos.map((p) =>
          p.id === id
            ? { ...p, ...response.data }
            : p
        ),
      }));
    } else if (!response.success) {
      // Revert on failure
      set((state) => ({
        photos: state.photos.map((p) =>
          p.id === id
            ? {
                ...p,
                userLiked: !p.userLiked,
                likesCount: p.userLiked ? p.likesCount - 1 : p.likesCount + 1,
              }
            : p
        ),
      }));
    }
  } catch (error) {
    // Revert on error
    set((state) => ({
      photos: state.photos.map((p) =>
        p.id === id
          ? {
              ...p,
              userLiked: !p.userLiked,
              likesCount: p.userLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      ),
    }));
  }
},
}));