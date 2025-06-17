import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import DataService from '../services/dataService';

interface WishlistPageProps {
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadWishlistData();
  }, [wishlist]);

  const loadWishlistData = async () => {
    try {
      const [wishlistData, allProductsData] = await Promise.all([
        DataService.getWishlistItems(),
        DataService.getAllProducts()
      ]);
      setWishlistProducts(wishlistData);
      setAllProducts(allProductsData);
    } catch (error) {
      console.error('Failed to load wishlist data:', error);
    }
  };

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach(product => {
      onAddToCart(product);
    });
  };

  const handleClearWishlist = () => {
    wishlist.forEach(productId => {
      onToggleWishlist(productId);
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save products you love to come back to them later</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
                <p className="text-sm text-gray-600">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add All to Cart</span>
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Wishlist Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{wishlist.length}</p>
                <p className="text-sm text-gray-600">Items Saved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-accent-100 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ${wishlistProducts.reduce((total, product) => total + product.price, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-highlight-100 p-2 rounded-lg">
                <Trash2 className="h-6 w-6 text-highlight-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ${wishlistProducts
                    .filter(product => product.originalPrice)
                    .reduce((total, product) => total + (product.originalPrice! - product.price), 0)
                    .toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Savings Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to purchase?</h3>
              <p className="opacity-90">Add all items to your cart and proceed to checkout</p>
            </div>
            <button
              onClick={handleMoveAllToCart}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Add All to Cart
            </button>
          </div>
        </div>

        {/* Wishlist Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={true}
              />
              
              {/* Quick Remove Button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                title="Remove from wishlist"
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allProducts
                .filter(product => !wishlist.includes(product.id))
                .slice(0, 4)
                .map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-primary-600 font-bold">${product.price}</p>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="w-full mt-2 bg-primary-50 text-primary-600 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm"
                    >
                      Add to Wishlist
                    </button>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;