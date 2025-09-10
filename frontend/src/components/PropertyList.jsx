import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import SkeletonCard from './SkeletonCard';
import PropertyCard from './PropertyCard';
import BookingModal from './BookingModal';
import Filters from './Filters';
import { Typography } from './ui';
import useAuthFetch from '../hooks/useAuthFetch';

const PropertyList = ({ onBook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    propertyType: ''
  });
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // track per property
  const [loading, setLoading] = useState(true); // Start with loading true
  const [properties, setProperties] = useState([]); // Now state-based
  const [bookingModal, setBookingModal] = useState({ isOpen: false, property: null });
  const { get } = useAuthFetch();

  // Fetch properties from API on component mount and when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split(' - ');
        if (min) params.append('min_price', min.replace('K', '000'));
        if (max) params.append('max_price', max.replace('K', '000'));
      }
      if (filters.propertyType) params.append('type', filters.propertyType);
      
      const response = await get(`/api/properties?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        toast.error('Failed to fetch properties');
        // Fallback to sample properties if API fails
        setProperties(sampleProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
      // Fallback to sample properties if API fails
      setProperties(sampleProperties);
    } finally {
      setLoading(false);
    }
  };

  // Sample properties for fallback (remove this after API is working)
  const sampleProperties = [
    {
      id: 1,
      name: '2 Bedroom Apartment',
      location: 'Nairobi',
      price: 45000,
      propertyType: 'Apartment',
      images: [
        'https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg',
        'https://i.pinimg.com/736x/bf/dc/99/bfdc994f338254356bcffe0dba331043.jpg',
        'https://i.pinimg.com/736x/95/3f/a5/953fa5c3b7d08fd3056d75d59bdc6701.jpg',
        'https://i.pinimg.com/736x/4d/74/91/4d749135ff9d06382ddab8be8df24ab9.jpg',
      ],
      available: true,
      isNew: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 2,
      name: '1 Bedroom Studio',
      location: 'Kilimani',
      price: 30000,
      propertyType: 'Studio',
      images: [
        'https://i.pinimg.com/736x/ce/c5/cf/cec5cf7a64b78eaa5c024dd28596120c.jpg',
        'https://i.pinimg.com/736x/d5/61/d3/d561d3aebc2d7db4098851c2c61f01ac.jpg',
        'https://i.pinimg.com/736x/d8/86/23/d88623ae05e01bf83a51317eaec7d730.jpg',
        'https://i.pinimg.com/736x/c7/42/83/c742839462aafb24caf56eca82cf0b74.jpg',
      ],
      available: false,
      amenities: ['Wi-Fi', 'Water Included'],
    },
    {
      id: 3,
      name: '3 Bedroom House',
      location: 'Westlands',
      price: 70000,
      propertyType: 'House',
      images: [
        'https://i.pinimg.com/736x/f0/ac/91/f0ac91b9c88b7376d913a427ce749825.jpg',
        'https://i.pinimg.com/736x/d7/fa/14/d7fa14163f07e93d3e311b6a91b00d07.jpg',
        'https://i.pinimg.com/736x/14/ed/ad/14edadd2ea8e21289d68202061d36551.jpg',
        'https://i.pinimg.com/736x/bd/8a/36/bd8a365f185433b1623946d97e347ca7.jpg',
      ],
      available: true,
      isFeatured: true,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 4,
      name: '4 Bedroom Mansion',
      location: 'Ngong',
      price: 85000,
      propertyType: 'Mansion',
      images: [
        'https://i.pinimg.com/736x/95/0d/f5/950df56507ba44d737bcbcc2a81819fe.jpg',
        'https://i.pinimg.com/736x/b8/8e/9e/b88e9e285fe604366acbccb49f65ad7c.jpg',
        'https://i.pinimg.com/736x/13/45/c7/1345c7ab56a190908323de42444cbac5.jpg',
        'https://i.pinimg.com/736x/0d/e4/52/0de4527e9ecd53b286c3359b9ef06003.jpg',
      ],
      available: false,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 5,
      name: '2 Bedroom Apartment',
      location: 'Kasarani',
      price: 60000,
      propertyType: 'Apartment',
      images: [
        'https://i.pinimg.com/736x/64/3b/5f/643b5fbdcbf9decd41e743ba0f1ba60d.jpg',
        'https://i.pinimg.com/736x/d5/97/9e/d5979ef2d75d75079cd7098713db9c5e.jpg',
        'https://i.pinimg.com/736x/71/d1/42/71d142cd08c73e85bc1893429a66ba56.jpg',
        'https://i.pinimg.com/736x/1b/04/41/1b04414e2a29da8f5d9aa8b5ea738ea7.jpg',
      ],
      available: true,
      amenities: ['Fully furnished', 'Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 6,
      name: '3 Bedroom Apartment',
      location: 'Rwaka',
      price: 64000,
      propertyType: 'Apartment',
      images: [
        'https://i.pinimg.com/736x/ef/a9/c1/efa9c18ac521f877f4eae4bb2b6df21e.jpg',
        'https://i.pinimg.com/736x/6b/2a/84/6b2a84fa2987ed1f9be0feb9f3ff685c.jpg',
        'https://i.pinimg.com/736x/36/ec/d4/36ecd46e886f097c7126306e264abd7b.jpg',
        'https://i.pinimg.com/736x/04/b9/11/04b9112c7c315412164720cb4e0ec592.jpg',
      ],
      available: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
    // Commercial Properties
    {
      id: 7,
      name: 'Modern Office Space',
      location: 'Westlands',
      price: 120000,
      propertyType: 'Office Space',
      images: [
        'https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg',
        'https://i.pinimg.com/736x/bf/dc/99/bfdc994f338254356bcffe0dba331043.jpg',
      ],
      available: true,
      isNew: true,
      amenities: ['Wi-Fi', 'Parking', 'Security', 'Reception'],
    },
    {
      id: 8,
      name: 'Retail Shop Space',
      location: 'Kilimani',
      price: 85000,
      propertyType: 'Shop',
      images: [
        'https://i.pinimg.com/736x/95/3f/a5/953fa5c3b7d08fd3056d75d59bdc6701.jpg',
        'https://i.pinimg.com/736x/4d/74/91/4d749135ff9d06382ddab8be8df24ab9.jpg',
      ],
      available: true,
      amenities: ['High Traffic', 'Parking', 'Storage', 'Security'],
    },
    {
      id: 9,
      name: 'Warehouse Facility',
      location: 'Industrial Area',
      price: 150000,
      propertyType: 'Warehouse',
      images: [
        'https://i.pinimg.com/736x/64/3b/5f/643b5fbdcbf9decd41e743ba0f1ba60d.jpg',
        'https://i.pinimg.com/736x/d5/97/9e/d5979ef2d75d75079cd7098713db9c5e.jpg',
      ],
      available: false,
      amenities: ['Loading Dock', 'Security', '24/7 Access', 'Parking'],
    },
  ];

  const handleExpressInterest = (property) => {
    setBookingModal({ isOpen: true, property });
  };

  const handleCloseBookingModal = () => {
    setBookingModal({ isOpen: false, property: null });
  };

  // Function to refresh properties from API
  const handleRefresh = async () => {
    await fetchProperties();
  };

  // Enhanced filtering and sorting logic
  const filtered = useMemo(() => {
    const filteredProperties = properties.filter((property) => {
      // Search query filter
      const searchMatch = !searchQuery || 
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.amenities && property.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      // Location filter
      const locationMatch = !filters.location || 
        property.location === filters.location;

      // Price range filter
      const priceMatch = !filters.priceRange || (() => {
        const price = property.price;
        switch (filters.priceRange) {
          case 'Under 30K': return price < 30000;
          case '30K - 50K': return price >= 30000 && price <= 50000;
          case '50K - 80K': return price > 50000 && price <= 80000;
          case '80K - 120K': return price > 80000 && price <= 120000;
          case 'Over 120K': return price > 120000;
          default: return true;
        }
      })();

      // Property type filter
      const typeMatch = !filters.propertyType || 
        property.property_type === filters.propertyType;

      return searchMatch && locationMatch && priceMatch && typeMatch;
    });

    // Sort by creation date (newest first) - newly posted properties appear at the top
    return filteredProperties.sort((a, b) => {
      // Handle both API properties (with created_at) and sample properties (with id as fallback)
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0); // Use epoch for sample properties
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      
      // Sort in descending order (newest first)
      return dateB - dateA;
    });
  }, [properties, searchQuery, filters]);

  // Filter change handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      priceRange: '',
      propertyType: ''
    });
  };

  const handleImageChange = (propertyId, newIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: newIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb]">
      {/* Filters Component */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Typography.Heading level={2} className="text-3xl font-bold text-[#003B4C] mb-2">
              Property Listings
            </Typography.Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
          </div>
          <Typography.BodyText variant="muted" className="text-lg text-[#007C99] font-medium">
            Discover your perfect home from our curated collection of properties
          </Typography.BodyText>
        </div>

        {/* Results Count */}
        <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏠</span>
              </div>
              <Typography.BodyText variant="muted" className="text-[#003B4C] font-medium">
                Showing <span className="font-bold text-[#007C99]">{filtered.length}</span> of <span className="font-bold text-[#007C99]">{properties.length}</span> properties
              </Typography.BodyText>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white rounded-xl font-medium hover:from-[#0088A3] hover:to-[#00A6C0] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          // Show skeleton cards while loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} type="property" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          // No results found
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Typography.Heading level={4} className="text-xl font-semibold text-[#003B4C] mb-3">
                No properties found
              </Typography.Heading>
              <Typography.BodyText variant="muted" className="text-[#007C99] mb-6">
                Try adjusting your search criteria or filters
              </Typography.BodyText>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-6 py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
            // Property cards grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBook={handleExpressInterest}
                currentImageIndex={currentImageIndex[property.id] || 0}
                onImageChange={handleImageChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={handleCloseBookingModal}
        property={bookingModal.property}
      />
    </div>
  );
};

export default PropertyList;