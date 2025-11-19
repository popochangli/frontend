import { Event } from './event';
import { User } from './auth';

export interface TicketingRequest {
  _id: string;
  user: User | string;
  event: Event | string;
  ticketAmount: number;
  isUsed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketingData {
  event: string;
  ticketAmount: number;
}

export interface UpdateTicketingData {
  ticketAmount: number;
}

