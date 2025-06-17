import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const adminStats = {
    totalUsers: 15420,
    totalVendors: 342,
    totalOrders: 8920,
    totalRevenue: 284500.75,
    pendingApprovals: 12,
    activeDisputes: 3,
    recentUsers: [
      { id: '1', name: 'John Smith', email: 'john@example.com', role: 'buyer', status: 'active', joinDate: '2024-01-20' },
      { id: '2', name: 'TechCorp Inc', email: 'contact@techcorp.com', role: 'vendor', status: 'pending', joinDate: '2024-01-19' },
      { id: '3', name: 'Jane Doe', email: 'jane@example.com', role: 'buyer', status: 'active', joinDate: '2024-01-18' },
    ],
    recentVendors: [
      { id: '2', name: 'TechCorp Inc', email: 'contact@techcorp.com', products: 25, sales: 12400, status: 'approved' },
      { id: '4', name: 'Fashion Hub', email: 'info@fashionhub.com', products: 18, sales: 8900, status: 'pending' },
      { id: '5', name: 'Home Essentials', email: 'hello@homeessentials.com', products: 32, sales: 15600, status: 'approved' },
    ]
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-600',
      pending: 'bg-yellow-100 text-yellow-600',
      suspended: 'bg-red-100 text-red-600',
      approved: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-600';
  };

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
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{adminStats.pendingApprovals} Pending</span>
              </span>
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
                { id: 'users', label: 'Users', icon: Users },
                { id: 'vendors', label: 'Vendors', icon: Store },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'settings', label: 'Settings', icon: Settings }
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
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{adminStats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Store className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{adminStats.totalVendors}</p>
                    <p className="text-sm text-gray-600">Active Vendors</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">${adminStats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{adminStats.totalOrders.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {adminStats.recentUsers.map((user) => (
                    <div key={user.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.joinDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Vendors */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Vendor Applications</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {adminStats.recentVendors.map((vendor) => (
                    <div key={vendor.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{vendor.name}</p>
                          <p className="text-sm text-gray-600">{vendor.products} products • ${vendor.sales.toLocaleString()} sales</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(vendor.status)}`}>
                            {vendor.status}
                          </span>
                          {vendor.status === 'pending' && (
                            <div className="flex space-x-1">
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <UserCheck className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                <UserX className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminStats.recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs content placeholders */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Vendor Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Vendor management interface would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: Approve vendors, manage vendor profiles, view vendor performance</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Order management interface would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: View all orders, resolve disputes, manage refunds</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">System settings interface would go here...</p>
              <p className="text-sm text-gray-500 mt-2">Features: Platform configuration, payment settings, security policies</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;