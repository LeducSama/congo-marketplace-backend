// Frontend-compatible data service that bridges to the database
// Note: In a real app, this would be API calls to a backend server
// For this demo, we'll simulate the database calls with the actual services

import type { Product, Vendor, Category, CartItem } from '../types';

// Types for stories and vendor following
interface VendorStory {
  id: string;
  vendorId: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  expiresAt: string;
  views: number;
  isActive: boolean;
}

interface FollowedVendor {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  hasNewStory: boolean;
  stories: VendorStory[];
}

// Simulated database services for frontend use
// In production, these would be HTTP API calls

class DataService {
  private static currentUserId = '1'; // Demo user ID
  private static products: Product[] = [];
  private static categories: Category[] = [];
  private static vendors: Vendor[] = [];
  private static cart: CartItem[] = [];
  private static wishlist: string[] = [];
  private static initialized = false;

  // Initialize with database data (simulated)
  private static async initialize() {
    if (this.initialized) return;

    // Simulate loading from database
    // In production, this would be fetch('/api/products') etc.
    
    this.categories = [
      { id: '1', name: 'Electronics', icon: 'Smartphone', color: 'bg-blue-100 text-blue-600' },
      { id: '2', name: 'Fashion', icon: 'Shirt', color: 'bg-pink-100 text-pink-600' },
      { id: '3', name: 'Home & Garden', icon: 'Home', color: 'bg-green-100 text-green-600' },
      { id: '4', name: 'Sports', icon: 'Dumbbell', color: 'bg-orange-100 text-orange-600' },
      { id: '5', name: 'Books', icon: 'Book', color: 'bg-purple-100 text-purple-600' },
      { id: '6', name: 'Beauty', icon: 'Sparkles', color: 'bg-red-100 text-red-600' }
    ];

    this.vendors = [
      {
        id: '1',
        name: 'TechCorp Store',
        description: 'Premium electronics and gadgets',
        avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
        banner: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        totalSales: 15420,
        followers: 2340,
        isFollowed: false,
        hasActiveStatus: true,
        createdAt: new Date('2023-01-15'),
      },
      {
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
      {
        id: '3',
        name: 'Green Living',
        description: 'Eco-friendly home and garden products',
        avatar: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.9,
        totalSales: 12100,
        followers: 3100,
        isFollowed: false,
        hasActiveStatus: true,
        createdAt: new Date('2023-03-10'),
      },
      {
        id: '4',
        name: 'Sports Zone',
        description: 'Athletic gear and equipment',
        avatar: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.7,
        totalSales: 9800,
        followers: 1560,
        isFollowed: false,
        hasActiveStatus: false,
        createdAt: new Date('2023-04-05'),
      }
    ];

    this.products = [
      {
        id: '1',
        title: 'Wireless Earbuds Pro',
        description: 'Premium noise-cancelling wireless earbuds with 24h battery life',
        price: 149.99,
        originalPrice: 199.99,
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Electronics',
        vendorId: '1',
        vendor: this.vendors[0],
        rating: 4.7,
        reviews: 234,
        stock: 45,
        tags: ['wireless', 'audio', 'premium'],
        isTrending: true,
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '2',
        title: 'Vintage Denim Jacket',
        description: 'Classic denim jacket with modern fit and premium quality',
        price: 89.99,
        images: [
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Fashion',
        vendorId: '2',
        vendor: this.vendors[1],
        rating: 4.5,
        reviews: 156,
        stock: 12,
        tags: ['denim', 'vintage', 'casual'],
        isTrending: true,
        createdAt: new Date('2024-01-12'),
      },
      {
        id: '3',
        title: 'Smart Plant Monitor',
        description: 'IoT device to monitor your plants health and watering needs',
        price: 59.99,
        images: [
          'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Home & Garden',
        vendorId: '3',
        vendor: this.vendors[2],
        rating: 4.8,
        reviews: 89,
        stock: 28,
        tags: ['smart', 'plants', 'iot'],
        isTrending: false,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '4',
        title: 'Gaming Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard for gaming enthusiasts',
        price: 129.99,
        originalPrice: 159.99,
        images: [
          'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Electronics',
        vendorId: '1',
        vendor: this.vendors[0],
        rating: 4.9,
        reviews: 312,
        stock: 67,
        tags: ['gaming', 'mechanical', 'rgb'],
        isTrending: true,
        createdAt: new Date('2024-01-08'),
      },
      {
        id: '5',
        title: 'Silk Scarf Collection',
        description: 'Luxury silk scarves with unique patterns and premium quality',
        price: 45.99,
        images: [
          'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Fashion',
        vendorId: '2',
        vendor: this.vendors[1],
        rating: 4.6,
        reviews: 78,
        stock: 23,
        tags: ['silk', 'luxury', 'accessories'],
        isTrending: false,
        createdAt: new Date('2024-01-20'),
      },
      {
        id: '6',
        title: 'Bamboo Cutting Board Set',
        description: 'Sustainable bamboo cutting boards in various sizes',
        price: 34.99,
        images: [
          'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Home & Garden',
        vendorId: '3',
        vendor: this.vendors[2],
        rating: 4.7,
        reviews: 145,
        stock: 89,
        tags: ['bamboo', 'sustainable', 'kitchen'],
        isTrending: true,
        createdAt: new Date('2024-01-05'),
      },
      {
        id: '7',
        title: 'Professional Yoga Mat',
        description: 'Non-slip yoga mat perfect for all types of workouts',
        price: 79.99,
        originalPrice: 99.99,
        images: [
          'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Sports',
        vendorId: '4',
        vendor: this.vendors[3],
        rating: 4.8,
        reviews: 201,
        stock: 34,
        tags: ['yoga', 'fitness', 'non-slip'],
        isTrending: true,
        createdAt: new Date('2024-01-03'),
      },
      {
        id: '8',
        title: 'Wireless Charging Pad',
        description: 'Fast wireless charging for all compatible devices',
        price: 39.99,
        originalPrice: 49.99,
        images: [
          'https://images.pexels.com/photos/4062289/pexels-photo-4062289.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Electronics',
        vendorId: '1',
        vendor: this.vendors[0],
        rating: 4.5,
        reviews: 89,
        stock: 156,
        tags: ['wireless', 'charging', 'fast'],
        isTrending: false,
        createdAt: new Date('2024-01-18'),
      },
      {
        id: '9',
        title: 'Designer Sunglasses',
        description: 'UV protection with stylish frame design',
        price: 119.99,
        originalPrice: 149.99,
        images: [
          'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Fashion',
        vendorId: '2',
        vendor: this.vendors[1],
        rating: 4.6,
        reviews: 134,
        stock: 78,
        tags: ['sunglasses', 'designer', 'uv-protection'],
        isTrending: false,
        createdAt: new Date('2024-01-22'),
      },
      {
        id: '10',
        title: 'Organic Herb Garden Kit',
        description: 'Complete kit to grow herbs at home',
        price: 24.99,
        images: [
          'https://images.pexels.com/photos/1415823/pexels-photo-1415823.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
        category: 'Home & Garden',
        vendorId: '3',
        vendor: this.vendors[2],
        rating: 4.9,
        reviews: 67,
        stock: 45,
        tags: ['organic', 'herbs', 'garden'],
        isTrending: true,
        createdAt: new Date('2024-01-25'),
      }
    ];

    // Load user's cart and wishlist from localStorage (simulating database persistence)
    this.loadUserData();

    this.initialized = true;
  }

  // Load user data from localStorage (simulating database)
  private static loadUserData() {
    try {
      const cartData = localStorage.getItem(`cart_${this.currentUserId}`);
      if (cartData) {
        const cartIds = JSON.parse(cartData);
        this.cart = cartIds.map((item: any) => {
          const product = this.products.find(p => p.id === item.productId);
          return product ? {
            id: item.id,
            product,
            quantity: item.quantity
          } : null;
        }).filter(Boolean);
      }

      const wishlistData = localStorage.getItem(`wishlist_${this.currentUserId}`);
      if (wishlistData) {
        this.wishlist = JSON.parse(wishlistData);
      }
    } catch (error) {
      console.warn('Failed to load user data from localStorage:', error);
    }
  }

  // Save user data to localStorage (simulating database)
  private static saveUserData() {
    try {
      const cartData = this.cart.map(item => ({
        id: item.id,
        productId: item.product.id,
        quantity: item.quantity
      }));
      localStorage.setItem(`cart_${this.currentUserId}`, JSON.stringify(cartData));
      localStorage.setItem(`wishlist_${this.currentUserId}`, JSON.stringify(this.wishlist));
    } catch (error) {
      console.warn('Failed to save user data to localStorage:', error);
    }
  }

  // Public API methods
  static async getAllProducts(): Promise<Product[]> {
    await this.initialize();
    return [...this.products];
  }

  static async getProductById(id: string): Promise<Product | null> {
    await this.initialize();
    return this.products.find(p => p.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    await this.initialize();
    return this.products.filter(p => p.category === category);
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await this.initialize();
    const searchTerm = query.toLowerCase();
    return this.products.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.vendor.name.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  static async getTrendingProducts(): Promise<Product[]> {
    await this.initialize();
    return this.products.filter(p => p.isTrending);
  }

  static async getAllCategories(): Promise<Category[]> {
    await this.initialize();
    return [...this.categories];
  }

  static async getAllVendors(): Promise<Vendor[]> {
    await this.initialize();
    return [...this.vendors];
  }

  // Cart operations
  static async getCartItems(): Promise<CartItem[]> {
    await this.initialize();
    return [...this.cart];
  }

  static async addToCart(product: Product, quantity: number = 1): Promise<boolean> {
    await this.initialize();
    
    const existingItem = this.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: Date.now().toString(),
        product,
        quantity
      });
    }
    
    this.saveUserData();
    return true;
  }

  static async updateCartQuantity(itemId: string, quantity: number): Promise<boolean> {
    await this.initialize();
    
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }
    
    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.saveUserData();
      return true;
    }
    
    return false;
  }

  static async removeFromCart(itemId: string): Promise<boolean> {
    await this.initialize();
    
    const index = this.cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.saveUserData();
      return true;
    }
    
    return false;
  }

  static async getCartItemsCount(): Promise<number> {
    await this.initialize();
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Wishlist operations
  static async getWishlistItems(): Promise<Product[]> {
    await this.initialize();
    return this.products.filter(p => this.wishlist.includes(p.id));
  }

  static async getWishlistProductIds(): Promise<string[]> {
    await this.initialize();
    return [...this.wishlist];
  }

  static async toggleWishlist(productId: string): Promise<boolean> {
    await this.initialize();
    
    const index = this.wishlist.indexOf(productId);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    
    this.saveUserData();
    return true;
  }

  static async isInWishlist(productId: string): Promise<boolean> {
    await this.initialize();
    return this.wishlist.includes(productId);
  }

  // Vendor following operations
  static async getFollowedVendors(): Promise<FollowedVendor[]> {
    await this.initialize();
    
    // Simulate API call to get followed vendors with stories
    const followedVendorIds = ['1', '2', '3']; // Mock followed vendors
    
    const followedVendors: FollowedVendor[] = [
      {
        id: '1',
        name: 'TechCorp Electronics',
        avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true,
        hasNewStory: true,
        stories: [
          {
            id: '1',
            vendorId: '1',
            content: 'New iPhone accessories just arrived! 📱✨',
            imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
            timestamp: '2h ago',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            views: 234,
            isActive: true
          },
          {
            id: '2',
            vendorId: '1',
            content: 'Behind the scenes: Quality testing our wireless earbuds 🎧',
            imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            timestamp: '4h ago',
            expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
            views: 189,
            isActive: true
          }
        ]
      },
      {
        id: '2',
        name: 'Fashion Forward',
        avatar: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true,
        hasNewStory: true,
        stories: [
          {
            id: '3',
            vendorId: '2',
            content: 'Summer collection preview! 🌞 Which style is your favorite?',
            imageUrl: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
            timestamp: '1h ago',
            expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
            views: 567,
            isActive: true
          }
        ]
      },
      {
        id: '3',
        name: 'Home Essentials Co',
        avatar: 'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: false,
        hasNewStory: false,
        stories: []
      }
    ];

    return followedVendors;
  }

  static async getTopProductsFromFollowedVendors(): Promise<Product[]> {
    await this.initialize();
    
    // Get top-selling products from followed vendors
    const topProducts = [
      {
        id: 'p1',
        title: 'Wireless Earbuds Pro',
        price: 149.99,
        originalPrice: 199.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        reviews: 1247,
        category: 'Electronics',
        vendor: {
          id: '1',
          name: 'TechCorp Electronics',
          avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: true
        },
        badge: 'Best Seller',
        inStock: true,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'p2',
        title: 'Summer Collection Dress',
        price: 79.99,
        originalPrice: null,
        image: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        reviews: 892,
        category: 'Fashion',
        vendor: {
          id: '2',
          name: 'Fashion Forward',
          avatar: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: true
        },
        badge: 'New Arrival',
        inStock: true,
        createdAt: new Date('2024-01-19')
      },
      {
        id: 'p3',
        title: 'Gaming Mechanical Keyboard',
        price: 129.99,
        originalPrice: 159.99,
        image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        reviews: 1567,
        category: 'Electronics',
        vendor: {
          id: '1',
          name: 'TechCorp Electronics',
          avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: true
        },
        badge: 'Top Rated',
        inStock: true,
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'p4',
        title: 'Ceramic Vase Set',
        price: 45.99,
        originalPrice: null,
        image: 'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        reviews: 234,
        category: 'Home & Garden',
        vendor: {
          id: '3',
          name: 'Home Essentials Co',
          avatar: 'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: false
        },
        badge: 'Handmade',
        inStock: true,
        createdAt: new Date('2024-01-17')
      },
      {
        id: 'p5',
        title: 'Designer Handbag',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        reviews: 678,
        category: 'Fashion',
        vendor: {
          id: '2',
          name: 'Fashion Forward',
          avatar: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: true
        },
        badge: 'Limited Edition',
        inStock: false,
        createdAt: new Date('2024-01-16')
      },
      {
        id: 'p6',
        title: 'Smart Watch Series X',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        reviews: 2103,
        category: 'Electronics',
        vendor: {
          id: '1',
          name: 'TechCorp Electronics',
          avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
          verified: true
        },
        badge: 'Best Seller',
        inStock: true,
        createdAt: new Date('2024-01-15')
      }
    ] as Product[];

    // Shuffle for random display
    return topProducts.sort(() => Math.random() - 0.5);
  }

  static async createVendorStory(vendorId: string, content: string, imageUrl?: string): Promise<boolean> {
    // Simulate creating a story in the database
    console.log('Creating story for vendor:', vendorId, content, imageUrl);
    
    // In real implementation, this would be:
    // const response = await fetch('/api/vendor/stories', {
    //   method: 'POST',
    //   body: JSON.stringify({ vendorId, content, imageUrl })
    // });
    
    return true;
  }

  static async followVendor(vendorId: string): Promise<boolean> {
    // Simulate following a vendor
    console.log('Following vendor:', vendorId);
    return true;
  }

  static async unfollowVendor(vendorId: string): Promise<boolean> {
    // Simulate unfollowing a vendor
    console.log('Unfollowing vendor:', vendorId);
    return true;
  }
}

export default DataService;