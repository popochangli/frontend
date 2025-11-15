'use client';

import React, { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api/events';
import { ticketingApi } from '@/lib/api/ticketing';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Calendar, Ticket, Users, TrendingUp } from 'lucide-react';
import { Event } from '@/lib/types/event';
import { TicketingRequest } from '@/lib/types/ticketing';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketings, setTicketings] = useState<TicketingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, ticketingResponse] = await Promise.all([
          eventsApi.getAll(),
          ticketingApi.getAll(),
        ]);

        if (eventsResponse.success && eventsResponse.data) {
          setEvents(eventsResponse.data);
        }
        if (ticketingResponse.success && ticketingResponse.data) {
          setTicketings(ticketingResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTickets = ticketings.reduce((sum, t) => sum + t.ticketAmount, 0);
  const upcomingEvents = events.filter(
    (e) => new Date(e.eventDate) >= new Date()
  ).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Events"
          value={events.length}
          icon={Calendar}
          loading={loading}
        />
        <MetricCard
          title="Total Tickets"
          value={totalTickets}
          icon={Ticket}
          loading={loading}
        />
        <MetricCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={TrendingUp}
          loading={loading}
        />
        <MetricCard
          title="Ticketing Requests"
          value={ticketings.length}
          icon={Users}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Events</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-gray-500">No events yet</div>
          ) : (
            <ul className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <li key={event._id} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{event.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Ticket Requests</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : ticketings.length === 0 ? (
            <div className="text-gray-500">No ticket requests yet</div>
          ) : (
            <ul className="space-y-2">
              {ticketings.slice(0, 5).map((ticketing) => {
                const event = typeof ticketing.event === 'object' ? ticketing.event : null;
                return (
                  <li key={ticketing._id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <span className="font-medium">{event?.name || 'Unknown Event'}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({ticketing.ticketAmount} tickets)
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(ticketing.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

