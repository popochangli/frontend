import React from 'react';
import { Event } from '@/lib/types/event';
import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { formatters } from '@/lib/utils/formatters';
import { Edit, Trash2 } from 'lucide-react';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  loading?: boolean;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns: Column<Event>[] = [
    {
      key: 'name',
      label: 'Event Name',
      render: (event) => (
        <div>
          <div className="font-medium text-gray-900">{event.name}</div>
          {event.description && (
            <div className="text-sm text-gray-500 line-clamp-1">{event.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'eventDate',
      label: 'Date',
      render: (event) => formatters.formatDate(event.eventDate),
    },
    {
      key: 'venue',
      label: 'Venue',
    },
    {
      key: 'organizer',
      label: 'Organizer',
    },
    {
      key: 'availableTicket',
      label: 'Available Tickets',
      render: (event) => (
        <span className="font-semibold text-primary-600">{event.availableTicket}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (event) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={events} loading={loading} />;
};

