'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatters } from '@/lib/utils/formatters';
import { Calendar, MapPin, User, Ticket, ArrowLeft } from 'lucide-react';

export default function PublicEventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        const response = await eventsApi.getById(params.id);
        if (response.success && response.data) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link href="/events" className="text-primary-600 hover:text-primary-700">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>

        <Card>
          {event.posterPicture && (
            <div className="relative w-full h-96 bg-gray-200 rounded-t-lg overflow-hidden mb-6">
              <Image
                src={event.posterPicture}
                alt={event.name}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>

            {event.description && (
              <p className="text-gray-700 text-lg mb-6">{event.description}</p>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3 text-primary-600" />
                <span className="font-medium">Date: </span>
                <span className="ml-2">{formatters.formatDate(event.eventDate)}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin size={20} className="mr-3 text-primary-600" />
                <span className="font-medium">Venue: </span>
                <span className="ml-2">{event.venue}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <User size={20} className="mr-3 text-primary-600" />
                <span className="font-medium">Organizer: </span>
                <span className="ml-2">{event.organizer}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Ticket size={20} className="mr-3 text-primary-600" />
                <span className="font-medium">Available Tickets: </span>
                <span className="ml-2 text-primary-600 font-semibold text-xl">
                  {event.availableTicket}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

