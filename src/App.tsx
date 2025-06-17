import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import VendorsFollowPage from './pages/VendorsFollowPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Product, CartItem } from './types';
import DataService from './services/dataService';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Load initial data
  useEffect(() => {
    loadCartAndWishlist();
  }, []);

  const loadCartAndWishlist = async () => {
    try {
      const cartItems = await DataService.getCartItems();
      const wishlistIds = await DataService.getWishlistProductIds();
      const itemCount = await DataService.getCartItemsCount();
      
      setCart(cartItems);
      setWishlist(wishlistIds);
      setCartItemsCount(itemCount);
    } catch (error) {
      console.error('Failed to load cart and wishlist:', error);
    }
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`;
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await DataService.addToCart(product, 1);
      await loadCartAndWishlist(); // Refresh cart data
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleUpdateCartQuantity = async (itemId: string, quantity: number) => {
    try {
      await DataService.updateCartQuantity(itemId, quantity);
      await loadCartAndWishlist(); // Refresh cart data
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await DataService.removeFromCart(itemId);
      await loadCartAndWishlist(); // Refresh cart data
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      await DataService.toggleWishlist(productId);
      await loadCartAndWishlist(); // Refresh wishlist data
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };


  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header cartItemsCount={cartItemsCount} />
          
          <main className="flex-1">
            <Routes>
              {/* Public routes - no auth required */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Public routes - available to all */}
            <Route
              path="/"
              element={
                <HomePage
                  onQuickView={handleQuickView}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                />
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['buyer']}>
                  <VendorsFollowPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['buyer']}>
                  <CartPage
                    cart={cart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onRemoveItem={handleRemoveFromCart}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['buyer']}>
                  <WishlistPage
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetailPage
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage
                  onQuickView={handleQuickView}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['buyer', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cartItemsCount={cartItemsCount}
        />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;