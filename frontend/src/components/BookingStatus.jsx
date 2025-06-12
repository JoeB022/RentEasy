import React, { useState } from 'react';

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
    alert('Booking cancelled.');
  };

  const handleReschedule = (id) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    if (!newDate) return;
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, date: newDate } : b
    );
    setBookings(updated);
    alert('Booking rescheduled.');
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Booking Status</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2">Property</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="px-4 py-2">{booking.property}</td>
                  <td className="px-4 py-2">{booking.date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {booking.status !== 'Cancelled' ? (
                      <>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReschedule(booking.id)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Reschedule
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
