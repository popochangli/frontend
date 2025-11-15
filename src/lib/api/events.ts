import { apiClient } from './client';
import { Event, CreateEventData, UpdateEventData } from '@/lib/types/event';
import { ApiResponse } from '@/lib/types/api';

export const eventsApi = {
  getAll: (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get('/events');
  },

  getById: (id: string): Promise<ApiResponse<Event>> => {
    return apiClient.get(`/events/${id}`);
  },

  create: (data: CreateEventData): Promise<ApiResponse<Event>> => {
    return apiClient.post('/events', data);
  },

  update: (id: string, data: UpdateEventData): Promise<ApiResponse<Event>> => {
    return apiClient.put(`/events/${id}`, data);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/events/${id}`);
  },
};

