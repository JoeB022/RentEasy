import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, AlertCircle, Search, X } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
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

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Location search failed:', error);
      setError('Failed to search for location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setCoordinates({ lat, lng });
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowSearch(false);
    
    if (onLocationChange) {
      onLocationChange(lat, lng, result.display_name);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocation(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleManualLocation = () => {
    // Allow user to click on map to set location manually
    // For now, we'll just clear the error
    setError('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">
            Search for Property Location
          </label>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Enter property address, city, or landmark..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSearchResult(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{result.display_name}</div>
                {result.address && (
                  <div className="text-sm text-gray-500">
                    {result.address.city || result.address.town || result.address.village || ''}
                    {result.address.state && `, ${result.address.state}`}
                    {result.address.country && `, ${result.address.country}`}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {isLoading ? 'Getting Location...' : 'Use My Current Location'}
        </button>

        <div className="text-sm text-gray-500">
          or search for the property location above
        </div>

        {coordinates.lat && coordinates.lng && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Clear Location Button */}
      {coordinates.lat && coordinates.lng && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            ✓ Location set successfully
          </div>
          <button
            type="button"
            onClick={() => {
              setCoordinates({ lat: null, lng: null });
              setSearchQuery('');
              setSearchResults([]);
              if (onLocationChange) {
                onLocationChange(null, null, '');
              }
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Clear Location
          </button>
        </div>
      )}

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
              Search for location instead
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
                <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
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
