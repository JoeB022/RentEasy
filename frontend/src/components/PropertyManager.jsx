import React, { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  Search,
  DollarSign,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALL_PROPERTY_TYPES } from '../utils/propertyTypes';
import PropertyMap from './PropertyMap';
import useAuthFetch from '../hooks/useAuthFetch';

const PropertyManager = () => {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    price: '',
    bedrooms: '',
    bathrooms: '1',
    property_type: '',
    description: '',
    amenities: [],
    available: true,
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [loading, setLoading] = useState(false);

  const { post, put, delete: del, get } = useAuthFetch();

  // Fetch landlord's properties on component mount
  useEffect(() => {
    fetchLandlordProperties();
  }, []);

  const fetchLandlordProperties = async () => {
    try {
      setLoading(true);
      const response = await get('/api/landlord/properties');
      if (response.ok) {
        const data = await response.json();
        setListings(data.properties || []);
      } else {
        toast.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((images) =>
      setFormData((prev) => ({ ...prev, images }))
    );
  };

  const handleLocationChange = (lat, lng, locationName = '') => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: locationName || prev.location
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, location, price, bedrooms, property_type } = formData;
    
    if (!name || !location || !price || !bedrooms || !property_type) {
      return toast.error('Please fill all required fields.');
    }

    // Location coordinates are optional - property can be posted without precise coordinates
    if (!formData.latitude || !formData.longitude) {
      console.log('Property will be posted without precise coordinates');
    }

    console.log('Submitting property data:', formData);
    console.log('Using API endpoint:', editingId ? `/api/landlord/properties/${editingId}` : '/api/landlord/properties');

    try {
      setLoading(true);

    if (editingId) {
        // Update existing property
        const response = await put(`/api/landlord/properties/${editingId}`, formData);
        if (response.ok) {
          const updatedProperty = await response.json();
      setListings((prev) =>
        prev.map((item) =>
              item.id === editingId ? updatedProperty.property : item
            )
          );
          toast.success('Property updated successfully');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to update property');
        }
    } else {
        // Create new property
        console.log('Making POST request to /api/landlord/properties');
        const response = await post('/api/landlord/properties', formData);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          const newProperty = await response.json();
          console.log('Property created successfully:', newProperty);
          setListings(prev => [newProperty.property, ...prev]);
      const locationInfo = formData.latitude && formData.longitude 
        ? ` with precise coordinates (${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)})`
        : ' (location set by address only)';
          toast.success(`Property added successfully${locationInfo}`);
        } else {
          const error = await response.json();
          console.error('Property creation failed:', error);
          toast.error(error.error || 'Failed to create property');
        }
    }

    resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setFormData({
      id: property.id,
      name: property.name,
      location: property.location,
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms?.toString() || '1',
      property_type: property.property_type,
      description: property.description || '',
      amenities: property.amenities || [],
      available: property.available,
      images: property.images || [],
    });
    setEditingId(property.id);
  };

  const handleDelete = async (propertyId) => {
    try {
      setLoading(true);
      const response = await del(`/api/landlord/properties/${propertyId}`);
      
      if (response.ok) {
        setListings((prev) => prev.filter((item) => item.id !== propertyId));
        toast.success('Property deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      handleDelete(confirmDeleteId);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      price: '',
      bedrooms: '',
      bathrooms: '1',
      property_type: '',
      description: '',
      amenities: [],
      available: true,
      images: [],
    });
    setEditingId(null);
  };

  const filteredListings = listings.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchAvailability =
      availabilityFilter === 'all'
        ? true
        : availabilityFilter === 'available'
        ? item.available
        : !item.available;
    return matchSearch && matchAvailability;
  });

  const openGallery = (images, index = 0) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const nextImage = () =>
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);

  const prevImage = () =>
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowGallery(false);
    }
  };

  useEffect(() => {
    if (showGallery) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showGallery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-white to-[#f8fafc] p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#003B4C] mb-2">
                Property Manager
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#007C99]">
                  {listings.length}
                </div>
                <div className="text-sm text-[#003B4C]">Total Properties</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-2xl flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
            </div>
        </div>
          <p className="text-lg text-[#007C99] font-medium">
            Manage your property portfolio, add new listings, and track performance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Property Form */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#003B4C]">
                {editingId ? 'Edit Property' : 'Add New Property'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Property Name *
                </label>
          <input
            type="text"
            value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                  placeholder="Enter property name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Location *
                </label>
          <input
            type="text"
            value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                  placeholder="Enter location"
                  required
                />
                <p className="mt-1 text-xs text-[#007C99]">
                  💡 Tip: Search for the property location below or use your current location for precise coordinates
                </p>
          </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-2">
                    Price (KES) *
                  </label>
          <input
            type="number"
            value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-2">
                    Property Type *
                  </label>
          <select
                    value={formData.property_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select type</option>
            {ALL_PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-2">
                    Bathrooms
                  </label>
          <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                  placeholder="Describe the property..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Wi-Fi', 'Parking', 'Balcony', 'Garden', 'Garage', 
                    'Swimming Pool', 'Gym', 'Security', 'Fully Furnished', 'Water Included'
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              amenities: prev.amenities.filter(a => a !== amenity)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-[#007C99] focus:ring-[#007C99]"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Images
                </label>
          <input
            type="file"
                  multiple
            accept="image/*"
            onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Property Map for Geolocation */}
              <div>
                <label className="block text-sm font-medium text-[#003B4C] mb-2">
                  Property Location
                </label>
                {formData.latitude && formData.longitude && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <MapPin className="w-4 h-4" />
                    <span>Location coordinates set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</span>
                  </div>
                )}
                <PropertyMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={handleLocationChange}
                  locationName={formData.location}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                />
              </div>

              <div className="flex items-center gap-3">
            <input
              type="checkbox"
                  id="available"
              checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-5 h-5 text-[#007C99] bg-white border-gray-300 rounded focus:ring-[#007C99] focus:ring-2"
            />
                <label htmlFor="available" className="text-sm font-medium text-[#003B4C]">
                  Available for rent
          </label>
        </div>

              <div className="flex gap-3 pt-4">
        <button
          type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] hover:from-[#0088A3] hover:to-[#00A6C0] text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Building2 size={20} />
          {editingId ? 'Update Property' : 'Add Property'}
                    </>
                  )}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
        </button>
                )}
              </div>
      </form>
          </div>
        </div>

        {/* Property Listings */}
        <div className="lg:col-span-2">
          {/* Search and Filters */}
          <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007C99] focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Properties</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>
          </div>

      {/* Listings */}
          {loading && listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-[#003B4C] font-medium">Loading properties...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
                No properties found
              </h3>
              <p className="text-[#007C99] mb-6">
                {search || availabilityFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Start by adding your first property using the form on the left'
                }
              </p>
              {!search && availabilityFilter === 'all' && (
                <button
                  onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-[#007C99] to-[#0099B3] hover:from-[#0088A3] hover:to-[#00A6C0] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Add Your First Property
                </button>
              )}
            </div>
          ) : (
        <div className="space-y-6">
          {filteredListings.map((property) => {
                const featureList = property.amenities && property.amenities.length > 0
                  ? property.amenities
                  : ['No features listed'];

            return (
                  <div key={property.id} className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl border border-white/50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                    <div className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] px-6 py-4 flex justify-between items-center border-b border-white/50">
                      <div className="flex items-center gap-3 text-[#003B4C] font-bold">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                          <MapPin className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-lg">{property.name}</div>
                          <div className="text-sm text-[#007C99] font-medium">{property.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#007C99]">
                            KES {property.price?.toLocaleString()}
                          </div>
                          <div className="text-sm text-[#003B4C]">per month</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <BedDouble className="text-[#007C99]" size={20} />
                          <span className="text-[#003B4C] font-medium">{property.bedrooms} BR</span>
                        </div>
                        {property.latitude && property.longitude && (
                          <div className="flex items-center gap-2 text-xs text-[#007C99] bg-[#007C99]/10 px-2 py-1 rounded-lg">
                            <MapPin className="w-3 h-3" />
                            <span>Location Set</span>
                  </div>
                        )}
                  </div>
                </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-[#003B4C] mb-3">Property Details</h4>
                          <div className="space-y-2 text-sm text-[#007C99]">
                            <div><span className="font-medium">Type:</span> {property.property_type}</div>
                            <div><span className="font-medium">Bedrooms:</span> {property.bedrooms}</div>
                            <div><span className="font-medium">Bathrooms:</span> {property.bathrooms || 1}</div>
                            {property.description && (
                              <div><span className="font-medium">Description:</span> {property.description}</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003B4C] mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                            {featureList.map((feature, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gradient-to-r from-[#007C99]/10 to-[#0099B3]/10 text-[#007C99] text-xs rounded-lg border border-[#007C99]/20"
                              >
                                {feature}
                      </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Location Coordinates */}
                    {property.latitude && property.longitude && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-[#003B4C] mb-3">Location Coordinates</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-[#007C99] bg-gradient-to-r from-[#007C99]/10 to-[#0099B3]/10 p-3 rounded-lg border border-[#007C99]/20">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                      </span>
                            </div>
                            <div className="bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                                title="Property Location"
                                className="w-full h-24 border-0"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {property.images && property.images.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-[#003B4C] mb-3">Images</h4>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {property.images.slice(0, 4).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${property.name} ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
                                onClick={() => openGallery(property.images, index)}
                        />
                      ))}
                            {property.images.length > 4 && (
                              <div className="w-20 h-20 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:from-[#0088A3] hover:to-[#00A6C0] transition-all duration-300">
                                +{property.images.length - 4}
                              </div>
                            )}
                          </div>
                    </div>
                  )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${property.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-medium ${property.available ? 'text-green-600' : 'text-red-600'}`}>
                            {property.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] hover:from-[#0088A3] hover:to-[#00A6C0] text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(property.id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <X size={24} />
            </button>
            
            <div className="relative">
              <img
                src={galleryImages[galleryIndex]}
                alt={`Gallery ${galleryIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center mt-4 text-white">
              {galleryIndex + 1} of {galleryImages.length}
                </div>
              </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#003B4C] mb-4">Confirm Delete</h3>
            <p className="text-[#007C99] mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Deleting...' : 'Delete Property'}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
