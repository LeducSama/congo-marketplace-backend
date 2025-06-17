export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'buyer' | 'vendor' | 'admin';
  createdAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  rating: number;
  totalSales: number;
  followers: number;
  isFollowed: boolean;
  hasActiveStatus?: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  vendorId: string;
  vendor: Vendor;
  rating: number;
  reviews: number;
  stock: number;
  tags: string[];
  isTrending: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  trackingNumber?: string;
}

export interface VendorStatus {
  id: string;
  vendor: Vendor;
  content: string;
  image?: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  expiresAt?: Date; // WhatsApp-style 24h expiry
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}