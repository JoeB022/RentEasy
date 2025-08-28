import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import ResponsiveImage from './ResponsiveImage';
import { Button, Typography } from './ui';

const PropertyCard = ({ property, onBook, currentImageIndex = 0, onImageChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalImages = property.images?.length || 1;

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

          {/* Price */}
          <div className="mb-3">
            <Typography.Heading level={6} className="text-primary-600">
              KES {property.price?.toLocaleString()}/month
            </Typography.Heading>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-md">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

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
