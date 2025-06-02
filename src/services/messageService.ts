import api from './api';
import { Message, MessageCreateRequest, PageResponse, ApiResponse } from '../types';

export const messageService = {
  getMessages: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<Message>>> => {
    try {
      const response = await api.get<ApiResponse<PageResponse<Message>>>('/messages', {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch messages.',
      };
    }
  },

  getConversation: async (userId: number, page = 0, size = 20): Promise<ApiResponse<PageResponse<Message>>> => {
    try {
      const response = await api.get<ApiResponse<PageResponse<Message>>>(`/messages/conversation/${userId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch conversation.',
      };
    }
  },

  sendMessage: async (messageData: MessageCreateRequest): Promise<ApiResponse<Message>> => {
    try {
      const response = await api.post<ApiResponse<Message>>('/messages', messageData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send message.',
      };
    }
  },

  deleteMessage: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/messages/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete message.',
      };
    }
  },

  markAsRead: async (id: number): Promise<ApiResponse<Message>> => {
    try {
      const response = await api.put<ApiResponse<Message>>(`/messages/${id}/read`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to mark message as read.',
      };
    }
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    try {
      const response = await api.get<ApiResponse<{ count: number }>>('/messages/unread/count');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get unread count.',
        data: { count: 0 },
      };
    }
  },
};