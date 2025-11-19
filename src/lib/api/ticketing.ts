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

  create: (data: { event: string; ticketAmount: number }): Promise<ApiResponse<TicketingRequest>> => {
    return apiClient.post('/ticketing', data);
  },

  update: (id: string, ticketAmount: number): Promise<ApiResponse<TicketingRequest>> => {
    return apiClient.put(`/ticketing/${id}`, { ticketAmount });
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/ticketing/${id}`);
  },

  redeem: (id: string): Promise<ApiResponse<TicketingRequest>> => {
    return apiClient.post(`/ticketing/${id}/redeem`, {});
  },
};

