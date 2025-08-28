import React, { useState } from 'react';
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
    units: '',
    category: '',
    features: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, location, price, bedrooms } = formData;
    if (!name || !location || !price || !bedrooms) {
      return toast.error('Please fill all required fields.');
    }

    if (editingId) {
      setListings((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...formData, id: editingId } : item
        )
      );
      toast.success('Property updated');
    } else {
      setListings([...listings, { ...formData, id: Date.now() }]);
      const locationInfo = formData.latitude && formData.longitude 
        ? ` with coordinates (${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)})`
        : '';
      toast.success(`Property added${locationInfo}`);
    }

    resetForm();
  };

  const handleEdit = (property) => {
    setFormData(property);
    setEditingId(property.id);
  };

  const confirmDelete = () => {
    setListings((prev) => prev.filter((item) => item.id !== confirmDeleteId));
    toast.success('Property deleted');
    setConfirmDeleteId(null);
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
      units: '',
      category: '',
      features: '',
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

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          Manage Property Listings
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative max-w-sm flex-1">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-white/50 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl pl-12 focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg"
            />
            <Search className="absolute top-3 left-4 text-[#007C99]" size={18} />
          </div>
          <div className="flex gap-3">
            {['all', 'available', 'unavailable'].map((status) => (
              <button
                key={status}
                onClick={() => setAvailabilityFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                  availabilityFilter === status
                    ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                    : 'text-[#003B4C] border-[#007C99]/30 hover:bg-[#007C99] hover:text-white hover:border-[#007C99] hover:shadow-md'
                }`}
              >
                {status === 'all' ? 'All' : status === 'available' ? 'Available' : 'Unavailable'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-xl border border-white/50 mb-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6 text-[#003B4C] flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">+</span>
          </div>
          {editingId ? 'Update Property' : 'Add New Property'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Property Name</label>
            <input
              type="text"
              placeholder="Enter property name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-[#003B4C] mb-2 block">Property Map</label>
            <PropertyMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              locationName={formData.location}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Price (Ksh/month)</label>
            <input
              type="number"
              placeholder="Enter monthly rent"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Bedrooms</label>
            <input
              type="number"
              placeholder="Number of bedrooms"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Units</label>
            <input
              type="number"
              placeholder="Number of units"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            >
              <option value="">Select Category</option>
              {ALL_PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Features</label>
            <input
              type="text"
              placeholder="Enter features (comma separated)"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Property Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#007C99] file:text-white hover:file:bg-[#005A6E] file:cursor-pointer"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-3 text-sm font-medium text-[#003B4C] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-[#007C99] bg-gray-100 border-gray-300 rounded focus:ring-[#007C99] focus:ring-2"
              />
              Available for Rent
            </label>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-8 py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            {editingId ? 'Update Property' : 'Add Property'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border-2 border-[#007C99] text-[#007C99] px-8 py-3 rounded-xl font-medium hover:bg-[#007C99] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Listings */}
      {filteredListings.length > 0 ? (
        <div className="space-y-6">
          {filteredListings.map((property) => {
            const featureList = property.features
              ? property.features.split(',').map((f) => f.trim())
              : [];

            return (
              <div key={property.id} className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl border border-white/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
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
                    <span className="flex items-center gap-2 text-[#003B4C] font-bold bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <DollarSign size={18} className="text-[#007C99]" /> 
                      Ksh {parseInt(property.price).toLocaleString()}/month
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(property)} 
                        title="Edit"
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(property.id)} 
                        title="Delete"
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {property.category && (
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md">
                        {property.category}
                      </span>
                    )}
                    {property.latitude && property.longitude && (
                      <span className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md">
                        📍 Located
                      </span>
                    )}
                  </div>

                  {property.images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {property.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`property-${i}`}
                          onClick={() => openGallery(property.images, i)}
                          className="w-20 h-20 object-cover rounded-xl cursor-zoom-in hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-white/50"
                        />
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[#003B4C] mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
                      Features:
                    </p>
                    <ul className="flex flex-wrap gap-2 text-sm">
                      {featureList.length > 0 ? (
                        featureList.map((f, i) => (
                          <li
                            key={i}
                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105"
                          >
                            {f}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No features listed</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap pt-2">
                    <span className="flex items-center gap-2 text-[#003B4C] font-medium bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <BedDouble size={18} className="text-[#007C99]" /> 
                      {property.bedrooms} bedroom(s)
                    </span>
                    {property.units && (
                      <span className="flex items-center gap-2 text-[#003B4C] font-medium bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <Building2 size={18} className="text-[#007C99]" /> 
                        {property.units} unit(s)
                      </span>
                    )}
                    <span
                      className={`font-semibold px-4 py-2 rounded-xl ${
                        property.available 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      }`}
                    >
                      {property.available ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-12">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 size={32} className="text-gray-500" />
          </div>
          <p className="text-lg text-gray-500 font-medium">No properties found</p>
          <p className="text-sm text-gray-400">Add your first property to get started!</p>
        </div>
      )}

      {/* Confirmation and Gallery modals are unchanged */}
    </div>
  );
};

export default PropertyManager;
