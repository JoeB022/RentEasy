import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

const BookingStatus = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      property: '2 Bedroom Apartment, Nairobi',
      date: '2025-06-15',
      status: 'Pending',
    },
    {
      id: 2,
      property: 'Studio in Kilimani',
      date: '2025-06-10',
      status: 'Approved',
    },
    {
      id: 3,
      property: '3 Bedroom House, Westlands',
      date: '2025-06-05',
      status: 'Cancelled',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('All');

  const statusClass = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

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

  const filteredBookings =
    activeFilter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-[#003B4C] mb-4">Booking Status</h2>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 text-sm rounded-full border transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-[#003B4C] text-white border-[#003B4C]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500">
          No {activeFilter.toLowerCase()} bookings found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-[#E6F8FA] text-[#003B4C] text-left">
                <th className="px-6 py-3 font-semibold">Property</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <Transition
                  key={booking.id}
                  appear
                  show={true}
                  enter="transition-opacity duration-500 ease-out"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                >
                  <tr className="hover:bg-gray-50 transition-all duration-200 ease-in-out">
                    <td className="px-6 py-4">{booking.property}</td>
                    <td className="px-6 py-4">{booking.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition duration-300 ease-in-out ${statusClass[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      {booking.status !== 'Cancelled' ? (
                        <>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600 hover:underline text-xs transition duration-150"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReschedule(booking.id)}
                            className="text-blue-600 hover:underline text-xs transition duration-150"
                          >
                            Reschedule
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                </Transition>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
