import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const sampleListings = [
  {
    id: 1,
    property: 'Palm Heights',
    location: 'Lavington',
    landlord: 'John Mwangi',
    status: 'Pending',
  },
  {
    id: 2,
    property: 'Skyline Apartments',
    location: 'Ngong Road',
    landlord: 'Winnie Chebet',
    status: 'Pending',
  },
];

const ListingApprovals = () => {
  const [listings, setListings] = useState(sampleListings);

  const handleStatusChange = (id, newStatus) => {
    const updated = listings.map((listing) =>
      listing.id === id ? { ...listing, status: newStatus } : listing
    );
    setListings(updated);
    toast.success(
      `Listing ${newStatus === 'Approved' ? 'approved' : 'rejected'} successfully.`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-[#003B4C] mb-4">Approve/Reject Listings</h2>

      {listings.length === 0 ? (
        <p className="text-sm text-gray-500">No listings awaiting approval.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left py-2 px-4">Property</th>
              <th className="text-left py-2 px-4">Location</th>
              <th className="text-left py-2 px-4">Landlord</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr
                key={listing.id}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="px-4 py-2">{listing.property}</td>
                <td className="px-4 py-2">{listing.location}</td>
                <td className="px-4 py-2">{listing.landlord}</td>
                <td className="px-4 py-2 font-medium">
                  {listing.status === 'Approved' ? (
                    <span className="text-green-600">Approved</span>
                  ) : listing.status === 'Rejected' ? (
                    <span className="text-red-600">Rejected</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(listing.id, 'Approved')}
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 text-xs rounded hover:bg-green-200"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(listing.id, 'Rejected')}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 text-xs rounded hover:bg-red-200"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListingApprovals;
