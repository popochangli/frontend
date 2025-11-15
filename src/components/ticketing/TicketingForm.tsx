'use client';

import React, { useState } from 'react';
import { TicketingRequest } from '@/lib/types/ticketing';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validation } from '@/lib/utils/validation';

interface TicketingFormProps {
  initialData: TicketingRequest;
  onSubmit: (ticketAmount: number) => Promise<void>;
  onCancel: () => void;
}

export const TicketingForm: React.FC<TicketingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [ticketAmount, setTicketAmount] = useState(initialData.ticketAmount.toString());
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseInt(ticketAmount);
    if (!validation.required(ticketAmount)) {
      setError('Ticket amount is required');
      return;
    }
    if (!validation.min(amount, 1)) {
      setError('Ticket amount must be at least 1');
      return;
    }
    if (!validation.max(amount, 5)) {
      setError('Ticket amount cannot exceed 5');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const event = typeof initialData.event === 'object' ? initialData.event : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {event && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Event Information</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Event:</span> {event.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Available Tickets:</span> {event.availableTicket}
          </p>
        </div>
      )}

      <Input
        label="Ticket Amount"
        type="number"
        value={ticketAmount}
        onChange={setTicketAmount}
        error={error}
        required
        min={1}
        max={5}
        placeholder="Enter number of tickets (1-5)"
      />

      <div className="flex space-x-4 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          Update Ticket
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

