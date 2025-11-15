'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, RegisterData } from '@/lib/types/auth';
import { authApi } from '@/lib/api/auth';
import { storage } from '@/lib/utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = storage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authApi.getMe();
      if (response.success && response.data) {
        setUser(response.data);
        storage.setUser(response.data);
      } else {
        storage.clear();
        setUser(null);
      }
    } catch (error) {
      storage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    
    // Log response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Login API Response:', response);
    }
    
    if (response.success) {
      // Backend returns: { success: true, _id, name, email, token }
      // The data is directly in response, not in response.data
      const token = (response as any).token;
      const _id = (response as any)._id;
      const name = (response as any).name;
      const userEmail = (response as any).email;
      
      if (!token) {
        throw new Error('Login successful but no token received');
      }
      
      storage.setToken(token);
      
      // Fetch full user data to get role and other fields
      const meResponse = await authApi.getMe();
      if (meResponse.success && meResponse.data) {
        setUser(meResponse.data);
        storage.setUser(meResponse.data);
        return meResponse.data; // Return user data for role-based redirect
      } else {
        // Fallback to partial data
        const partialUser: User = {
          _id: _id || '',
          name: name || '',
          email: userEmail || '',
          tel: '',
          role: 'member',
          createdAt: new Date().toISOString(),
        };
        setUser(partialUser);
        storage.setUser(partialUser);
        return partialUser;
      }
    } else {
      throw new Error(response.error || response.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    
    // Log response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Register API Response:', response);
    }
    
    if (response.success) {
      // Backend returns: { success: true, _id, name, email, token }
      // The data is directly in response, not in response.data
      const token = (response as any).token;
      const _id = (response as any)._id;
      const name = (response as any).name;
      const email = (response as any).email;
      
      if (!token) {
        throw new Error('Registration successful but no token received');
      }
      
      storage.setToken(token);
      
      // Fetch full user data to get role and other fields
      const meResponse = await authApi.getMe();
      if (meResponse.success && meResponse.data) {
        setUser(meResponse.data);
        storage.setUser(meResponse.data);
        return meResponse.data; // Return user data for role-based redirect
      } else {
        // Fallback to partial data using the role from registration
        const partialUser: User = {
          _id: _id || '',
          name: name || '',
          email: email || '',
          tel: data.tel,
          role: data.role,
          createdAt: new Date().toISOString(),
        };
        setUser(partialUser);
        storage.setUser(partialUser);
        return partialUser;
      }
    } else {
      // Better error handling for common cases
      const errorMsg = response.error || response.message || 'Registration failed';
      
      // Check for common MongoDB errors
      if (errorMsg.includes('E11000') || errorMsg.includes('duplicate') || errorMsg.includes('already registered')) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      }
      if (errorMsg.includes('validation')) {
        throw new Error('Please check your input. All fields are required and email must be valid.');
      }
      if (errorMsg.includes('password')) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      // If error message is generic, provide more helpful message
      if (errorMsg === 'HTTP 400: Bad Request' || errorMsg === 'Registration failed') {
        throw new Error('Registration failed. This email may already be registered. Please try a different email or check the backend server logs for details.');
      }
      
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      storage.clear();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

