'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/types/event';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { BookingModal } from '@/components/ticketing/BookingModal';
import { Calendar, MapPin, User, Ticket, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function MemberEventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        const response = await eventsApi.getById(params.id);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          alert('Event not found');
          router.push('/member/events');
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
        router.push('/member/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, router]);

  const handleBookingSuccess = () => {
    router.push('/member/my-tickets');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/member/events')}
          className="mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.posterPicture && (
            <div className="relative w-full h-96">
              <Image
                src={event.posterPicture}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="mr-3 text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="mr-3 text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <User className="mr-3 text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Organizer</p>
                  <p className="font-medium">{event.organizer}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Ticket className="mr-3 text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Available Tickets</p>
                  <p className="font-medium">
                    {event.availableTicket > 0 ? event.availableTicket : 'Sold Out'}
                  </p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                disabled={event.availableTicket <= 0}
              >
                {event.availableTicket > 0 ? 'Book Tickets' : 'Sold Out'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/member/events')}
              >
                Browse More Events
              </Button>
            </div>
          </div>
        </div>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={event}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
}

