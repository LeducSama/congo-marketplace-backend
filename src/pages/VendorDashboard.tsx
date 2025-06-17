import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Users, 
  Eye, 
  Plus,
  TrendingUp,
  ShoppingBag,
  Star,
  Calendar,
  Camera,
  Video,
  Image,
  Send,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataService from '../services/dataService';

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState('');

  // Mock vendor data
  const vendorStats = {
    totalProducts: 15,
    totalSales: 8420,
    totalRevenue: 45280.50,
    followers: 1890,
    averageRating: 4.6,
    ordersThisMonth: 124,
    recentOrders: [
      { id: '001', customer: 'John Doe', amount: 149.99, status: 'shipped', date: '2024-01-25' },
      { id: '002', customer: 'Jane Smith', amount: 89.99, status: 'processing', date: '2024-01-24' },
      { id: '003', customer: 'Mike Johnson', amount: 259.98, status: 'delivered', date: '2024-01-23' },
    ],
    topProducts: [
      { name: 'Wireless Earbuds Pro', sales: 234, revenue: 34980, rating: 4.7 },
      { name: 'Gaming Keyboard', sales: 156, revenue: 20280, rating: 4.9 },
      { name: 'Wireless Charging Pad', sales: 89, revenue: 3560, rating: 4.5 },
    ]
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      shipped: 'bg-blue-100 text-blue-600',
      processing: 'bg-yellow-100 text-yellow-600',
      delivered: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-600';
  };

  const handleCreateStory = async () => {
    if (storyText.trim() || storyImage) {
      try {
        await DataService.createVendorStory(user?.id || '1', storyText, storyImage);
        console.log('Story created successfully');
        setStoryText('');
        setStoryImage('');
        setShowStoryCreator(false);
      } catch (error) {
        console.error('Failed to create story:', error);
      }
    }
  };

  const sampleImages = [
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowStoryCreator(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Create Story</span>
              </button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'stories', label: 'Stories', icon: Camera },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'analytics', label: 'Analytics', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{vendorStats.totalProducts}</p>
                    <p className="text-sm text-gray-600">Total Products</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">${vendorStats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{vendorStats.totalSales}</p>
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{vendorStats.followers}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {vendorStats.recentOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">#{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">${order.amount}</p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {vendorStats.topProducts.map((product, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">{product.sales} sales</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">${product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">My Products</h3>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Product management interface would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: Add, edit, delete products, manage inventory, update pricing</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Order management interface would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: View orders, update status, manage fulfillment, track shipments</p>
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Your Stories</h3>
                <button 
                  onClick={() => setShowStoryCreator(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Story</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Active Stories */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">New Tech Arrivals</p>
                  <p className="text-xs opacity-80">234 views • 2h ago</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white text-center">
                  <Video className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Behind the Scenes</p>
                  <p className="text-xs opacity-80">189 views • 4h ago</p>
                </div>
                
                {/* Create New Story */}
                <button 
                  onClick={() => setShowStoryCreator(true)}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">Create Story</p>
                </button>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Story Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">423</p>
                        <p className="text-sm text-gray-600">Total Views Today</p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">89%</p>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">12</p>
                        <p className="text-sm text-gray-600">New Followers</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Analytics & Insights</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Analytics dashboard would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: Sales charts, customer insights, product performance, revenue trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Story Creator Modal */}
      {showStoryCreator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Create Story</h3>
              <button 
                onClick={() => setShowStoryCreator(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Story Preview */}
            <div className="p-4">
              <div className="bg-gray-100 rounded-xl aspect-[9/16] mb-4 overflow-hidden relative">
                {storyImage ? (
                  <img 
                    src={storyImage} 
                    alt="Story preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Choose an image for your story</p>
                    </div>
                  </div>
                )}
                
                {/* Text Overlay */}
                {storyText && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-lg font-medium bg-black/50 p-3 rounded-lg">
                      {storyText}
                    </p>
                  </div>
                )}
              </div>

              {/* Image Selection */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Choose Background</h4>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setStoryImage(image)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        storyImage === image ? 'border-purple-500' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Text
                </label>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="What's happening in your store today?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{storyText.length}/150 characters</p>
              </div>

              {/* Story Templates */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "🆕 New products just arrived! Check them out!",
                    "🔥 Limited time offer - don't miss out!",
                    "🎯 Behind the scenes at our workshop",
                    "📦 Just shipped another order - thank you!"
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setStoryText(template)}
                      className="text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStoryCreator(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStory}
                  disabled={!storyText.trim() && !storyImage}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Share Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;