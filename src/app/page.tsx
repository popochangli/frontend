import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Calendar, Ticket, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            EventTicketer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop solution for event management and ticketing
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/events">
              <Button size="lg">
                Browse Events
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="lg">
                Register
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Calendar className="text-primary-600 mb-4" size={48} />
            <h2 className="text-2xl font-semibold mb-2">Event Management</h2>
            <p className="text-gray-600">
              Create, manage, and organize events with ease. Full control over
              event details, dates, and ticket availability.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Ticket className="text-primary-600 mb-4" size={48} />
            <h2 className="text-2xl font-semibold mb-2">Ticketing System</h2>
            <p className="text-gray-600">
              Efficient ticket reservation management. View and manage all
              ticketing requests in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

