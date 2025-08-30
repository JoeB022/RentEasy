import React from 'react';
import { Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BookingStatus = ({ bookings, setBookings }) => {
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('❌ Please log in to manage bookings');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Approved'
        })
      });

      if (response.ok) {
        const updated = bookings.map((b) =>
          b.id === id ? { ...b, status: 'Approved' } : b
        );
        setBookings(updated);
        toast.success('✅ Property approved! You are interested in this property.');
      } else {
        const errorData = await response.json();
        toast.error(`❌ ${errorData.error || 'Failed to approve property'}`);
      }
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error('❌ Failed to approve property');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('❌ Please log in to manage bookings');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Rejected'
        })
      });

      if (response.ok) {
        // Remove the rejected booking from the list
        const updated = bookings.filter((b) => b.id !== id);
        setBookings(updated);
        toast.success('✅ Property rejected and removed from your booking list.');
      } else {
        const errorData = await response.json();
        toast.error(`❌ ${errorData.error || 'Failed to reject property'}`);
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast.error('❌ Failed to reject property');
    }
  };

  const handleReschedule = (id) => {
    const newDate = prompt('📅 Enter new date (YYYY-MM-DD):');
    if (!newDate) return;
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, date: newDate } : b
    );
    setBookings(updated);
    toast.success('✅ Booking rescheduled! (Note: This is a frontend-only change for demo purposes)');
  };

  const filters = ['All', 'Pending', 'Approved', 'Rejected'];
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filteredBookings =
    activeFilter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const statusClass = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Booking Status</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Filter and Refresh */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                    : 'bg-white text-[#003B4C] border-[#007C99] hover:bg-gradient-to-r hover:from-[#007C99]/10 hover:to-[#0099B3]/10 hover:border-[#007C99] hover:shadow-md'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white text-sm font-medium rounded-xl border-2 border-[#007C99] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-[#0088A3] hover:to-[#00A6C0]"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
              No {activeFilter.toLowerCase()} bookings found
            </h3>
            <p className="text-[#007C99] font-medium mb-4">
              {activeFilter === 'All' 
                ? "You haven't made any bookings yet. Browse properties and click 'Book Now' to get started!" 
                : `No ${activeFilter.toLowerCase()} bookings at the moment.`
              }
            </p>
            {activeFilter === 'All' && (
              <button
                onClick={() => window.location.href = '/dashboard/tenant?tab=property'}
                className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-6 py-3 rounded-xl font-medium hover:from-[#0088A3] hover:to-[#00A6C0] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                🏠 Browse Properties
              </button>
            )}
          </div>
        </div>
      ) : (
        // Bookings Table
        <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] text-[#003B4C]">
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Property</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Date</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Message</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Status</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {filteredBookings.map((booking) => (
                  <Transition
                    key={booking.id}
                    show={true}
                    enter="transition-opacity duration-500 ease-out"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                  >
                    <tr className="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 group">
                      <td className="px-8 py-6 font-medium text-[#003B4C] group-hover:text-[#007C99]">
                        {booking.property}
                      </td>
                      <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">
                        {booking.date}
                      </td>
                      <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">
                        {booking.message || 'No message'}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md ${
                            booking.status === 'Pending'
                              ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
                              : booking.status === 'Approved'
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                          }`}
                        >
                          {booking.status === 'Pending' && '⏳'}
                          {booking.status === 'Approved' && '✅'}
                          {booking.status === 'Rejected' && '❌'}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {booking.status === 'Pending' ? (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              ❌ Reject
                            </button>

                          </div>
                        ) : booking.status === 'Approved' ? (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => handleReschedule(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              📅 Reschedule
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic px-4 py-2 bg-gray-100 rounded-xl">
                            No actions available
                          </span>
                        )}
                      </td>
                    </tr>
                  </Transition>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
