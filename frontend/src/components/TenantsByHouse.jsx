import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar, Search } from 'lucide-react';

const tenantStatusData = [
  {
    property: 'Green View Apartments',
    location: 'Kilimani',
    rooms: [
      {
        room: 'A1',
        tenant: 'Joe Brian',
        rentHistory: {
          '2025-06': 'Paid',
          '2025-07': 'Pending'
        }
      },
      {
        room: 'A2',
        tenant: 'Renice Owino',
        rentHistory: {
          '2025-06': 'Pending',
          '2025-07': 'Pending'
        }
      }
    ]
  },
  {
    property: 'Sunrise Villas',
    location: 'Westlands',
    rooms: [
      {
        room: 'B1',
        tenant: 'Pope Mutembei',
        rentHistory: {
          '2025-06': 'Paid',
          '2025-07': 'Paid'
        }
      },
      {
        room: 'B2',
        tenant: 'Vivian Oyondi',
        rentHistory: {
          '2025-06': 'Pending',
          '2025-07': 'Paid'
        }
      }
    ]
  }
];

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const TenantsByHouse = () => {
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const filteredData = tenantStatusData
    .filter((property) =>
      selectedProperty === 'All' ? true : property.property === selectedProperty
    )
    .map((property) => ({
      ...property,
      rooms: property.rooms.filter((room) => {
        const keyword = search.toLowerCase();
        return (
          room.tenant.toLowerCase().includes(keyword) ||
          room.room.toLowerCase().includes(keyword) ||
          (room.rentHistory[selectedMonth] || 'Pending').toLowerCase().includes(keyword)
        );
      })
    }))
    .filter((property) => property.rooms.length > 0);

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4">
      <h2 className="text-2xl font-bold mb-6 text-[#003B4C]">Tenants by House/Room</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute top-2.5 left-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, room, or status..."
            className="pl-8 pr-4 py-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          <option value="All">All Properties</option>
          {tenantStatusData.map((item, i) => (
            <option key={i} value={item.property}>
              {item.property}
            </option>
          ))}
        </select>

        <div className="relative w-full md:w-1/3">
          <Calendar className="absolute top-2.5 left-2.5 text-gray-500" size={18} />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-8 pr-4 py-2 border rounded w-full"
          />
        </div>
      </div>

      {/* Property Display */}
      {filteredData.map((building, i) => (
        <div key={i} className="bg-white shadow rounded-lg mb-6 p-4 border">
          <h3 className="text-lg font-semibold text-[#007C99] mb-3">
            {building.property} – {building.location}
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {building.rooms.map((room, j) => {
              const status = room.rentHistory[selectedMonth] || 'Pending';
              const isPaid = status === 'Paid';

              return (
                <div
                  key={j}
                  className={`p-4 border rounded text-sm flex flex-col justify-between ${
                    isPaid
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  }`}
                >
                  <p><strong>Room:</strong> {room.room}</p>
                  <p><strong>Tenant:</strong> {room.tenant}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <strong>Status:</strong>
                    {isPaid ? (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle size={16} /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-700">
                        <AlertCircle size={16} /> Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No tenants match your filters.</div>
      )}
    </div>
  );
};

export default TenantsByHouse;
