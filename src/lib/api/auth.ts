import { apiClient } from './client';
import { User, RegisterData, LoginData } from '@/lib/types/auth';
import { ApiResponse } from '@/lib/types/api';

export const authApi = {
  register: (data: RegisterData): Promise<ApiResponse<{ _id: string; name: string; email: string; token: string }>> => {
    return apiClient.post('/auth/register', data);
  },

  login: (email: string, password: string): Promise<ApiResponse<{ _id: string; name: string; email: string; token: string }>> => {
    return apiClient.post('/auth/login', { email, password });
  },

  logout: (): Promise<ApiResponse<void>> => {
    return apiClient.get('/auth/logout');
  },

  getMe: (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },
};

