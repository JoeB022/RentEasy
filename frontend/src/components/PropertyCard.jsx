import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import ResponsiveImage from './ResponsiveImage';
import { Button, Typography } from './ui';

const PropertyCard = ({ property, onBook, currentImageIndex = 0, onImageChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalImages = property.images?.length || 1;

  // Helper function to get amenity icon
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    const iconMap = {
      'wifi': '📶',
      'parking': '🚗',
      'balcony': '🏠',
      'garden': '🌱',
      'garage': '🏚️',
      'pool': '🏊',
      'gym': '💪',
      'security': '🔒',
      'furnished': '🪑',
      'water': '💧',
      'electricity': '⚡',
      'air conditioning': '❄️',
      'heating': '🔥',
      'elevator': '🛗',
      'doorman': '👨‍💼',
      'laundry': '👕',
      'storage': '📦',
      'pet friendly': '🐕',
      'smoking allowed': '🚬',
      'no smoking': '🚭'
    };
    
    // Try exact match first
    if (iconMap[amenityLower]) {
      return iconMap[amenityLower];
    }
    
    // Try partial matches
    for (const [key, icon] of Object.entries(iconMap)) {
      if (amenityLower.includes(key) || key.includes(amenityLower)) {
        return icon;
      }
    }
    
    // Default icon
    return '✨';
  };

  // Helper function to format amenity name
  const formatAmenityName = (amenity) => {
    // Convert snake_case or kebab-case to Title Case
    return amenity
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  // Helper function to safely parse amenities from JSON string
  const getAmenities = () => {
    console.log('PropertyCard - Property data:', property);
    console.log('PropertyCard - Amenities:', property.amenities);
    console.log('PropertyCard - Amenities type:', typeof property.amenities);
    
    if (!property.amenities) return [];
    
    try {
      // If it's already an array, return it
      if (Array.isArray(property.amenities)) {
        return property.amenities;
      }
      
      // If it's a JSON string, parse it
      if (typeof property.amenities === 'string') {
        const parsed = JSON.parse(property.amenities);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to parse amenities:', error);
      return [];
    }
  };

  // Check if amenities are still loading (being parsed)
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  
  useEffect(() => {
    if (property.amenities) {
      setAmenitiesLoading(true);
      // Simulate a brief loading state for better UX
      const timer = setTimeout(() => setAmenitiesLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [property.amenities]);

  const handlePrev = () => {
    if (onImageChange) {
      const newIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
      onImageChange(property.id, newIndex);
    }
  };

  const handleNext = () => {
    if (onImageChange) {
      const newIndex = currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1;
      onImageChange(property.id, newIndex);
    }
  };

  const getStatusBadge = () => {
    if (!property.available) {
      return { text: 'Rented', variant: 'error' };
    }
    if (property.isNew) {
      return { text: 'New', variant: 'success' };
    }
    if (property.isFeatured) {
      return { text: 'Featured', variant: 'accent' };
    }
    return { text: 'Available', variant: 'success' };
  };

  const statusBadge = getStatusBadge();

  const badgeClasses = {
    success: 'bg-success-100 text-success-700 border-success-300',
    error: 'bg-error-100 text-error-700 border-error-300',
    accent: 'bg-accent-100 text-accent-700 border-accent-300',
  };

  return (
    <Transition
      appear
      show={true}
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
    >
      <div
        className={`
          group relative bg-white rounded-xl border border-gray-200 overflow-hidden
          transition-all duration-300 ease-out cursor-pointer
          hover:shadow-xl hover:-translate-y-1 hover:border-primary-200
          ${isHovered ? 'shadow-xl -translate-y-1 border-primary-200' : 'shadow-md'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`
              inline-block px-2 py-1 text-xs font-medium rounded-full border
              ${badgeClasses[statusBadge.variant]}
            `}
          >
            {statusBadge.text}
          </span>
        </div>

        {/* GPS Indicator Badge */}
        {property.latitude && property.longitude && (
          <div className="absolute top-3 left-20 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-700 border-blue-300">
              📍 GPS
            </span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ResponsiveImage
            src={property.images?.[currentImageIndex] || property.images?.[0]}
            alt={`${property.name} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackSrc="/placeholder-property.jpg"
            priority={currentImageIndex === 0}
          />
          
          {/* Image Navigation */}
          {totalImages > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ◀
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ▶
              </Button>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{totalImages}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Location */}
          <Typography.Heading level={5} className="mb-2 text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
            {property.name}
          </Typography.Heading>
          
          <Typography.BodyText variant="muted" className="mb-3 flex items-center gap-1">
            📍 {property.location}
          </Typography.BodyText>

          {/* Property Description */}
          {property.description && (
            <Typography.BodyText variant="muted" className="mb-3 text-sm text-gray-600 line-clamp-2">
              {property.description}
            </Typography.BodyText>
          )}

          {/* Price */}
          <div className="mb-3">
            <Typography.Heading level={6} className="text-primary-600">
              KES {property.price?.toLocaleString()}/month
            </Typography.Heading>
          </div>

          {/* Amenities */}
          {(() => {
            const amenities = getAmenities();
            if (amenities.length === 0) return null;
            
            return (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 group/header">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center group-hover/header:scale-110 transition-transform duration-200">
                    <span className="text-white text-xs">✨</span>
                  </div>
                  <Typography.BodyText variant="muted" className="text-xs font-medium text-gray-600 group-hover/header:text-primary-600 transition-colors duration-200">
                    Amenities
                  </Typography.BodyText>
                </div>
                {amenitiesLoading ? (
                  // Loading skeleton
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="w-20 h-7 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 rounded-lg shadow-sm hover:shadow-md hover:shadow-primary-200/50 transition-all duration-200 hover:scale-105 animate-in slide-in-from-bottom-2 fade-in duration-300"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        {getAmenityIcon(amenity)}
                        {formatAmenityName(amenity)}
                      </span>
                    ))}
                    {amenities.length > 4 && (
                      <div className="relative group">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                          <span>➕</span>
                          +{amenities.length - 4} more
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {amenities.slice(4).map((amenity, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs">
                                {getAmenityIcon(amenity)}
                                {formatAmenityName(amenity)}
                              </span>
                            ))}
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Action Button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onBook(property);
            }}
            disabled={!property.available}
          >
            {property.available ? 'Book Now' : 'Currently Rented'}
          </Button>
        </div>
      </div>
    </Transition>
  );
};

export default PropertyCard;
