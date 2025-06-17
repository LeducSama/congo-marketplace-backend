import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  Star, 
  Heart,
  MessageCircle,
  ShoppingBag,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Share
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataService from '../services/dataService';
import type { Product } from '../types';

const VendorsFollowPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [vendorStories, setVendorStories] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from DataService
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stories, products] = await Promise.all([
          DataService.getFollowedVendors(),
          DataService.getTopProductsFromFollowedVendors()
        ]);
        
        setVendorStories(stories);
        setTopProducts(products);
      } catch (error) {
        console.error('Failed to load vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Keep existing mock data for vendor posts (we can replace this later)
  const mockVendorStories = [
    {
      vendorId: '1',
      vendorName: 'TechCorp',
      vendorAvatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
      hasNewStory: true,
      stories: [
        {
          id: '1',
          type: 'image',
          content: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
          text: 'New iPhone accessories just arrived! 📱✨',
          timestamp: '2h ago',
          views: 234
        },
        {
          id: '2',
          type: 'video',
          content: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          text: 'Behind the scenes: Quality testing our wireless earbuds 🎧',
          timestamp: '4h ago',
          views: 189
        }
      ]
    },
    {
      vendorId: '2',
      vendorName: 'Fashion Forward',
      vendorAvatar: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
      hasNewStory: true,
      stories: [
        {
          id: '3',
          type: 'image',
          content: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
          text: 'Summer collection preview! 🌞 Which style is your favorite?',
          timestamp: '1h ago',
          views: 567
        }
      ]
    },
    {
      vendorId: '3',
      vendorName: 'Home Essentials',
      vendorAvatar: 'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=150',
      hasNewStory: false,
      stories: []
    }
  ];


  const vendorPosts = [
    {
      id: '1',
      vendorId: '1',
      vendorName: 'TechCorp Electronics',
      vendorAvatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      timestamp: '3 hours ago',
      content: {
        type: 'product_showcase',
        text: 'Introducing our latest wireless charging pad! Fast, efficient, and sleek design. Perfect for your workspace setup. ⚡📱',
        images: [
          'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        product: {
          id: 'p1',
          name: 'Wireless Charging Pad Pro',
          price: '$49.99',
          originalPrice: '$69.99'
        }
      },
      stats: {
        likes: 1240,
        comments: 89,
        shares: 23
      },
      isLiked: false
    },
    {
      id: '2',
      vendorId: '2',
      vendorName: 'Fashion Forward',
      vendorAvatar: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      timestamp: '5 hours ago',
      content: {
        type: 'collection_announcement',
        text: '🌸 Spring Collection 2024 is here! Fresh colors, sustainable materials, and timeless designs. Shop now and get 20% off your first order!',
        images: [
          'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        promotion: {
          code: 'SPRING20',
          discount: '20% OFF',
          validUntil: 'March 31st'
        }
      },
      stats: {
        likes: 2100,
        comments: 156,
        shares: 78
      },
      isLiked: true
    },
    {
      id: '3',
      vendorId: '3',
      vendorName: 'Home Essentials Co',
      vendorAvatar: 'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
      timestamp: '1 day ago',
      content: {
        type: 'behind_the_scenes',
        text: 'Behind the scenes at our workshop! Each ceramic piece is hand-crafted with love and attention to detail. 🏺✨',
        images: [
          'https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600'
        ]
      },
      stats: {
        likes: 892,
        comments: 45,
        shares: 12
      },
      isLiked: false
    }
  ];

  // Story viewer functionality
  const openStory = (vendor: any) => {
    if (vendor.stories.length > 0) {
      setSelectedStory(vendor);
      setViewingStoryIndex(0);
      setStoryProgress(0);
    }
  };

  const nextStory = () => {
    if (selectedStory && viewingStoryIndex < selectedStory.stories.length - 1) {
      setViewingStoryIndex(viewingStoryIndex + 1);
      setStoryProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (viewingStoryIndex > 0) {
      setViewingStoryIndex(viewingStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  const closeStory = () => {
    setSelectedStory(null);
    setViewingStoryIndex(0);
    setStoryProgress(0);
  };

  // Auto-advance story progress
  useEffect(() => {
    if (selectedStory) {
      const timer = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [selectedStory, viewingStoryIndex]);

  const handleLike = (postId: string) => {
    // Handle like functionality
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    // Handle comment functionality
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // Handle share functionality
    console.log('Share post:', postId);
  };

  const handleAddToCart = async (product: any) => {
    try {
      await DataService.addToCart(product, 1);
      console.log('Added to cart:', product.title);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      await DataService.toggleWishlist(productId);
      console.log('Toggled wishlist for:', productId);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleQuickView = (product: any) => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  const getBadgeStyle = (badge: string) => {
    const styles = {
      'Best Seller': 'bg-yellow-100 text-yellow-800',
      'New Arrival': 'bg-green-100 text-green-800',
      'Top Rated': 'bg-blue-100 text-blue-800',
      'Limited Edition': 'bg-purple-100 text-purple-800',
      'Trending': 'bg-pink-100 text-pink-800',
      'Handmade': 'bg-orange-100 text-orange-800',
      'Eco-Friendly': 'bg-emerald-100 text-emerald-800'
    };
    return styles[badge as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Following</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stories Row */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {vendorStories.map((vendor) => (
              <button
                key={vendor.vendorId}
                onClick={() => openStory(vendor)}
                className="flex-shrink-0 flex flex-col items-center space-y-2"
              >
                <div className={`relative p-0.5 rounded-full ${
                  vendor.hasNewStory 
                    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
                    : 'bg-gray-300'
                }`}>
                  <div className="bg-white p-0.5 rounded-full">
                    <img
                      src={vendor.vendorAvatar}
                      alt={vendor.vendorName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  {vendor.stories.length > 0 && (
                    <div className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-1">
                      <Play className="h-3 w-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 max-w-[70px] truncate">
                  {vendor.vendorName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto">
        {vendorPosts.map((post) => (
          <div key={post.id} className="bg-white mb-4">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.vendorAvatar}
                  alt={post.vendorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-gray-800">{post.vendorName}</h3>
                    {post.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-800 mb-3">{post.content.text}</p>
            </div>

            {/* Post Images */}
            <div className={`grid ${post.content.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
              {post.content.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  className="w-full h-64 object-cover"
                />
              ))}
            </div>

            {/* Product/Promotion Info */}
            {post.content.product && (
              <div className="p-4 bg-gray-50 mx-4 my-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{post.content.product.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary-600">{post.content.product.price}</span>
                      {post.content.product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{post.content.product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Shop</span>
                  </button>
                </div>
              </div>
            )}

            {post.content.promotion && (
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 mx-4 my-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-purple-800">{post.content.promotion.discount}</h4>
                    <p className="text-sm text-purple-600">Code: {post.content.promotion.code}</p>
                    <p className="text-xs text-purple-500">Valid until {post.content.promotion.validUntil}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Use Code
                  </button>
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    <span className="text-sm font-medium">{post.stats.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium">{post.stats.comments}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Share className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium">{post.stats.shares}</span>
                  </button>
                </div>
                <button className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm hover:bg-primary-700 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Top Products Feed Section */}
        <div className="bg-white mt-6 border-t-8 border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Products from Your Vendors</h2>
            <p className="text-sm text-gray-600">Discover the best-selling items from stores you follow</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white">
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyle(product.badge)}`}>
                    {product.badge}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button 
                  onClick={() => handleToggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                >
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>

                {/* Quick View Button */}
                <button 
                  onClick={() => handleQuickView(product)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
                >
                  <div className="bg-white px-3 py-1 rounded-full">
                    <Eye className="h-4 w-4" />
                  </div>
                </button>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                {/* Vendor Info */}
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={product.vendor.avatar}
                    alt={product.vendor.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600 truncate max-w-[100px]">
                      {product.vendor.name}
                    </span>
                    {product.vendor.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-bold text-primary-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
              {selectedStory.stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ 
                      width: index === viewingStoryIndex 
                        ? `${storyProgress}%` 
                        : index < viewingStoryIndex ? '100%' : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 pt-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStory.vendorAvatar}
                  alt={selectedStory.vendorName}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <div>
                  <h3 className="text-white font-semibold text-sm">{selectedStory.vendorName}</h3>
                  <p className="text-white/80 text-xs">{selectedStory.stories[viewingStoryIndex]?.timestamp}</p>
                </div>
              </div>
              <button 
                onClick={closeStory}
                className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="relative w-full h-full">
              <img
                src={selectedStory.stories[viewingStoryIndex]?.content}
                alt=""
                className="w-full h-full object-cover"
              />
              
              {/* Story Text Overlay */}
              {selectedStory.stories[viewingStoryIndex]?.text && (
                <div className="absolute bottom-20 left-4 right-4">
                  <p className="text-white text-lg font-medium bg-black/50 p-3 rounded-lg">
                    {selectedStory.stories[viewingStoryIndex].text}
                  </p>
                </div>
              )}

              {/* Navigation Areas */}
              <button 
                onClick={prevStory}
                className="absolute left-0 top-0 w-1/3 h-full z-10"
                style={{ background: 'transparent' }}
              />
              <button 
                onClick={nextStory}
                className="absolute right-0 top-0 w-2/3 h-full z-10"
                style={{ background: 'transparent' }}
              />

              {/* Navigation Arrows (visible on hover) */}
              {viewingStoryIndex > 0 && (
                <button 
                  onClick={prevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {viewingStoryIndex < selectedStory.stories.length - 1 && (
                <button 
                  onClick={nextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsFollowPage;