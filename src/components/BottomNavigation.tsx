import React from 'react';
import { Home, Heart, ShoppingCart, User, Store, Package, BarChart3, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemsCount: number;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, cartItemsCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Buyer navigation tabs
  const buyerTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'vendors', label: 'Vendors', icon: Store, path: '/vendors' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart', badge: cartItemsCount },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  // Vendor navigation tabs
  const vendorTabs = [
    { id: 'home', label: 'Store', icon: Home, path: '/' },
    { id: 'products', label: 'Products', icon: Package, path: '/vendor/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/vendor/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/vendor/dashboard' },
  ];

  // Admin navigation tabs (minimal since they primarily use dashboard)
  const adminTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/admin/dashboard' },
  ];

  // Default tabs for non-authenticated users
  const guestTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'login', label: 'Sign In', icon: User, path: '/login' },
  ];

  // Select appropriate tabs based on user role
  const getTabs = () => {
    if (!isAuthenticated) return guestTabs;
    
    switch (user?.role) {
      case 'vendor':
        return vendorTabs;
      case 'admin':
        return adminTabs;
      case 'buyer':
      default:
        return buyerTabs;
    }
  };

  const tabs = getTabs();

  const handleTabClick = (tab: any) => {
    onTabChange(tab.id);
    if (tab.path) {
      navigate(tab.path);
    }
  };

  const getCurrentActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/vendors') return 'vendors';
    if (location.pathname === '/wishlist') return 'wishlist';
    if (location.pathname === '/cart') return 'cart';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/login') return 'login';
    if (location.pathname === '/vendor/dashboard') return user?.role === 'vendor' ? 'products' : 'dashboard';
    if (location.pathname === '/admin/dashboard') return 'dashboard';
    return activeTab;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = getCurrentActiveTab() === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 relative ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;