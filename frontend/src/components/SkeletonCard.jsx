import React from 'react';

const SkeletonCard = ({ type = 'property' }) => {
  if (type === 'property') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        
        {/* Content placeholder */}
        <div className="p-4 space-y-3">
          {/* Title placeholder */}
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          
          {/* Location placeholder */}
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          
          {/* Price placeholder */}
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
          
          {/* Amenities placeholder */}
          <div className="flex gap-2">
            <div className="h-2 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-14" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {/* Header placeholder */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4" />
        
        {/* Content placeholders */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonCard;
