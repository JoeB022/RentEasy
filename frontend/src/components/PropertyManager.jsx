import React, { useState } from 'react';
import { Pencil, Trash2, Search, BadgeDollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyManager = () => {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    location: '',
    price: '',
    bedrooms: '',
    features: '',
    available: true,
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

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
      toast.success('Property added');
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
      price: '',
      bedrooms: '',
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

  return (
    <div className="max-w-6xl mx-auto pt-28 px-4">
      <h2 className="text-2xl font-bold mb-6 text-[#003B4C]">Manage Property Listings</h2>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="relative max-w-sm flex-1">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded pl-10"
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={16} />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'unavailable'].map((status) => (
            <button
              key={status}
              onClick={() => setAvailabilityFilter(status)}
              className={`px-3 py-1 rounded-full text-sm border ${
                availabilityFilter === status
                  ? 'bg-[#003B4C] text-white border-[#003B4C]'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All' : status === 'available' ? 'Available' : 'Unavailable'}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Property Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Price (Ksh/month)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Number of Bedrooms"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Features (comma separated)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="col-span-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            Available for Rent
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#003B4C] text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Property' : 'Add Property'}
        </button>
      </form>

      {/* Listings */}
      {filteredListings.length > 0 ? (
        <div className="space-y-6">
          {filteredListings.map((property) => {
            const featureList = property.features
              ? property.features.split(',').map((f) => f.trim())
              : [];

            return (
              <div key={property.id} className="bg-white shadow border rounded-lg overflow-hidden">
                <div className="bg-[#E6F8FA] px-4 py-2 flex justify-between items-center">
                  <div className="font-bold text-[#003B4C]">{property.name} – {property.location}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <BadgeDollarSign size={16} /> Ksh {parseInt(property.price).toLocaleString()} <span className="text-xs text-gray-600">/month</span>
                    </span>
                    <button onClick={() => handleEdit(property)} title="Edit">
                      <Pencil size={16} className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => setConfirmDeleteId(property.id)} title="Delete">
                      <Trash2 size={16} className="text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2">
                  {property.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {property.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`property-${i}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {featureList.length > 0 ? (
                        featureList.map((f, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 italic">No features listed</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bedrooms: {property.bedrooms}{' '}
                    |{' '}
                    <span
                      className={`font-semibold ${
                        property.available ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center mt-8">No properties found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h4 className="text-lg font-semibold mb-4">Confirm Deletion</h4>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this property?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="border px-4 py-1 rounded hover:bg-gray-100"
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
