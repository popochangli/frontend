import React from 'react';
import { TicketingRequest } from '@/lib/types/ticketing';
import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { formatters } from '@/lib/utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TicketingTableProps {
  ticketings: TicketingRequest[];
  onEdit: (ticketing: TicketingRequest) => void;
  onDelete: (ticketing: TicketingRequest) => void;
  loading?: boolean;
}

export const TicketingTable: React.FC<TicketingTableProps> = ({
  ticketings,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const columns: Column<TicketingRequest>[] = [
    ...(isAdmin
      ? [
          {
            key: 'user',
            label: 'User',
            render: (ticketing) => {
              const user = typeof ticketing.user === 'object' ? ticketing.user : null;
              return user ? (
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              ) : (
                <span className="text-gray-400">-</span>
              );
            },
          },
        ]
      : []),
    {
      key: 'event',
      label: 'Event',
      render: (ticketing) => {
        const event = typeof ticketing.event === 'object' ? ticketing.event : null;
        return event ? (
          <div>
            <div className="font-medium text-gray-900">{event.name}</div>
            <div className="text-sm text-gray-500">{formatters.formatDate(event.eventDate)}</div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      key: 'ticketAmount',
      label: 'Ticket Amount',
      render: (ticketing) => (
        <span className="font-semibold text-primary-600">{ticketing.ticketAmount}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (ticketing) => formatters.formatDateTime(ticketing.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (ticketing) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ticketing);
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
              onDelete(ticketing);
            }}
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={ticketings} loading={loading} />;
};

