'use client';

import React, { useEffect, useState } from 'react';
import { ticketingApi } from '@/lib/api/ticketing';
import { TicketingRequest } from '@/lib/types/ticketing';
import { Event } from '@/lib/types/event';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTicket, setEditTicket] = useState<TicketingRequest | null>(null);
  const [editAmount, setEditAmount] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketingApi.getAll();
      if (response.success && response.data) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ticket: TicketingRequest) => {
    setEditTicket(ticket);
    setEditAmount(ticket.ticketAmount);
    setIsEditModalOpen(true);
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTicket) return;

    setUpdateLoading(true);
    try {
      const response = await ticketingApi.update(editTicket._id, editAmount);
      if (response.success) {
        setIsEditModalOpen(false);
        fetchTickets(); // Refresh list
      } else {
        alert(response.error || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('An error occurred while updating the ticket');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await ticketingApi.delete(id);
      if (response.success) {
        fetchTickets(); // Refresh list
      } else {
        alert(response.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('An error occurred while cancelling the booking');
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">You haven't booked any events yet.</p>
            <Link href="/member/events">
              <Button>Browse Events</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const event = ticket.event as Event;
              return (
                <div key={ticket._id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                  <div className="p-6 md:flex md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h3>
                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">Date:</span> {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">Venue:</span> {event.venue}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Tickets:</span> {ticket.ticketAmount}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(ticket)}
                      >
                        <Edit size={14} className="mr-1" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket._id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Update Ticket Amount"
        >
          <form onSubmit={handleUpdateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tickets (Max 5)
              </label>
              <Input
                type="number"
                min={1}
                max={5}
                value={editAmount.toString()}
                onChange={(val) => setEditAmount(parseInt(val) || 0)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can book up to 5 tickets per event.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={updateLoading}>
                Update
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
