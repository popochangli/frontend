'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b">
              <div className="bg-primary-100 p-4 rounded-full">
                <User size={40} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 capitalize text-lg">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <User size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg text-gray-900">{user.tel}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                className="w-full flex items-center justify-center"
                size="lg"
                onClick={() => router.push('/member/settings')}
              >
                <Edit size={20} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
