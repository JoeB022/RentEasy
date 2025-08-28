import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
} from 'lucide-react';

const initialServices = [
  {
    id: 1,
    property: 'Green View Apartments',
    service: 'Weekly Cleaning',
    cost: 1000,
    available: true,
  },
  {
    id: 2,
    property: 'Sunrise Villas',
    service: 'Garbage Collection',
    cost: 500,
    available: false,
  },
];

const ApartmentServiceAddons = () => {
  const [services, setServices] = useState(initialServices);
  const [newService, setNewService] = useState({
    property: '',
    service: '',
    cost: '',
    available: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [filter, setFilter] = useState('');
  const [tenantRequests, setTenantRequests] = useState([]);

  const handleAdd = () => {
    if (!newService.property || !newService.service || !newService.cost) return;
    setServices([
      ...services,
      { ...newService, id: Date.now() },
    ]);
    setNewService({ property: '', service: '', cost: '', available: true });
  };

  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEdit = (id) => {
    const serviceToEdit = services.find((s) => s.id === id);
    setEditingId(id);
    setEditedService({ ...serviceToEdit });
  };

  const handleSave = () => {
    setServices(services.map((s) => (s.id === editingId ? editedService : s)));
    setEditingId(null);
    setEditedService({});
  };

  const handleTenantRequest = (service) => {
    setTenantRequests([...tenantRequests, { ...service, requestedAt: new Date() }]);
  };

  const filteredServices = services.filter((s) =>
    s.property.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          Apartment Service Add-ons
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Filter */}
      <div className="bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#003B4C] mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <Search className="text-white" size={14} />
          </div>
          Search Services
        </h3>
        
        <div className="relative w-full md:w-1/2">
          <Search className="absolute top-3 left-3 text-[#007C99]" size={18} />
          <input
            type="text"
            placeholder="Filter by property name..."
            className="pl-10 pr-4 py-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:border-[#007C99] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 shadow-md hover:shadow-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Add Service Form */}
      <div className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-xl border border-white/50 mb-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6 text-[#003B4C] flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <PlusCircle className="text-white" size={16} />
          </div>
          Add New Service
        </h3>
        
        <div className="grid sm:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Property Name</label>
            <input
              type="text"
              placeholder="Enter property name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
              value={newService.property}
              onChange={(e) => setNewService({ ...newService, property: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Service Name</label>
            <input
              type="text"
              placeholder="Enter service name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
              value={newService.service}
              onChange={(e) => setNewService({ ...newService, service: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Cost (KES)</label>
            <input
              type="number"
              placeholder="Enter cost"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
              value={newService.cost}
              onChange={(e) => setNewService({ ...newService, cost: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003B4C]">Availability</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newService.available}
                onChange={(e) => setNewService({ ...newService, available: e.target.checked })}
                className="w-5 h-5 text-[#007C99] bg-gray-100 border-gray-300 rounded focus:ring-[#007C99] focus:ring-2"
              />
              <span className="text-sm text-[#003B4C]">Available</span>
            </label>
          </div>
        </div>
        
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-8 py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="space-y-4">
        {filteredServices.map((s) => (
          <div key={s.id} className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            {editingId === s.id ? (
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#003B4C]">Property</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300"
                    value={editedService.property}
                    onChange={(e) => setEditedService({ ...editedService, property: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#003B4C]">Service</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300"
                    value={editedService.service}
                    onChange={(e) => setEditedService({ ...editedService, service: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#003B4C]">Cost</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300"
                    type="number"
                    value={editedService.cost}
                    onChange={(e) => setEditedService({ ...editedService, cost: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#003B4C]">Available</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedService.available}
                      onChange={(e) =>
                        setEditedService({ ...editedService, available: e.target.checked })
                      }
                      className="w-5 h-5 text-[#007C99] bg-gray-100 border-gray-300 rounded focus:ring-[#007C99] focus:ring-2"
                    />
                    <span className="text-sm text-[#003B4C]">Available</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🔧</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#003B4C]">{s.property}</p>
                      <p className="text-[#007C99] font-medium">{s.service}</p>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-[#003B4C] bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm">
                  KES {s.cost}
                </div>
                <div>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      s.available
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {s.available ? '✅ Available' : '❌ Not Available'}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-white/50">
              {editingId === s.id ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <X size={14} /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  {s.available && (
                    <button
                      onClick={() => handleTenantRequest(s)}
                      className="bg-gradient-to-r from-[#007C99] to-[#0099B3] hover:from-[#0088A3] hover:to-[#00A6C0] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Request
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Requests */}
      {tenantRequests.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-xl border border-white/50">
          <h3 className="text-xl font-bold mb-6 text-[#003B4C] flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
            Tenant Requests
          </h3>
          <div className="space-y-3">
            {tenantRequests.map((r, i) => (
              <div key={i} className="bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] border border-white/50 p-4 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#003B4C]">{r.service}</span> at{' '}
                    <strong className="text-[#007C99]">{r.property}</strong>
                  </div>
                  <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {new Date(r.requestedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentServiceAddons;
