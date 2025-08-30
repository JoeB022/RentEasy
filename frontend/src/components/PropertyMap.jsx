import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

const PropertyMap = ({ 
  latitude, 
  longitude, 
  onLocationChange, 
  locationName = '',
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: latitude, lng: longitude });
  const mapRef = useRef(null);

  // Update map URL when coordinates change
  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      // Using OpenStreetMap with Leaflet-style URL for free map tiles
      const zoom = 15;
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;
      setMapUrl(url);
    }
  }, [coordinates.lat, coordinates.lng]);

  // Initialize coordinates from props
  useEffect(() => {
    if (latitude && longitude) {
      setCoordinates({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCoordinates({ lat, lng });
        setIsLoading(false);
        
        // Reverse geocoding to get location name
        reverseGeocode(lat, lng);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions or enter location manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please try again or enter location manually.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again or enter location manually.');
            break;
          default:
            setError('An unknown error occurred. Please enter location manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Extract city/area name from the full address
        const addressParts = data.display_name.split(', ');
        const city = addressParts[addressParts.length - 3] || addressParts[addressParts.length - 2] || 'Unknown Location';
        
        // Notify parent component of location name
        if (onLocationChange) {
          onLocationChange(lat, lng, city);
        }
      }
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      // Continue without reverse geocoding
    }
  };

  const handleManualLocation = () => {
    // Allow user to click on map to set location manually
    // For now, we'll just clear the error
    setError('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {isLoading ? 'Getting Location...' : 'Set Location'}
        </button>

        {coordinates.lat && coordinates.lng && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-medium">Location Error</p>
            <p>{error}</p>
            <button
              onClick={handleManualLocation}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Enter location manually
            </button>
          </div>
        </div>
      )}

      {/* Map Display */}
      {coordinates.lat && coordinates.lng && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">
              Property Location
              {locationName && (
                <span className="ml-2 text-gray-500">• {locationName}</span>
              )}
            </h3>
          </div>
          <div className="relative">
            <iframe
              ref={mapRef}
              src={mapUrl}
              title="Property Location Map"
              className="w-full h-64 border-0"
              loading="lazy"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-primary-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Inputs for Form Submission */}
      <input
        type="hidden"
        name="latitude"
        value={coordinates.lat || ''}
      />
      <input
        type="hidden"
        name="longitude"
        value={coordinates.lng || ''}
      />
    </div>
  );
};

export default PropertyMap;
