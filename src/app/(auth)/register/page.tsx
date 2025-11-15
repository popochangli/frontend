'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validation } from '@/lib/utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    role: 'member' as 'admin' | 'member',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/member/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validation.required(formData.name) || !validation.minLength(formData.name, 2)) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!validation.email(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validation.required(formData.tel)) {
      setError('Telephone number is required');
      return;
    }

    if (!validation.required(formData.password) || !validation.minLength(formData.password, 6)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
        role: formData.role,
        password: formData.password,
      });
      // Redirect based on user role
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/member/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      
      // Check for specific error messages
      if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5004.');
      } else if (errorMessage.includes('HTTP 400')) {
        // Handle 400 Bad Request with more specific messages
        if (errorMessage.includes('email') || errorMessage.includes('duplicate') || errorMessage.includes('E11000')) {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (errorMessage.includes('validation')) {
          setError('Please check your input. All fields are required and email must be valid.');
        } else if (errorMessage.includes('password')) {
          setError('Password must be at least 6 characters long.');
        } else {
          setError('Invalid input. Please check all fields and try again.');
        }
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Telephone"
            type="tel"
            value={formData.tel}
            onChange={(value) => setFormData({ ...formData, tel: value })}
            required
            placeholder="Enter your telephone number"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-danger-600">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            required
            placeholder="Enter your password (min 6 characters)"
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
            required
            placeholder="Confirm your password"
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

