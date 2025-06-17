import React from 'react';
import { Plus } from 'lucide-react';
import { Vendor } from '../types';

interface VendorStatusRingProps {
  vendors: Vendor[];
}

const VendorStatusRing: React.FC<VendorStatusRingProps> = ({ vendors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {/* Add Status Button - Only for vendors */}
        <div className="flex-shrink-0 text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-600 mt-2 block">Your Story</span>
        </div>

        {/* Vendor Status Rings */}
        {vendors.map((vendor) => (
          <div key={vendor.id} className="flex-shrink-0 text-center">
            <div className="relative">
              {/* Status Ring */}
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-accent-500 via-highlight-500 to-primary-500 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Online Indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xs text-gray-600 mt-2 block truncate w-16">
              {vendor.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorStatusRing;