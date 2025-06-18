import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartItemsCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/login');
    }
    setShowUserDropdown(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button onClick={handleLogoClick}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-highlight-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  MarketPlace Pro
                </h1>
              </button>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation - Role-based */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Authenticated buyer navigation */}
            {isAuthenticated && user?.role === 'buyer' && (
              <>
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                  title="Wishlist"
                >
                  <Heart className="h-6 w-6" />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative" title="Notifications">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-highlight-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Guest navigation - cart only */}
            {!isAuthenticated && (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                  title="Sign in to access cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {/* Vendor-specific navigation */}
            {user?.role === 'vendor' && (
              <>
                <button 
                  onClick={() => navigate('/vendor/dashboard')}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-highlight-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </button>
              </>
            )}
            
            {/* Admin-specific navigation */}
            {user?.role === 'admin' && (
              <>
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    12
                  </span>
                </button>
              </>
            )}
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg"
              >
                {isAuthenticated && user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                {isAuthenticated && (
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.name?.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {user?.role && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded-full capitalize">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {user?.role === 'vendor' ? 'Vendor Dashboard' : 
                         user?.role === 'admin' ? 'Admin Dashboard' : 'Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          navigate('/register');
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-primary-600 hover:bg-primary-50"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <div className="flex items-center justify-around py-4">
              {/* Authenticated buyer mobile navigation */}
              {isAuthenticated && user?.role === 'buyer' && (
                <>
                  <button 
                    onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }}
                    className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Heart className="h-6 w-6 mb-1" />
                    <span className="text-xs">Wishlist</span>
                  </button>
                  <button className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors relative">
                    <Bell className="h-6 w-6 mb-1" />
                    <span className="text-xs">Notifications</span>
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-highlight-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <button 
                    onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}
                    className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors relative"
                  >
                    <ShoppingCart className="h-6 w-6 mb-1" />
                    <span className="text-xs">Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Guest mobile navigation - cart only */}
              {!isAuthenticated && (
                <button 
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors relative"
                >
                  <ShoppingCart className="h-6 w-6 mb-1" />
                  <span className="text-xs">Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Vendor-specific mobile navigation */}
              {user?.role === 'vendor' && (
                <>
                  <button 
                    onClick={() => { navigate('/vendor/dashboard'); setIsMenuOpen(false); }}
                    className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Bell className="h-6 w-6 mb-1" />
                    <span className="text-xs">Orders</span>
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-highlight-500 text-white text-xs rounded-full flex items-center justify-center">
                      5
                    </span>
                  </button>
                </>
              )}

              {/* Admin-specific mobile navigation */}
              {user?.role === 'admin' && (
                <>
                  <button 
                    onClick={() => { navigate('/admin/dashboard'); setIsMenuOpen(false); }}
                    className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors relative"
                  >
                    <Bell className="h-6 w-6 mb-1" />
                    <span className="text-xs">Alerts</span>
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      12
                    </span>
                  </button>
                </>
              )}

              {/* Common profile button for all users */}
              <button 
                onClick={() => { 
                  if (isAuthenticated) {
                    handleProfileClick();
                  } else {
                    navigate('/login');
                  }
                  setIsMenuOpen(false); 
                }}
                className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                {isAuthenticated && user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover mb-1"
                  />
                ) : (
                  <User className="h-6 w-6 mb-1" />
                )}
                <span className="text-xs">
                  {isAuthenticated ? (user?.role === 'vendor' ? 'Dashboard' : user?.role === 'admin' ? 'Admin' : 'Profile') : 'Sign In'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;