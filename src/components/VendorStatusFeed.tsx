import React from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { VendorStatus } from '../types';

interface VendorStatusFeedProps {
  statuses: VendorStatus[];
  onLikeStatus: (statusId: string) => void;
}

const VendorStatusFeed: React.FC<VendorStatusFeedProps> = ({ statuses, onLikeStatus }) => {
  return (
    <div className="space-y-6">
      {statuses.map((status) => (
        <div key={status.id} className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
          {/* Status Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img
                src={status.vendor.avatar}
                alt={status.vendor.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{status.vendor.name}</h4>
                <p className="text-sm text-gray-500">
                  {status.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Status Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-800">{status.content}</p>
          </div>

          {/* Status Image */}
          {status.image && (
            <div className="relative">
              <img
                src={status.image}
                alt="Status"
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Status Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onLikeStatus(status.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-highlight-500 transition-colors"
                >
                  <Heart 
                    className={`h-6 w-6 ${status.isLiked ? 'fill-highlight-500 text-highlight-500' : ''}`} 
                  />
                  <span className="font-medium">{status.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Share className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">{status.likes} likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorStatusFeed;