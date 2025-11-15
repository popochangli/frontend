'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/types/event';
import { EventTable } from '@/components/events/EventTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getAll();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    router.push(`/admin/events/${event._id}/edit`);
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      const response = await eventsApi.delete(eventToDelete._id);
      if (response.success) {
        setEvents(events.filter((e) => e._id !== eventToDelete._id));
        setDeleteModalOpen(false);
        setEventToDelete(null);
      } else {
        alert(response.error || response.message || 'Failed to delete event');
      }
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
        <Button onClick={() => router.push('/admin/events/create')}>
          <Plus size={20} className="mr-2" />
          Create Event
        </Button>
      </div>

      <EventTable
        events={events}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        title="Delete Event"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the event{' '}
            <strong>{eventToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setEventToDelete(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

