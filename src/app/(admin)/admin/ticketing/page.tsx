'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ticketingApi } from '@/lib/api/ticketing';
import { TicketingRequest } from '@/lib/types/ticketing';
import { TicketingTable } from '@/components/ticketing/TicketingTable';
import { Modal } from '@/components/ui/Modal';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TicketingPage() {
  const [ticketings, setTicketings] = useState<TicketingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketingToDelete, setTicketingToDelete] = useState<TicketingRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTicketings();
  }, []);

  const fetchTicketings = async () => {
    setLoading(true);
    try {
      const response = await ticketingApi.getAll();
      if (response.success && response.data) {
        setTicketings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch ticketings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticketing: TicketingRequest) => {
    router.push(`/admin/ticketing/${ticketing._id}/edit`);
  };

  const handleDeleteClick = (ticketing: TicketingRequest) => {
    setTicketingToDelete(ticketing);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketingToDelete) return;

    try {
      const response = await ticketingApi.delete(ticketingToDelete._id);
      if (response.success) {
        setTicketings(ticketings.filter((t) => t._id !== ticketingToDelete._id));
        setDeleteModalOpen(false);
        setTicketingToDelete(null);
      } else {
        alert(response.error || response.message || 'Failed to delete ticketing request');
      }
    } catch (error) {
      alert('Failed to delete ticketing request');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ticketing Requests</h1>

      <TicketingTable
        ticketings={ticketings}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTicketingToDelete(null);
        }}
        title="Delete Ticketing Request"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this ticketing request? This action cannot be undone.
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
                setTicketingToDelete(null);
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

