'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { eventsApi } from '@/lib/api/events';
import { EventForm } from '@/components/events/EventForm';
import { CreateEventData } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateEventData) => {
    try {
      const response = await eventsApi.create(data);
      if (response.success) {
        router.push('/admin/events');
      } else {
        alert(response.error || response.message || 'Failed to create event');
      }
    } catch (error) {
      alert('Failed to create event');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>
      <Card>
        <EventForm onSubmit={handleSubmit} onCancel={() => router.push('/admin/events')} />
      </Card>
    </div>
  );
}

