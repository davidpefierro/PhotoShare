import api from './api';

export const commentService = {
  getPhotoComments: async (photoId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/photos/${photoId}/comments`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch comments.',
      };
    }
  },

  addComment: async (commentData) => {
    try {
      const response = await api.post(`/photos/${commentData.photoId}/comments`, {
        content: commentData.content,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add comment.',
      };
    }
  },

  deleteComment: async (photoId, commentId) => {
    try {
      const response = await api.delete(`/photos/${photoId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete comment.',
      };
    }
  },
};