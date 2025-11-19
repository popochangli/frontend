'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  onMenuToggle?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/profile');
    } else {
      router.push('/member/profile');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden mr-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <User size={20} />
            <span className="hidden sm:inline font-medium">{user?.name || 'User'}</span>
            <span className="hidden sm:inline text-sm text-gray-500">
              ({user?.role || 'member'})
            </span>
          </button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

