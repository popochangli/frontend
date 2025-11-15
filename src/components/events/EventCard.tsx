import React from 'react';
import Image from 'next/image';
import { Event } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatters } from '@/lib/utils/formatters';
import { Edit, Trash2, Calendar, MapPin, User } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  showActions?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {event.posterPicture && (
        <div className="relative w-full h-48 bg-gray-200">
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
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            {formatters.formatDate(event.eventDate)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            {event.venue}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-2" />
            {event.organizer}
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-900">Available Tickets: </span>
            <span className="text-primary-600 font-semibold">{event.availableTicket}</span>
          </div>
        </div>
        {showActions && (onEdit || onDelete) && (
          <div className="flex space-x-2 pt-4 border-t">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(event)}
                className="flex-1"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(event)}
                className="flex-1"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

