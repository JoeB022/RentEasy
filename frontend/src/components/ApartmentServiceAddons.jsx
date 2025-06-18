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
      <h2 className="text-2xl font-bold mb-6 text-[#003B4C]">Apartment Service Add-ons</h2>

      {/* Filter */}
      <div className="relative mb-6 w-full md:w-1/2">
        <Search className="absolute top-2.5 left-2.5 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Filter by property name..."
          className="pl-8 pr-4 py-2 border rounded w-full"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Add Service Form */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Property name"
          className="border rounded px-3 py-2"
          value={newService.property}
          onChange={(e) => setNewService({ ...newService, property: e.target.value })}
        />
        <input
          type="text"
          placeholder="Service name"
          className="border rounded px-3 py-2"
          value={newService.service}
          onChange={(e) => setNewService({ ...newService, service: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cost (KES)"
          className="border rounded px-3 py-2"
          value={newService.cost}
          onChange={(e) => setNewService({ ...newService, cost: e.target.value })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newService.available}
            onChange={(e) => setNewService({ ...newService, available: e.target.checked })}
          />
          Available
        </label>
        <button
          onClick={handleAdd}
          className="col-span-4 sm:col-span-1 flex items-center justify-center gap-2 bg-[#003B4C] text-white px-4 py-2 rounded hover:bg-[#005566]"
        >
          <PlusCircle size={18} /> Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="space-y-4">
        {filteredServices.map((s) => (
          <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded bg-white shadow-sm">
            {editingId === s.id ? (
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <input
                  className="border rounded px-2 py-1 w-full sm:w-1/4"
                  value={editedService.property}
                  onChange={(e) => setEditedService({ ...editedService, property: e.target.value })}
                />
                <input
                  className="border rounded px-2 py-1 w-full sm:w-1/4"
                  value={editedService.service}
                  onChange={(e) => setEditedService({ ...editedService, service: e.target.value })}
                />
                <input
                  className="border rounded px-2 py-1 w-full sm:w-1/4"
                  type="number"
                  value={editedService.cost}
                  onChange={(e) => setEditedService({ ...editedService, cost: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedService.available}
                    onChange={(e) =>
                      setEditedService({ ...editedService, available: e.target.checked })
                    }
                  />
                  Available
                </label>
              </div>
            ) : (
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#003B4C]">{s.property}</p>
                  <p>{s.service}</p>
                </div>
                <div className="text-sm text-gray-700">KES {s.cost}</div>
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              {editingId === s.id ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <X size={14} /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  {s.available && (
                    <button
                      onClick={() => handleTenantRequest(s)}
                      className="text-[#007C99] hover:underline text-sm"
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
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#003B4C] mb-2">Tenant Requests</h3>
          <ul className="text-sm space-y-1">
            {tenantRequests.map((r, i) => (
              <li key={i} className="border p-2 rounded bg-gray-50">
                {r.service} at <strong>{r.property}</strong> — Requested on{' '}
                {new Date(r.requestedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApartmentServiceAddons;
