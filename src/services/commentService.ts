import api from './api';
import { Comment, CommentCreateRequest, PageResponse, ApiResponse } from '../types';

export const commentService = {
  getPhotoComments: async (photoId: number, page = 0, size = 10): Promise<ApiResponse<PageResponse<Comment>>> => {
    try {
      const response = await api.get<ApiResponse<PageResponse<Comment>>>(`/photos/${photoId}/comments`, {
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

  addComment: async (commentData: CommentCreateRequest): Promise<ApiResponse<Comment>> => {
    try {
      const response = await api.post<ApiResponse<Comment>>(`/photos/${commentData.photoId}/comments`, {
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

  deleteComment: async (photoId: number, commentId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/photos/${photoId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete comment.',
      };
    }
  },
};