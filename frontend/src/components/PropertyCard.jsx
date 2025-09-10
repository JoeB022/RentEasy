import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { ChevronLeft, ChevronRight, MapPin, BedDouble, Bath, Heart, Share2, ExternalLink } from 'lucide-react';
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

  const handleLocationClick = () => {
    if (property.latitude && property.longitude) {
      // Use precise coordinates if available
      const url = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(url, '_blank');
    } else if (property.location) {
      // Use location name as fallback
      const encodedLocation = encodeURIComponent(property.location);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      window.open(url, '_blank');
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
    success: 'bg-success-100 text-success-700 border-success-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    accent: 'bg-accent-100 text-accent-700 border-accent-200',
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
          group relative bg-white rounded-xl border border-secondary-200 overflow-hidden
          transition-all duration-300 ease-out cursor-pointer
          hover:shadow-large hover:-translate-y-1 hover:border-primary-200
          ${isHovered ? 'shadow-large -translate-y-1 border-primary-200' : 'shadow-soft'}
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

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images?.[currentImageIndex] || property.images?.[0] || '/placeholder-property.jpg'}
            alt={`${property.name} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
              <div className="absolute bottom-2 right-2 bg-secondary-900/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                {currentImageIndex + 1}/{totalImages}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Location */}
          <Typography.Heading level={5} className="mb-2 group-hover:text-primary-600 transition-colors duration-200">
            {property.name}
          </Typography.Heading>
          
          <div 
            className="mb-3 flex items-center justify-between cursor-pointer hover:text-primary-600 transition-all duration-200 group/location p-2 rounded-lg hover:bg-primary-50 border border-primary-200 hover:border-primary-300 hover:shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLocationClick();
            }}
            title="Click to view on map"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500 group-hover/location:text-primary-600 transition-colors duration-200" />
              <Typography.BodyText variant="muted" className="group-hover/location:text-primary-600 transition-colors duration-200">
                {property.location}
              </Typography.BodyText>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/location:opacity-100 transition-opacity duration-200">
              <Typography.Caption className="text-primary-500 font-medium">View Map</Typography.Caption>
              <ExternalLink className="w-3 h-3 text-primary-500" />
            </div>
          </div>

          {/* Price */}
          <div className="mb-3">
            <Typography.Heading level={6} className="text-primary-600">
              KES {property.price?.toLocaleString()}/month
            </Typography.Heading>
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-primary-500" />
              <Typography.BodyText size="sm" variant="muted" className="font-medium">
                {property.bedrooms || 'N/A'}
              </Typography.BodyText>
              <Typography.Caption className="text-gray-500">
                bedroom{property.bedrooms !== 1 ? 's' : ''}
              </Typography.Caption>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-primary-500" />
              <Typography.BodyText size="sm" variant="muted" className="font-medium">
                {property.bathrooms || 'N/A'}
              </Typography.BodyText>
              <Typography.Caption className="text-gray-500">
                bathroom{property.bathrooms !== 1 ? 's' : ''}
              </Typography.Caption>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded-md font-medium"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-secondary-100 text-secondary-500 rounded-md font-medium">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="mb-4">
              <Typography.BodyText size="sm" variant="muted" className="line-clamp-2">
                {property.description}
              </Typography.BodyText>
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