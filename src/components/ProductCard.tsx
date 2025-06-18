import React from 'react';
import { Heart, Star, ShoppingCart, Eye, Zap, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleCartAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onAddToCart(product);
  };

  const handleWishlistAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onToggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Trending Badge */}
      {product.isTrending && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-accent-500 to-highlight-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Zap className="h-3 w-3" />
          <span>Trending</span>
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-highlight-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => onQuickView(product)}
              className="bg-white text-gray-800 p-2 rounded-full hover:bg-primary-500 hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={handleCartAction}
              className="bg-white text-gray-800 p-2 rounded-full hover:bg-primary-500 hover:text-white transition-colors"
              title={isAuthenticated ? "Add to Cart" : "Sign in to add to cart"}
            >
              {isAuthenticated ? <ShoppingCart className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistAction}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-full shadow-lg hover:scale-110 transform"
          title={isAuthenticated ? (isInWishlist ? "Remove from wishlist" : "Add to wishlist") : "Sign in to add to wishlist"}
        >
          {isAuthenticated ? (
            <Heart 
              className={`h-4 w-4 ${isInWishlist ? 'fill-highlight-500 text-highlight-500' : 'text-gray-600'}`} 
            />
          ) : (
            <LogIn className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Vendor */}
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={product.vendor.avatar}
            alt={product.vendor.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer">
            {product.vendor.name}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={handleProductClick}
          className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-accent-500 text-accent-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product.stock} left
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;