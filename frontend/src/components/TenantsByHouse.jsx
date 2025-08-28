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
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          Tenants by House/Room
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#003B4C] mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <Search className="text-white" size={14} />
          </div>
          Search & Filter Options
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute top-3 left-3 text-[#007C99]" size={18} />
            <input
              type="text"
              placeholder="Search by name, room, or status..."
              className="pl-10 pr-4 py-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border-2 border-white/50 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl w-full md:w-1/3 focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
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
            <Calendar className="absolute top-3 left-3 text-[#007C99]" size={18} />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Property Display */}
      {filteredData.map((building, i) => (
        <div key={i} className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl rounded-2xl mb-8 p-6 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">🏢</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#003B4C]">
                {building.property}
              </h3>
              <p className="text-[#007C99] font-medium">{building.location}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {building.rooms.map((room, j) => {
              const status = room.rentHistory[selectedMonth] || 'Pending';
              const isPaid = status === 'Paid';

              return (
                <div
                  key={j}
                  className={`p-5 border-2 rounded-2xl text-sm flex flex-col justify-between transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                    isPaid
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800 hover:shadow-lg hover:shadow-green-200'
                      : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800 hover:shadow-lg hover:shadow-yellow-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isPaid ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <p className="font-semibold text-[#003B4C]">Room {room.room}</p>
                    </div>
                    <p className="font-medium text-[#003B4C]">{room.tenant}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#003B4C] opacity-70">Status:</span>
                      {isPaid ? (
                        <span className="flex items-center gap-1 text-green-700 bg-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle size={14} /> Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full text-xs font-semibold">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center mt-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Search size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tenants found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default TenantsByHouse;
