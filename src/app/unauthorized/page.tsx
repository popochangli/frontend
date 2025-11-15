import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle size={64} className="mx-auto text-danger-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

