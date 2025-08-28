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
          <span className="flex items-center gap-2 text-green-700 font-semibold bg-gradient-to-r from-green-100 to-green-200 px-4 py-2 rounded-xl text-xs shadow-sm border border-green-200">
            <CheckCircle size={16} className="text-green-600" /> Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-2 text-yellow-700 font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-xl text-xs shadow-sm border border-yellow-200">
            <Clock size={16} className="text-yellow-600" /> Pending
          </span>
        );
      case 'Due':
      default:
        return (
          <span className="flex items-center gap-2 text-red-700 font-semibold bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-xl text-xs shadow-sm border border-red-200">
            <AlertTriangle size={16} className="text-red-600" /> Due
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          Real-Time Rent Payments
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* 🔔 Notification Banner */}
      {(overdue.length > 0 || upcoming.length > 0) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300/50 text-yellow-800 p-6 rounded-2xl mb-8 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-[#003B4C]">Payment Alerts</h3>
          </div>
          
          {overdue.length > 0 && (
            <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl">
              <strong className="text-red-700 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Overdue ({overdue.length}):
              </strong>{' '}
              <span className="text-red-600">
                {overdue.map((item) => `${item.tenant} (${item.property} - ${item.room})`).join(', ')}
              </span>
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
              <strong className="text-blue-700 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Due Soon ({upcoming.length}):
              </strong>{' '}
              <span className="text-blue-600">
                {upcoming.map((item) => `${item.tenant} (${item.property} - ${item.room})`).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#003B4C] mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <Search className="text-white" size={14} />
          </div>
          Search & Filter Options
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute top-3 left-3 text-[#007C99]" size={18} />
            <input
              type="text"
              placeholder="Search by tenant, room, status..."
              className="pl-10 pr-4 py-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-1/2">
            <Calendar className="absolute top-3 left-3 text-[#007C99]" size={18} />
            <input
              type="month"
              className="pl-10 pr-4 py-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {filteredData.map((property, i) => (
        <div key={i} className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl rounded-2xl mb-8 p-6 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">🏢</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#003B4C]">
                {property.property}
              </h3>
              <p className="text-[#007C99] font-medium">{property.location}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] text-[#003B4C] rounded-xl">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Room</th>
                  <th className="px-6 py-4 text-left font-semibold">Tenant</th>
                  <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {property.rooms.map((room, j) => (
                  <tr key={j} className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 transform hover:scale-[1.02] group">
                    <td className="px-6 py-4 font-medium text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                      {room.room}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                      {room.tenant}
                    </td>
                    <td className="px-6 py-4 text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                      {room.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {getStatusBadge(room.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center mt-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Calendar size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No payment records found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or month filter</p>
        </div>
      )}
    </div>
  );
};

export default RealTimePayments;
