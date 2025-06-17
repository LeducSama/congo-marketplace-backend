import { Product, Vendor, VendorStatus, Category } from '../types';
import DataService from '../services/dataService';

// Legacy exports for backward compatibility - now powered by DataService
export let categories: Category[] = [];
export let products: Product[] = [];
export let vendors: Vendor[] = [];

// Initialize data from DataService
const initializeData = async () => {
  try {
    categories = await DataService.getAllCategories();
    products = await DataService.getAllProducts();
    vendors = await DataService.getAllVendors();
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
};

// Initialize immediately
initializeData();

// Vendor statuses (keeping this as mock data for now)
export const vendorStatuses: VendorStatus[] = [
  {
    id: '1',
    vendor: vendors[0] || {
      id: '1',
      name: 'TechCorp Store',
      description: 'Premium electronics and gadgets',
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.8,
      totalSales: 15420,
      followers: 2340,
      isFollowed: true,
      hasActiveStatus: true,
      createdAt: new Date('2023-01-15'),
    },
    content: 'Just launched our new wireless earbuds collection! 🎧 Premium sound quality meets sleek design. Limited time offer - 25% off!',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-22'),
    likes: 124,
    isLiked: true,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  {
    id: '2',
    vendor: vendors[2] || {
      id: '3',
      name: 'Green Living',
      description: 'Eco-friendly home and garden products',
      avatar: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.9,
      totalSales: 12100,
      followers: 3100,
      isFollowed: true,
      hasActiveStatus: true,
      createdAt: new Date('2023-03-10'),
    },
    content: 'Sustainability meets style! Check out our latest eco-friendly home collection 🌱 Every purchase plants a tree!',
    image: 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-21'),
    likes: 89,
    isLiked: false,
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
  },
  {
    id: '3',
    vendor: vendors[1] || {
      id: '2',
      name: 'Fashion Forward',
      description: 'Trendy clothing and accessories',
      avatar: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.6,
      totalSales: 8900,
      followers: 1890,
      isFollowed: false,
      hasActiveStatus: true,
      createdAt: new Date('2023-02-20'),
    },
    content: 'Fashion week inspiration! Our vintage collection is now live ✨ Timeless pieces for the modern wardrobe.',
    createdAt: new Date('2024-01-20'),
    likes: 156,
    isLiked: true,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
  },
  {
    id: '4',
    vendor: vendors[0] || {
      id: '1',
      name: 'TechCorp Store',
      description: 'Premium electronics and gadgets',
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.8,
      totalSales: 15420,
      followers: 2340,
      isFollowed: true,
      hasActiveStatus: true,
      createdAt: new Date('2023-01-15'),
    },
    content: 'Behind the scenes: Testing our new gaming keyboards! 🎮 RGB lighting that adapts to your gameplay.',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-19'),
    likes: 203,
    isLiked: false,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
  },
];