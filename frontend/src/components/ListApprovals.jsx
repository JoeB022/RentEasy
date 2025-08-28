import React, { useState } from 'react';
import { CheckCircle, XCircle, Home, MapPin, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const sampleListings = [
  {
    id: 1,
    property: 'Palm Heights',
    location: 'Lavington',
    landlord: 'John Mwangi',
    status: 'Pending',
    submittedDate: '2025-01-15',
    propertyType: 'Apartment',
    price: 'KES 45,000'
  },
  {
    id: 2,
    property: 'Skyline Apartments',
    location: 'Ngong Road',
    landlord: 'Winnie Chebet',
    status: 'Pending',
    submittedDate: '2025-01-14',
    propertyType: 'Studio',
    price: 'KES 35,000'
  },
  {
    id: 3,
    property: 'Garden Villas',
    location: 'Westlands',
    landlord: 'David Ochieng',
    status: 'Approved',
    submittedDate: '2025-01-13',
    propertyType: 'Villa',
    price: 'KES 120,000'
  },
  {
    id: 4,
    property: 'City Center Lofts',
    location: 'CBD',
    landlord: 'Sarah Kamau',
    status: 'Rejected',
    submittedDate: '2025-01-12',
    propertyType: 'Loft',
    price: 'KES 85,000'
  }
];

const ListingApprovals = () => {
  const [listings, setListings] = useState(sampleListings);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusChange = (id, newStatus) => {
    const updated = listings.map((listing) =>
      listing.id === id ? { ...listing, status: newStatus } : listing
    );
    setListings(updated);
    toast.success(
      `Listing ${newStatus === 'Approved' ? 'approved' : 'rejected'} successfully.`
    );
  };

  const filteredListings = statusFilter === 'All' 
    ? listings 
    : listings.filter(listing => listing.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-md">
            ✅ Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 shadow-md">
            ❌ Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 shadow-md">
            ⏳ Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Approve/Reject Listings</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Listings</p>
              <p className="text-xl font-bold text-blue-800">{listings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-800">{listings.filter(l => l.status === 'Pending').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-xl font-bold text-green-800">{listings.filter(l => l.status === 'Approved').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-xl font-bold text-red-800">{listings.filter(l => l.status === 'Rejected').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="flex gap-3">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                  : 'text-[#003B4C] border-[#007C99] hover:bg-gradient-to-r hover:from-[#007C99]/10 hover:to-[#0099B3]/10 hover:border-[#007C99] hover:shadow-md'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      {filteredListings.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Home className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
              No {statusFilter.toLowerCase()} listings found
            </h3>
            <p className="text-[#007C99] font-medium">
              {statusFilter === 'All' 
                ? "No listings available at the moment." 
                : `No ${statusFilter.toLowerCase()} listings to display.`
              }
            </p>
          </div>
        </div>
      ) : (
        // Listings Table
        <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] text-[#003B4C]">
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Property Details</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Location</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Landlord</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Status</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 group"
                  >
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-[#007C99]" />
                          <span className="font-bold text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                            {listing.property}
                          </span>
                        </div>
                        <div className="text-sm text-[#007C99]">
                          {listing.propertyType} • {listing.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {listing.submittedDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{listing.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{listing.landlord}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-8 py-6">
                      {listing.status === 'Pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusChange(listing.id, 'Approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(listing.id, 'Rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {listing.status !== 'Pending' && (
                        <span className="text-gray-400 text-xs italic px-4 py-2 bg-gray-100 rounded-xl">
                          {listing.status === 'Approved' ? 'Already approved' : 'Already rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingApprovals;
