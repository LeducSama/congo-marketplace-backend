import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductMosaicProps {
  products: Product[];
  title: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

const ProductMosaic: React.FC<ProductMosaicProps> = ({
  products,
  title,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <button className="text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      {/* Instagram-style Mosaic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={wishlist.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductMosaic;