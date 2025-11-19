import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ticketingApi } from '@/lib/api/ticketing';
import type { Event } from '@/lib/types/event';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    event,
    onSuccess,
}) => {
    const [ticketAmount, setTicketAmount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!event) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (ticketAmount < 1 || ticketAmount > 5) {
            setError('Please select between 1 and 5 tickets');
            return;
        }

        setLoading(true);

        try {
            const response = await ticketingApi.create({
                event: event._id,
                ticketAmount,
            });

            if (response.success) {
                onSuccess();
                onClose();
                setTicketAmount(1);
            } else {
                setError(response.error || response.message || 'Failed to book tickets');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book Tickets: ${event.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Tickets (Max 5)
                    </label>
                    <Input
                        type="number"
                        min={1}
                        max={5}
                        value={ticketAmount.toString()}
                        onChange={(val) => {
                            const num = parseInt(val);
                            if (!isNaN(num)) {
                                setTicketAmount(num);
                            } else if (val === '') {
                                setTicketAmount(0);
                            }
                        }}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        You can book up to 5 tickets per event.
                    </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Confirm Booking
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
