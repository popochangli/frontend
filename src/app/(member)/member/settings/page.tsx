'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/lib/api/users';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    tel: user?.tel || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.tel.trim()) {
      newErrors.tel = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.tel)) {
      newErrors.tel = 'Phone number must be 10 digits';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage('');

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await usersApi.updateProfile(updateData);

      if (response.success) {
        setMessage('Profile updated successfully!');
        setFormData({ ...formData, password: '', confirmPassword: '' });
        await checkAuth();
      } else {
        setMessage(response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b">
              <div className="bg-primary-100 p-4 rounded-full">
                <User size={32} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  error={errors.name}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  error={errors.email}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.tel}
                  onChange={(value) => setFormData({ ...formData, tel: value })}
                  error={errors.tel}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Leave blank if you don't want to change your password
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock size={16} className="inline mr-2" />
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(value) => setFormData({ ...formData, password: value })}
                      error={errors.password}
                      placeholder="Enter new password (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock size={16} className="inline mr-2" />
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                      error={errors.confirmPassword}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <p className="font-medium">{message}</p>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" loading={loading} className="flex-1">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/member/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
