'use client';

import React, { useState, useEffect } from 'react';
import { Event, CreateEventData } from '@/lib/types/event';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validation } from '@/lib/utils/validation';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: CreateEventData) => Promise<void>;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateEventData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    eventDate: initialData ? new Date(initialData.eventDate).toISOString().split('T')[0] : '',
    venue: initialData?.venue || '',
    organizer: initialData?.organizer || '',
    availableTicket: initialData?.availableTicket || 0,
    posterPicture: initialData?.posterPicture || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEventData, string>>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateEventData, string>> = {};

    if (!validation.required(formData.name)) {
      newErrors.name = 'Event name is required';
    } else if (!validation.minLength(formData.name, 3)) {
      newErrors.name = 'Event name must be at least 3 characters';
    }

    if (!validation.required(formData.eventDate)) {
      newErrors.eventDate = 'Event date is required';
    } else if (!validation.dateNotPast(formData.eventDate)) {
      newErrors.eventDate = 'Event date cannot be in the past';
    }

    if (!validation.required(formData.venue)) {
      newErrors.venue = 'Venue is required';
    }

    if (!validation.required(formData.organizer)) {
      newErrors.organizer = 'Organizer is required';
    }

    if (!validation.required(formData.availableTicket)) {
      newErrors.availableTicket = 'Available tickets is required';
    } else if (!validation.min(formData.availableTicket, 1)) {
      newErrors.availableTicket = 'Available tickets must be at least 1';
    }

    if (formData.posterPicture && !validation.url(formData.posterPicture)) {
      newErrors.posterPicture = 'Poster picture must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Event Name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        error={errors.name}
        required
        placeholder="Enter event name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter event description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <Input
        label="Event Date"
        type="date"
        value={formData.eventDate}
        onChange={(value) => setFormData({ ...formData, eventDate: value })}
        error={errors.eventDate}
        required
        min={today}
      />

      <Input
        label="Venue"
        value={formData.venue}
        onChange={(value) => setFormData({ ...formData, venue: value })}
        error={errors.venue}
        required
        placeholder="Enter venue"
      />

      <Input
        label="Organizer"
        value={formData.organizer}
        onChange={(value) => setFormData({ ...formData, organizer: value })}
        error={errors.organizer}
        required
        placeholder="Enter organizer name"
      />

      <Input
        label="Available Tickets"
        type="number"
        value={formData.availableTicket.toString()}
        onChange={(value) => setFormData({ ...formData, availableTicket: parseInt(value) || 0 })}
        error={errors.availableTicket}
        required
        min={1}
      />

      <Input
        label="Poster Picture URL (Optional)"
        type="url"
        value={formData.posterPicture || ''}
        onChange={(value) => setFormData({ ...formData, posterPicture: value })}
        error={errors.posterPicture}
        placeholder="https://example.com/poster.jpg"
      />

      <div className="flex space-x-4 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {initialData ? 'Update Event' : 'Create Event'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

