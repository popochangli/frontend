'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { eventsApi } from '@/lib/api/events';
import { Event, UpdateEventData } from '@/lib/types/event';
import { EventForm } from '@/components/events/EventForm';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        const response = await eventsApi.getById(params.id);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          alert('Event not found');
          router.push('/admin/events');
        }
      } catch (error) {
        alert('Failed to fetch event');
        router.push('/admin/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, router]);

  const handleSubmit = async (data: UpdateEventData) => {
    if (!params.id || typeof params.id !== 'string') return;

    try {
      const response = await eventsApi.update(params.id, data);
      if (response.success) {
        router.push('/admin/events');
      } else {
        alert(response.error || response.message || 'Failed to update event');
      }
    } catch (error) {
      alert('Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event</h1>
      <Card>
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/events')}
        />
      </Card>
    </div>
  );
}

