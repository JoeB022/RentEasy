import React, { useState } from 'react';
import { CheckCircle, XCircle, Home, MapPin, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminApprovalPanel = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      name: '2 Bedroom Apartment',
      location: 'Nairobi',
      price: 45000,
      approved: true,
      images: ['https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg'],
    },
    {
      id: 2,
      name: '1 Bedroom Studio',
      location: 'Kilimani',
      price: 30000,
      approved: false,
      images: ['https://i.pinimg.com/736x/ce/c5/cf/cec5cf7a64b78eaa5c024dd28596120c.jpg'],
    },
    {
      id: 3,
      name: '3 Bedroom House',
      location: 'Westlands',
      price: 70000,
      approved: false,
      images: ['https://i.pinimg.com/736x/f0/ac/91/f0ac91b9c88b7376d913a427ce749825.jpg'],
    },
  ]);

  const handleApproval = (id, approve) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, approved: approve } : listing
      )
    );
    toast.success(`Listing ${approve ? 'approved' : 'rejected'}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🛡️ Admin Listing Approval Panel</h2>

      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white shadow border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          {/* Left: Image + Info */}
          <div className="flex items-center gap-4">
            <img
              src={listing.images[0]}
              alt={listing.name}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-500" />
                {listing.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {listing.location}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Ksh {listing.price.toLocaleString()}
              </p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${
                  listing.approved
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                }`}
              >
                {listing.approved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-2 mt-3 md:mt-0">
            {!listing.approved ? (
              <>
                <button
                  onClick={() => handleApproval(listing.id, true)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(listing.id, false)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => handleApproval(listing.id, false)}
                className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition text-sm"
              >
                <XCircle className="w-4 h-4" />
                Revoke Approval
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminApprovalPanel;
