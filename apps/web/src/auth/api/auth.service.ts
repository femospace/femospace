/**
 * Femo Space Authentication API Service
 * Handles all authentication API calls
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../../config';


export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  femoId: number;
  femoMail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  mfaRequired?: boolean;
  userId?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh on 401
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {},
                {
                  headers: {
                    'x-refresh-token': refreshToken,
                  },
                  withCredentials: true,
                },
              );

              localStorage.setItem('access_token', response.data.access_token);
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Login with Femo ID or Femo Mail
   */
  async loginWithIdentifier(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login/identifier', request, {
        headers: {
          'x-device-id': this.getOrCreateDeviceId(),
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Legacy login with email
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', { email, password }, {
        headers: {
          'x-device-id': this.getOrCreateDeviceId(),
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Verify MFA
   */
  async verifyMfa(userId: string, token: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login/mfa', {
        userId,
        token,
      }, {
        headers: {
          'x-device-id': this.getOrCreateDeviceId(),
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshTokens(): Promise<{ access_token: string }> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post<{ access_token: string }>(
        '/auth/refresh',
        {},
        {
          headers: {
            'x-refresh-token': refreshToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get device ID (create if not exists)
   */
  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): AuthError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code,
        status: error.response.status,
      };
    }

    if (error.request) {
      return {
        message: 'No response from server',
        code: 'NO_RESPONSE',
      };
    }

    return {
      message: error.message || 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}

export default new AuthService();
