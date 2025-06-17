// Real API service for production backend
import type { Product, Vendor, Category, CartItem } from '../types';

const API_BASE_URL = 'https://congo-marketplace-api.onrender.com/api';

// API client with authentication
class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('marketplace_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      localStorage.setItem('marketplace_token', response.token);
      localStorage.setItem('marketplace_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('marketplace_token', response.token);
      localStorage.setItem('marketplace_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Products
  async getProducts(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request('/products/categories/all');
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE'
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async toggleWishlist(productId: string) {
    return this.request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  // Vendors
  async getVendors() {
    return this.request('/vendors');
  }

  async getFollowedVendors() {
    return this.request('/vendors/following');
  }

  async followVendor(vendorId: string) {
    return this.request(`/vendors/${vendorId}/follow`, {
      method: 'POST'
    });
  }

  async getFollowedVendorProducts() {
    return this.request('/vendors/following/products');
  }

  // Stories
  async createStory(content: string, imageUrl?: string) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl })
    });
  }

  async getStoriesFeed() {
    return this.request('/stories/feed');
  }

  async viewStory(storyId: string) {
    return this.request(`/stories/${storyId}/view`, {
      method: 'POST'
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;