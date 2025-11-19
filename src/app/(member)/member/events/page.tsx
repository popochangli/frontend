'use client';

import React, { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/types/event';
import { EventCard } from '@/components/events/EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { BookingModal } from '@/components/ticketing/BookingModal';
import { useRouter } from 'next/navigation';

export default function MemberEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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

  const handleBookClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    // Refresh events to update available tickets count if needed
    // or just redirect to my tickets
    router.push('/member/my-tickets');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        </div>

        {events.length === 0 ? (
          <EmptyState message="No events available at the moment." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="flex flex-col h-full">
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/member/events/${event._id}`)}
                >
                  <EventCard event={event} />
                </div>
                <div className="mt-2">
                  <Button
                    className="w-full"
                    onClick={() => handleBookClick(event)}
                    disabled={event.availableTicket <= 0}
                  >
                    {event.availableTicket > 0 ? 'Book Tickets' : 'Sold Out'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
}
