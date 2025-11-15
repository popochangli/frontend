import { apiClient } from './client';
import { TicketingRequest, UpdateTicketingData } from '@/lib/types/ticketing';
import { ApiResponse } from '@/lib/types/api';

export const ticketingApi = {
  getAll: (): Promise<ApiResponse<TicketingRequest[]>> => {
    return apiClient.get('/ticketing');
  },

  getById: (id: string): Promise<ApiResponse<TicketingRequest>> => {
    return apiClient.get(`/ticketing/${id}`);
  },

  update: (id: string, ticketAmount: number): Promise<ApiResponse<TicketingRequest>> => {
    return apiClient.put(`/ticketing/${id}`, { ticketAmount });
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/ticketing/${id}`);
  },
};

