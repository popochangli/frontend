'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ticketingApi } from '@/lib/api/ticketing';
import { TicketingRequest } from '@/lib/types/ticketing';
import { TicketingForm } from '@/components/ticketing/TicketingForm';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EditTicketingPage() {
  const params = useParams();
  const router = useRouter();
  const [ticketing, setTicketing] = useState<TicketingRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketing = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        const response = await ticketingApi.getById(params.id);
        if (response.success && response.data) {
          setTicketing(response.data);
        } else {
          alert('Ticketing request not found');
          router.push('/admin/ticketing');
        }
      } catch (error) {
        alert('Failed to fetch ticketing request');
        router.push('/admin/ticketing');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketing();
  }, [params.id, router]);

  const handleSubmit = async (ticketAmount: number) => {
    if (!params.id || typeof params.id !== 'string') return;

    try {
      const response = await ticketingApi.update(params.id, ticketAmount);
      if (response.success) {
        router.push('/admin/ticketing');
      } else {
        alert(response.error || response.message || 'Failed to update ticketing request');
      }
    } catch (error) {
      alert('Failed to update ticketing request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!ticketing) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Ticketing Request</h1>
      <Card>
        <TicketingForm
          initialData={ticketing}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/ticketing')}
        />
      </Card>
    </div>
  );
}

