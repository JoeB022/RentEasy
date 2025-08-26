import React, { useState } from 'react';

const ResponsiveImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder-property.jpg',
  sizes = '100vw',
  priority = false,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    } else {
      setFallbackError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageSrc = imageError ? fallbackSrc : src;
  const isPlaceholder = imageError || !src;
  
  // If fallback image also fails, show inline placeholder
  const [fallbackError, setFallbackError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`
          w-full h-full object-cover transition-all duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${isPlaceholder ? 'bg-gray-200' : ''}
          rounded-lg
        `}
        {...props}
      />
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {/* Fallback placeholder */}
      {(imageError || fallbackError) && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <svg 
              className="w-12 h-12 mx-auto mb-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
