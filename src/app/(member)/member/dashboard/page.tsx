'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ticketingApi } from '@/lib/api/ticketing';
import { TicketingRequest } from '@/lib/types/ticketing';
import { Event } from '@/lib/types/event';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Ticket, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [recentTickets, setRecentTickets] = useState<TicketingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await ticketingApi.getAll();
        if (response.success && response.data) {
          // Sort by created date desc and take top 5
          const sorted = [...response.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentTickets(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalTickets = recentTickets.reduce((sum, t) => sum + t.ticketAmount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your ticketing activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="My Bookings"
          value={recentTickets.length}
          icon={Ticket}
          loading={loading}
        />
        <MetricCard
          title="Total Tickets"
          value={totalTickets}
          icon={Calendar}
          loading={loading}
        />
        <MetricCard
          title="Recent Activity"
          value={recentTickets.length > 0 ? 'Active' : 'None'}
          icon={Clock}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/member/my-tickets">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings yet.</p>
              <Link href="/member/events" className="mt-4 inline-block">
                <Button size="sm">Browse Events</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentTickets.map((ticket) => {
                const event = ticket.event as Event;
                return (
                  <li key={ticket._id} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{event.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.eventDate).toLocaleDateString()} • {ticket.ticketAmount} tickets
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/member/events" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Browse Events</h3>
                  <p className="text-sm text-gray-500">Find and book tickets for upcoming events</p>
                </div>
              </div>
            </Link>

            <Link href="/member/my-tickets" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Ticket className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Tickets</h3>
                  <p className="text-sm text-gray-500">View and manage your existing bookings</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
