import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import AuthService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: 'buyer' | 'vendor';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  hasRole: (role: 'buyer' | 'vendor' | 'admin') => boolean;
  hasAnyRole: (roles: ('buyer' | 'vendor' | 'admin')[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize AuthService first
      AuthService.initialize();
      
      // Check if user is already logged in
      const currentUser = AuthService.getCurrentUser();
      const isAuthenticated = AuthService.isAuthenticated();
      
      if (isAuthenticated && currentUser) {
        // Verify token is still valid
        const isTokenValid = AuthService.isTokenValid();
        if (isTokenValid) {
          setUser(currentUser);
        } else {
          // Token expired, try to refresh
          const refreshed = await AuthService.refreshToken();
          if (!refreshed) {
            AuthService.logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      AuthService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: 'buyer' | 'vendor';
  }) => {
    try {
      const result = await AuthService.register(data);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) => {
    try {
      const result = await AuthService.updateProfile(updates);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  const hasRole = (role: 'buyer' | 'vendor' | 'admin'): boolean => {
    return AuthService.hasRole(role);
  };

  const hasAnyRole = (roles: ('buyer' | 'vendor' | 'admin')[]): boolean => {
    return AuthService.hasAnyRole(roles);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    hasAnyRole
  };

  // Debug authentication state
  console.log('AuthContext - Current state:', { user, isAuthenticated: !!user, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;