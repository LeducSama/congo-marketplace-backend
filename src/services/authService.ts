import { User } from '../types';

// Simulated authentication service for frontend
// In production, this would make HTTP calls to a backend API

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: 'buyer' | 'vendor';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

class AuthService {
  private static storageKey = 'marketplace_auth';
  private static currentAuth: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };

  // Demo users (simulating database)
  private static demoUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // In real app, this would be hashed
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'buyer' as const,
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'TechCorp Owner',
      email: 'owner@techcorp.com',
      password: 'vendor123',
      phone: '+1 (555) 234-5678',
      address: '456 Tech Ave, San Francisco, CA 94102',
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'vendor' as const,
      createdAt: new Date('2023-02-20')
    },
    {
      id: '6',
      name: 'Admin User',
      email: 'admin@marketplace.com',
      password: 'admin123',
      phone: '+1 (555) 000-0000',
      address: '1 Admin Plaza, Admin City, AC 00000',
      avatar: null,
      role: 'admin' as const,
      createdAt: new Date('2023-01-01')
    }
  ];

  static initialize() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const authData = JSON.parse(stored);
        this.currentAuth = authData;
      }
    } catch (error) {
      console.warn('Failed to load auth state:', error);
      this.logout();
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email
      const user = this.demoUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Check password (in real app, compare hashed passwords)
      if (user.password !== credentials.password) {
        return { success: false, error: 'Invalid password' };
      }

      // Generate mock token (in real app, this would be a JWT from backend)
      const token = this.generateMockToken(user.id);

      // Create user object without password
      const authenticatedUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      };

      // Update auth state
      this.currentAuth = {
        isAuthenticated: true,
        user: authenticatedUser,
        token
      };

      // Persist to localStorage
      this.saveAuthState();

      return { success: true, user: authenticatedUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  static async register(data: RegisterData): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = this.demoUsers.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: (this.demoUsers.length + 1).toString(),
        name: data.name,
        email: data.email,
        password: data.password, // In real app, hash this
        phone: data.phone || '',
        address: data.address || '',
        avatar: null,
        role: data.role || 'buyer' as const,
        createdAt: new Date()
      };

      // Add to demo users (in real app, save to database)
      this.demoUsers.push(newUser);

      // Auto-login after registration
      const loginResult = await this.login({ email: data.email, password: data.password });
      
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  static logout(): void {
    this.currentAuth = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    
    localStorage.removeItem(this.storageKey);
    
    // Clear user-specific data
    localStorage.removeItem('cart_' + this.getCurrentUser()?.id);
    localStorage.removeItem('wishlist_' + this.getCurrentUser()?.id);
  }

  static getCurrentUser(): User | null {
    return this.currentAuth.user;
  }

  static isAuthenticated(): boolean {
    return this.currentAuth.isAuthenticated;
  }

  static getToken(): string | null {
    return this.currentAuth.token;
  }

  static hasRole(role: 'buyer' | 'vendor' | 'admin'): boolean {
    return this.currentAuth.user?.role === role;
  }

  static hasAnyRole(roles: ('buyer' | 'vendor' | 'admin')[]): boolean {
    return this.currentAuth.user ? roles.includes(this.currentAuth.user.role) : false;
  }

  static async updateProfile(updates: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      if (!this.currentAuth.user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update demo user data
      const userIndex = this.demoUsers.findIndex(u => u.id === this.currentAuth.user!.id);
      if (userIndex !== -1) {
        const user = this.demoUsers[userIndex];
        Object.assign(user, updates);

        // Update current auth state
        const updatedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        };

        this.currentAuth.user = updatedUser;
        this.saveAuthState();

        return { success: true, user: updatedUser };
      }

      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Update failed' };
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentAuth.user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Find user and verify current password
      const user = this.demoUsers.find(u => u.id === this.currentAuth.user!.id);
      if (!user || user.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update password
      user.password = newPassword;

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed' };
    }
  }

  private static generateMockToken(userId: string): string {
    // In real app, this would be a proper JWT
    return btoa(JSON.stringify({
      userId,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
  }

  private static saveAuthState(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentAuth));
    } catch (error) {
      console.warn('Failed to save auth state:', error);
    }
  }

  // Check if token is valid (in real app, verify JWT)
  static isTokenValid(): boolean {
    if (!this.currentAuth.token) return false;
    
    try {
      const decoded = JSON.parse(atob(this.currentAuth.token));
      return decoded.expires > Date.now();
    } catch {
      return false;
    }
  }

  // Refresh token if needed
  static async refreshToken(): Promise<boolean> {
    if (this.isTokenValid()) return true;

    // In real app, call refresh endpoint
    this.logout();
    return false;
  }
}

// Initialize on import
AuthService.initialize();

export default AuthService;