import { apiClient } from './client';
import { User } from '@/lib/types/auth';
import { ApiResponse } from '@/lib/types/api';

export interface UpdateUserData {
  name?: string;
  email?: string;
  tel?: string;
  password?: string;
}

export const usersApi = {
  updateProfile: (data: UpdateUserData): Promise<ApiResponse<User>> => {
    return apiClient.put('/auth/me', data);
  },
};
