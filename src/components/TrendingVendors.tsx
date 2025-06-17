import React from 'react';
import { UserPlus, UserCheck, Star } from 'lucide-react';
import { Vendor } from '../types';

interface TrendingVendorsProps {
  vendors: Vendor[];
  onFollowVendor: (vendorId: string) => void;
}

const TrendingVendors: React.FC<TrendingVendorsProps> = ({ vendors, onFollowVendor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Trending Vendors</h3>
      <div className="space-y-4">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <img
                src={vendor.avatar}
                alt={vendor.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{vendor.name}</h4>
                <p className="text-sm text-gray-600">{vendor.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
                    <span className="text-sm text-gray-600">{vendor.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{vendor.followers} followers</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onFollowVendor(vendor.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                vendor.isFollowed
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {vendor.isFollowed ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingVendors;