export interface Event {
  _id: string;
  name: string;
  description?: string;
  eventDate: string; // ISO date string
  venue: string;
  organizer: string;
  availableTicket: number;
  posterPicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  name: string;
  description?: string;
  eventDate: string;
  venue: string;
  organizer: string;
  availableTicket: number;
  posterPicture?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

