import React, { useState } from 'react';
import { products } from '../data/mockData';
import ProductMosaic from '../components/ProductMosaic';
import CategoryFilter from '../components/CategoryFilter';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Package, Users } from 'lucide-react';

interface HomePageProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

const HomePage: React.FC<HomePageProps> = ({
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const bestSellers = products.sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const newArrivals = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // Vendor-specific content
  if (user?.role === 'vendor') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Vendor Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 text-white py-16 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome Back, {user.name?.split(' ')[0]}!
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Manage your store and grow your business
            </p>
            <button 
              onClick={() => navigate('/vendor/dashboard')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Package className="h-5 w-5" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Vendor Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/vendor/dashboard')}
                  className="w-full text-left p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  Add New Product
                </button>
                <button 
                  onClick={() => navigate('/vendor/dashboard')}
                  className="w-full text-left p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View Orders
                </button>
                <button 
                  onClick={() => navigate('/vendor/dashboard')}
                  className="w-full text-left p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Check Analytics
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Store Performance</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders Today</span>
                  <span className="font-semibold text-green-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-semibold">$2,450</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">John D.</span> ordered Wireless Earbuds
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Sarah M.</span> reviewed Gaming Keyboard
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Mike R.</span> added item to wishlist
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Overview for Vendors */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Marketplace Insights</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 mb-4">
              Stay competitive by understanding market trends and customer preferences.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">10K+</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">500+</div>
                <div className="text-sm text-gray-600">Active Vendors</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">50K+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-accent-500 to-highlight-500 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 animate-slide-up">
            From trusted vendors worldwide
          </p>
          <div className="flex justify-center space-x-4 animate-slide-up">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-80">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm opacity-80">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Best Sellers */}
        <ProductMosaic
          products={bestSellers}
          title="⭐ Best Sellers"
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlist={wishlist}
        />

        {/* New Arrivals */}
        <ProductMosaic
          products={newArrivals}
          title="🆕 New Arrivals"
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlist={wishlist}
        />

        {/* All Products */}
        <ProductMosaic
          products={filteredProducts}
          title={selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlist={wishlist}
        />
      </div>
    </div>
  );
};

export default HomePage;