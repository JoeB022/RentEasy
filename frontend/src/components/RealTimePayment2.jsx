import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
} from 'lucide-react';

const initialPaymentData = [
  {
    property: 'Green View Apartments',
    location: 'Kilimani',
    rooms: [
      { room: 'A1', tenant: 'Joe Brian', dueDate: '2025-06-05', status: 'Paid' },
      { room: 'A2', tenant: 'Renice Owino', dueDate: '2025-06-10', status: 'Pending' },
    ],
  },
  {
    property: 'Sunrise Villas',
    location: 'Westlands',
    rooms: [
      { room: 'B1', tenant: 'Pope Mutembei', dueDate: '2025-06-01', status: 'Paid' },
      { room: 'B2', tenant: 'Vivian Oyondi', dueDate: '2025-06-02', status: 'Pending' },
    ],
  },
];

const RealTimePayments = () => {
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const now = new Date();
    const updated = paymentData.map((property) => ({
      ...property,
      rooms: property.rooms.map((room) => {
        const due = new Date(room.dueDate);
        let status = room.status;
        if (status !== 'Paid') {
          if (due < now) status = 'Due';
          else status = 'Pending';
        }
        return { ...room, status };
      }),
    }));
    setPaymentData(updated);
  }, []);

  const getUpcomingAndOverdue = () => {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);
    const overdue = [];
    const upcoming = [];

    paymentData.forEach((property) => {
      property.rooms.forEach((room) => {
        const due = new Date(room.dueDate);
        if (room.status !== 'Paid') {
          if (due < now) overdue.push({ ...room, property: property.property });
          else if (due <= threeDaysLater) upcoming.push({ ...room, property: property.property });
        }
      });
    });

    return { overdue, upcoming };
  };

  const { overdue, upcoming } = getUpcomingAndOverdue();

  const filteredData = paymentData
    .map((property) => ({
      ...property,
      rooms: property.rooms.filter((room) => {
        const matchMonth = room.dueDate.startsWith(monthFilter);
        const keyword = search.toLowerCase();
        const matchSearch =
          room.tenant.toLowerCase().includes(keyword) ||
          room.room.toLowerCase().includes(keyword) ||
          room.status.toLowerCase().includes(keyword);
        return matchMonth && matchSearch;
      }),
    }))
    .filter((property) => property.rooms.length > 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="flex items-center gap-1 text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full text-xs">
            <CheckCircle size={14} /> Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1 text-yellow-700 font-medium bg-yellow-100 px-2 py-0.5 rounded-full text-xs">
            <Clock size={14} /> Pending
          </span>
        );
      case 'Due':
      default:
        return (
          <span className="flex items-center gap-1 text-red-700 font-medium bg-red-100 px-2 py-0.5 rounded-full text-xs">
            <AlertTriangle size={14} /> Due
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4">
      <h2 className="text-2xl font-bold mb-6 text-[#003B4C]">Real-Time Rent Payments</h2>

      {/* 🔔 Notification Banner */}
      {(overdue.length > 0 || upcoming.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-6">
          {overdue.length > 0 && (
            <div className="mb-2">
              <strong className="text-red-700">❗ Overdue ({overdue.length}):</strong>{' '}
              {overdue.map((item) => `${item.tenant} (${item.property} - ${item.room})`).join(', ')}
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <strong className="text-blue-700">⏳ Due Soon ({upcoming.length}):</strong>{' '}
              {upcoming.map((item) => `${item.tenant} (${item.property} - ${item.room})`).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute top-2.5 left-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by tenant, room, status..."
            className="pl-8 pr-4 py-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-1/2">
          <Calendar className="absolute top-2.5 left-2.5 text-gray-500" size={18} />
          <input
            type="month"
            className="pl-8 pr-4 py-2 border rounded w-full"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Payments Table */}
      {filteredData.map((property, i) => (
        <div key={i} className="bg-white shadow rounded-lg mb-6 p-4 border">
          <h3 className="text-lg font-semibold text-[#007C99] mb-3">
            {property.property} – {property.location}
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Room</th>
                  <th className="px-4 py-2 text-left">Tenant</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {property.rooms.map((room, j) => (
                  <tr key={j} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{room.room}</td>
                    <td className="px-4 py-2">{room.tenant}</td>
                    <td className="px-4 py-2">{room.dueDate}</td>
                    <td className="px-4 py-2">{getStatusBadge(room.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No rent records match your filters.
        </div>
      )}
    </div>
  );
};

export default RealTimePayments;
