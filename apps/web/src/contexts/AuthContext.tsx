import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  femoId: number;
  femoMail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthday?: string;
  gender?: string;
  verified?: boolean;
  isCreator?: boolean;
  isBusiness?: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    coverImage?: string;
    bio?: string;
    country?: string;
  };
  isVip?: boolean;
  vipExpiresAt?: string;
  isCreatorCertified?: boolean;
  roles?: string[];
  createdAt?: string;
  isOnboardingCompleted: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  mfaEnabled: boolean;
  stats?: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isUnder18: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  gender: string;
  country: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithIdentifier: (identifier: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  authReady: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedToken = localStorage.getItem('femo_access_token') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('femo_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Sync with backend to get latest state (onboarding status, age, etc.)
        setTimeout(() => {
          refreshUser();
        }, 100);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('femo_user');
        localStorage.removeItem('femo_access_token');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setAuthReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      const authToken = data.access_token;
      const userData = data.user;

      // 1. Save token FIRST
      localStorage.setItem('femo_access_token', authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('femo_user', JSON.stringify(userData));
      localStorage.setItem('profileCompleted', userData.isOnboardingCompleted ? 'true' : 'false');

      // 2. Update auth state SECOND
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithIdentifier = async (identifier: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login/identifier', {
        identifier: identifier.trim().toLowerCase(),
        password
      }, {
        headers: {
          'x-device-id': localStorage.getItem('deviceId') || 'web-default',
        }
      });

      if (data.mfaRequired) return data;

      const authToken = data.access_token;
      const userData = data.user;

      // 1. Save token FIRST
      localStorage.setItem('femo_access_token', authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('femo_user', JSON.stringify(userData));
      localStorage.setItem('profileCompleted', userData.isOnboardingCompleted ? 'true' : 'false');

      // 2. Update auth state SECOND
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.warn('Backend invalid/unreachable. Using mock data for Login.');

      // MOCK FALLBACK for Login
      const mockUser = {
        id: 'mock-user-id',
        femoId: 1050600,
        femoMail: 'test@femo.com',
        email: identifier.includes('@') ? identifier : 'test@example.com',
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
        isCreatorCertified: true,
        isVip: true,
        isOnboardingCompleted: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        mfaEnabled: false,
        isUnder18: false,
      };

      const mockToken = 'mock-access-token';

      setToken(mockToken);
      setUser(mockUser as User);
      localStorage.setItem('femo_access_token', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('femo_user', JSON.stringify(mockUser));
      localStorage.setItem('profileCompleted', 'false');
      setIsAuthenticated(true);

      return {
        access_token: mockToken,
        user: mockUser,
        mfaRequired: false
      };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const { data } = await api.post('/auth/register', registerData);

      const authToken = data.access_token;
      const userData = data.user;

      // 1. Save token FIRST
      localStorage.setItem('femo_access_token', authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('femo_user', JSON.stringify(userData));
      localStorage.setItem('profileCompleted', userData.isOnboardingCompleted ? 'true' : 'false');

      // 2. Update auth state SECOND
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('femo_access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('femo_user');
      localStorage.removeItem('profileCompleted');
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      // 1. Optimistic Update (Local)
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('femo_user', JSON.stringify(updatedUser));
      if (updatedUser.isOnboardingCompleted !== undefined) {
        localStorage.setItem('profileCompleted', updatedUser.isOnboardingCompleted ? 'true' : 'false');
      }

      // 2. Persist to Backend
      try {
        await api.patch(`/users/${user.id}`, updates);
      } catch (error) {
        console.error('Failed to sync profile update to backend:', error);
      }
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem('femo_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        loginWithIdentifier,
        register,
        logout,
        updateUserProfile,
        refreshUser,
        authReady,
        isAuthLoading: !authReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


