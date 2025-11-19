'use client';

import React, { useState, useRef } from 'react';
import { ticketingApi } from '@/lib/api/ticketing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TicketingRequest } from '@/lib/types/ticketing';
import { Event } from '@/lib/types/event';
import jsQR from 'jsqr';
import { Upload } from 'lucide-react';

export default function TicketVerificationPage() {
    const [ticketId, setTicketId] = useState('');
    const [ticket, setTicket] = useState<TicketingRequest | null>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setMessage('');

        try {
            const image = new Image();
            const reader = new FileReader();

            reader.onload = (event) => {
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        setMessage('Failed to process image');
                        setLoading(false);
                        return;
                    }

                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        try {
                            const qrData = JSON.parse(code.data);
                            const extractedTicketId = qrData.id;

                            if (extractedTicketId) {
                                setTicketId(extractedTicketId);
                                verifyTicketById(extractedTicketId);
                            } else {
                                setMessage('Invalid QR code format');
                                setLoading(false);
                            }
                        } catch (error) {
                            setMessage('Failed to parse QR code data');
                            setLoading(false);
                        }
                    } else {
                        setMessage('No QR code found in image');
                        setLoading(false);
                    }
                };

                image.src = event.target?.result as string;
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setMessage('Failed to read image file');
            setLoading(false);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const verifyTicketById = async (id: string) => {
        try {
            const response = await ticketingApi.getById(id);

            if (response.success && response.data) {
                setTicket(response.data);
                setMessage('');
            } else {
                setMessage(response.error || 'Ticket not found');
                setTicket(null);
            }
        } catch (error: any) {
            setMessage(error.message || 'Failed to verify ticket');
            setTicket(null);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketId.trim()) return;

        setLoading(true);
        setMessage('');
        await verifyTicketById(ticketId.trim());
    };

    const handleConfirmRedeem = async () => {
        if (!ticket) return;

        setLoading(true);
        try {
            const response = await ticketingApi.redeem(ticket._id);

            if (response.success) {
                setMessage('Ticket redeemed successfully!');
                setTicket(null);
                setTicketId('');
            } else {
                setMessage(response.error || response.message || 'Failed to redeem ticket');
            }
        } catch (error: any) {
            setMessage(error.message || 'Error redeeming ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setTicket(null);
        setTicketId('');
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Ticket Verification</h1>

                {!ticket && !message && (
                    <div className="space-y-6">
                        {/* Upload QR Code Image */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code from Image</h2>
                            <p className="text-gray-600 mb-4">Upload a photo of the member's QR code</p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="qr-upload"
                            />

                            <label htmlFor="qr-upload">
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                    size="lg"
                                    disabled={loading}
                                >
                                    <Upload size={20} className="mr-2" />
                                    {loading ? 'Processing...' : 'Upload QR Code Image'}
                                </Button>
                            </label>
                        </div>

                        {/* Manual Input */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Or Enter Ticket ID Manually</h2>
                            <form onSubmit={handleVerifyTicket} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ticket ID
                                    </label>
                                    <Input
                                        type="text"
                                        value={ticketId}
                                        onChange={setTicketId}
                                        placeholder="Enter ticket ID (e.g., 673c6d4609b5d...)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        You can find the ticket ID below the QR code
                                    </p>
                                </div>
                                <Button type="submit" loading={loading} className="w-full" size="lg">
                                    Verify Ticket
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {ticket && (
                    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                        <div className="border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {(ticket.event as Event).name}
                            </h2>
                            <p className="text-gray-600">
                                <span className="font-medium">Date:</span>{' '}
                                {new Date((ticket.event as Event).eventDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Venue:</span> {(ticket.event as Event).venue}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Tickets:</span> {ticket.ticketAmount}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">User:</span> {(ticket.user as any)?.name || 'Member'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Ticket ID:</span>
                                <span className="font-mono text-xs ml-2">{ticket._id}</span>
                            </p>
                        </div>

                        {ticket.isUsed ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 font-bold text-center">
                                    ⚠️ This ticket has already been used
                                </p>
                                <Button
                                    onClick={handleReset}
                                    variant="secondary"
                                    className="w-full mt-4"
                                >
                                    Verify Another Ticket
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 font-bold text-center mb-4">
                                    ✓ Valid Ticket - Ready to Redeem
                                </p>
                                <div className="flex space-x-3">
                                    <Button
                                        onClick={handleConfirmRedeem}
                                        loading={loading}
                                        className="flex-1"
                                    >
                                        Confirm & Redeem
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {message && (
                    <div className={`mt-4 p-4 rounded-lg ${message.includes('successfully')
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <p className="font-medium text-center">{message}</p>
                        <Button
                            onClick={handleReset}
                            variant="secondary"
                            className="w-full mt-4"
                        >
                            {message.includes('successfully') ? 'Verify Another Ticket' : 'Try Again'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
