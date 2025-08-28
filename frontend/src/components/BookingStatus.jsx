import React from 'react';
import { Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

const BookingStatus = ({ bookings, setBookings }) => {
  const handleCancel = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: 'Cancelled' } : b
    );
    setBookings(updated);
    toast.error('❌ Booking cancelled.');
  };

  const handleReschedule = (id) => {
    const newDate = prompt('📅 Enter new date (YYYY-MM-DD):');
    if (!newDate) return;
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, date: newDate } : b
    );
    setBookings(updated);
    toast.success('✅ Booking rescheduled!');
  };

  const filters = ['All', 'Pending', 'Approved', 'Cancelled'];
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filteredBookings =
    activeFilter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const statusClass = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Booking Status</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Filter */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 mb-8 backdrop-blur-sm">
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
            <p className="text-[#007C99] font-medium">
              {activeFilter === 'All' 
                ? "You haven't made any bookings yet." 
                : `No ${activeFilter.toLowerCase()} bookings at the moment.`
              }
            </p>
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
                          {booking.status === 'Cancelled' && '❌'}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {booking.status !== 'Cancelled' ? (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReschedule(booking.id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              Reschedule
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
