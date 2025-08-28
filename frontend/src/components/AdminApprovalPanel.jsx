import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Home, 
  MapPin, 
  Eye, 
  Filter, 
  Search, 
  Calendar,
  DollarSign,
  User,
  Clock,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  XSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminApprovalPanel = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      name: '2 Bedroom Apartment',
      location: 'Nairobi, Westlands',
      price: 45000,
      approved: true,
      landlord: 'John Kamau',
      submittedDate: '2025-01-15',
      propertyType: 'Apartment',
      images: ['https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg'],
      description: 'Modern 2-bedroom apartment with balcony and parking space',
      amenities: ['Parking', 'Balcony', 'Security', 'Water 24/7']
    },
    {
      id: 2,
      name: '1 Bedroom Studio',
      location: 'Kilimani, Nairobi',
      price: 30000,
      approved: false,
      landlord: 'Sarah Wambui',
      submittedDate: '2025-01-18',
      propertyType: 'Studio',
      images: ['https://i.pinimg.com/736x/ce/c5/cf/cec5cf7a64b78eaa5c024dd28596120c.jpg'],
      description: 'Cozy studio apartment perfect for single professionals',
      amenities: ['Furnished', 'Kitchen', 'Bathroom', 'Internet']
    },
    {
      id: 3,
      name: '3 Bedroom House',
      location: 'Westlands, Nairobi',
      price: 70000,
      approved: false,
      landlord: 'David Ochieng',
      submittedDate: '2025-01-20',
      propertyType: 'House',
      images: ['https://i.pinimg.com/736x/f0/ac/91/f0ac91b9c88b7376d913a427ce749825.jpg'],
      description: 'Spacious family house with garden and servant quarters',
      amenities: ['Garden', 'Servant Quarters', 'Parking', 'Security']
    },
    {
      id: 4,
      name: '4 Bedroom Villa',
      location: 'Karen, Nairobi',
      price: 120000,
      approved: false,
      landlord: 'Grace Njoki',
      submittedDate: '2025-01-21',
      propertyType: 'Villa',
      images: ['https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg'],
      description: 'Luxury villa with swimming pool and modern amenities',
      amenities: ['Swimming Pool', 'Garden', 'Security', 'Parking']
    },
    {
      id: 5,
      name: '2 Bedroom Townhouse',
      location: 'Lavington, Nairobi',
      price: 55000,
      approved: true,
      landlord: 'Michael Mwangi',
      submittedDate: '2025-01-12',
      propertyType: 'Townhouse',
      images: ['https://i.pinimg.com/736x/ce/c5/cf/cec5cf7a64b78eaa5c024dd28596120c.jpg'],
      description: 'Beautiful townhouse in a quiet neighborhood',
      amenities: ['Garden', 'Parking', 'Security', 'Water 24/7']
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const handleApproval = (id, approve) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, approved: approve } : listing
      )
    );
    toast.success(`✅ Listing ${approve ? 'approved' : 'rejected'} successfully`);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkApprove = () => {
    if (!selectedIds.length) return;
    setListings((prev) =>
      prev.map((listing) =>
        selectedIds.includes(listing.id) ? { ...listing, approved: true } : listing
      )
    );
    toast.success(`✅ ${selectedIds.length} listings approved successfully`);
    setSelectedIds([]);
  };

  const bulkReject = () => {
    if (!selectedIds.length) return;
    setListings((prev) =>
      prev.map((listing) =>
        selectedIds.includes(listing.id) ? { ...listing, approved: false } : listing
      )
    );
    toast.success(`❌ ${selectedIds.length} listings rejected successfully`);
    setSelectedIds([]);
  };

  const filteredListings = listings.filter((listing) => {
    const matchFilter = filter === 'All' || 
                       (filter === 'Pending' && !listing.approved) || 
                       (filter === 'Approved' && listing.approved);
    const matchSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       listing.landlord.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusBadge = (approved) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    if (approved) {
      return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
    } else {
      return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300`;
    }
  };

  const getPropertyTypeBadge = (type) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (type) {
      case 'Apartment':
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300`;
      case 'House':
        return `${baseClasses} bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300`;
      case 'Villa':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300`;
      case 'Studio':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
      case 'Townhouse':
        return `${baseClasses} bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const totalListings = listings.length;
  const pendingListings = listings.filter(l => !l.approved).length;
  const approvedListings = listings.filter(l => l.approved).length;
  const totalValue = listings.filter(l => l.approved).reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Property Booking Approvals</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-blue-600 font-medium mb-1">Total Listings</h4>
              <p className="text-2xl font-bold text-blue-800">{totalListings}</p>
              <div className="text-xs text-blue-600 mt-1">All properties</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-yellow-600 font-medium mb-1">Pending Approval</h4>
              <p className="text-2xl font-bold text-yellow-800">{pendingListings}</p>
              <div className="text-xs text-yellow-600 mt-1">Requires attention</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Approved</h4>
              <p className="text-2xl font-bold text-green-800">{approvedListings}</p>
              <div className="text-xs text-green-600 mt-1">Successfully approved</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-600 font-medium mb-1">Total Value</h4>
              <p className="text-2xl font-bold text-purple-800">KES {totalValue.toLocaleString()}</p>
              <div className="text-xs text-purple-600 mt-1">From approved listings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007C99]" />
              {['All', 'Pending', 'Approved'].map((opt) => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium ${
                    filter === opt
                      ? 'bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white border-[#007C99] shadow-lg'
                      : 'bg-white/80 text-[#003B4C] border-[#007C99]/30 hover:border-[#007C99]/50 hover:bg-white backdrop-blur-sm'
                  }`}
                  onClick={() => setFilter(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-4 py-2 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Shield size={16} /> Review All
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search properties, locations, or landlords..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-yellow-800 font-medium">
              {selectedIds.length} listing(s) selected
            </span>
            <button
              onClick={bulkApprove}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <CheckCircle size={16} /> Approve Selected
            </button>
            <button
              onClick={bulkReject}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <XCircle size={16} /> Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="space-y-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Image + Info */}
                <div className="flex items-start gap-6 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(listing.id)}
                    onChange={() => toggleSelect(listing.id)}
                    className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20 cursor-pointer mt-2"
                  />
                  <img
                    src={listing.images[0]}
                    alt={listing.name}
                    className="w-32 h-32 object-cover rounded-2xl border-2 border-white/50 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#003B4C] flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#007C99]" />
                        {listing.name}
                      </h3>
                      <span className={getPropertyTypeBadge(listing.propertyType)}>
                        {listing.propertyType}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#007C99]" />
                        <span className="text-[#003B4C] font-medium">{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#007C99]" />
                        <span className="text-[#003B4C] font-bold text-lg">KES {listing.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#007C99]" />
                        <span className="text-[#003B4C]">{listing.landlord}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#007C99]" />
                        <span className="text-[#003B4C] bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                          {listing.submittedDate}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#003B4C] text-sm leading-relaxed mb-3">{listing.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-white/60 text-[#007C99] text-xs font-medium rounded-lg backdrop-blur-sm border border-white/50">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <span className={getStatusBadge(listing.approved)}>
                      {listing.approved ? '✅ Approved' : '⏳ Pending Approval'}
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  {!listing.approved ? (
                    <>
                      <button
                        onClick={() => handleApproval(listing.id, true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(listing.id, false)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleApproval(listing.id, false)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <XSquare className="w-5 h-5" />
                      Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003B4C] mb-2">No Listings Found</h3>
                <p className="text-[#007C99] font-medium">
                  {searchTerm || filter !== 'All'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No property listings available for approval.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select All */}
      {filteredListings.length > 0 && (
        <div className="bg-gradient-to-r from-white to-[#f8fafc] p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
          <label className="inline-flex items-center gap-3 text-[#003B4C] font-medium cursor-pointer hover:text-[#007C99] transition-colors duration-300">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredListings.length && filteredListings.length > 0}
              onChange={() => setSelectedIds(
                selectedIds.length === filteredListings.length ? [] : filteredListings.map(l => l.id)
              )}
              className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20"
            />
            Select All ({filteredListings.length} listings)
          </label>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalPanel;
