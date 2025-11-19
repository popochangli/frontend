'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Ticket, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  memberOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, adminOnly: true },
  { label: 'Events', href: '/admin/events', icon: Calendar, adminOnly: true },
  { label: 'Ticketing', href: '/admin/ticketing', icon: Ticket, adminOnly: true },
  { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard, memberOnly: true },
  { label: 'Browse Events', href: '/member/events', icon: Calendar, memberOnly: true },
  { label: 'My Tickets', href: '/member/my-tickets', icon: Ticket, memberOnly: true },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (user?.role === 'admin') return item.adminOnly;
    if (user?.role === 'member') return item.memberOnly;
    return false;
  });

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 glass-dark text-white transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 border-r border-gray-800`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Ticket size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">EventTicketer</h1>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Member Panel'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 overflow-y-auto">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${active
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                        }`}
                    >
                      <Icon
                        size={20}
                        className={`mr-3 transition-colors ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'
                          }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-6 border-t border-gray-800/50">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-800/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
