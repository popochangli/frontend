import { ApiResponse } from '@/lib/types/api';
import { storage } from '@/lib/utils/storage';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004/api/v1';
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const token = storage.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      // Check if response is ok before parsing JSON
      if (!response.ok && response.status !== 401) {
        let errorText;
        let errorData;
        try {
          errorText = await response.text();
          try {
            errorData = JSON.parse(errorText);
          } catch {
            // If response is not JSON, use status text
            errorData = {
              message: errorText || response.statusText || 'Request failed',
              error: errorText || response.statusText || 'Request failed'
            };
          }
        } catch (e) {
          errorData = {
            message: response.statusText || 'Request failed',
            error: response.statusText || 'Request failed'
          };
        }

        // Log error for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            errorText,
            fullResponse: errorText,
          });
        }

        // Handle different error formats
        // If backend only returns {success: false}, try to infer the error
        let errorMessage = errorData.message || errorData.error || errorData.msg;

        if (!errorMessage || errorMessage === 'HTTP 400: Bad Request') {
          // Backend didn't provide specific error, infer from common cases
          if (response.status === 400) {
            // Check if it's a duplicate email (MongoDB error code E11000)
            if (errorText && (errorText.includes('E11000') || errorText.includes('duplicate'))) {
              errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            } else if (errorText && errorText.includes('validation')) {
              errorMessage = 'Please check your input. All fields are required and email must be valid.';
            } else if (errorText && errorText.includes('password')) {
              errorMessage = 'Password must be at least 6 characters long.';
            } else {
              errorMessage = 'Invalid input. Please check all fields and try again. If this email was already registered, please use a different email or try logging in.';
            }
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }

        return {
          success: false,
          error: errorMessage,
          message: errorMessage,
        };
      }

      const data = await response.json();

      if (response.status === 401) {
        storage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error - Please check if the backend server is running',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('API POST Request:', {
        endpoint: `${this.baseURL}${endpoint}`,
        data,
      });
    }
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

