import React, { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initialRates = [
  { id: 1, service: 'Cleaning', basePrice: 1500, status: 'active' },
  { id: 2, service: 'Moving', basePrice: 3000, status: 'active' },
  { id: 3, service: 'Repairs', basePrice: 2000, status: 'inactive' },
  { id: 4, service: 'Packing', basePrice: 1800, status: 'active' },
  { id: 5, service: 'Pest Control', basePrice: 2500, status: 'inactive' },
];

const ServiceRatesEditor = () => {
  const [rates, setRates] = useState(initialRates);
  const [editId, setEditId] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleEdit = (id, currentPrice) => {
    setEditId(id);
    setEditedPrice(currentPrice);
  };

  const handleSave = (id) => {
    if (isNaN(editedPrice) || editedPrice <= 0) {
      toast.error('⚠️ Enter a valid positive number');
      return;
    }

    const updated = rates.map((r) =>
      r.id === id ? { ...r, basePrice: parseInt(editedPrice) } : r
    );
    setRates(updated);
    setEditId(null);
    toast.success('✅ Rate updated');
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedPrice('');
  };

  const uniqueCategories = [
    'All',
    ...Array.from(new Set(rates.map((r) => r.service))),
  ];

  const filteredRates = rates.filter((r) => {
    const categoryMatch =
      categoryFilter === 'All' || r.service === categoryFilter;
    const statusMatch =
      statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    return categoryMatch && statusMatch;
  });

  return (
    <div className="text-sm">
      <h2 className="text-lg font-semibold mb-4 text-[#003B4C]">Service Rates</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="bg-[#003B4C] text-white">
            <tr>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Base Price (Ksh)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map((rate) => (
              <tr key={rate.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{rate.service}</td>
                <td className="px-4 py-2">
                  {editId === rate.id ? (
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-32"
                      value={editedPrice}
                      onChange={(e) => setEditedPrice(e.target.value)}
                    />
                  ) : (
                    `Ksh ${rate.basePrice.toLocaleString()}`
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rate.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {rate.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {editId === rate.id ? (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={() => handleSave(rate.id)}
                      >
                        <Save size={14} />
                      </button>
                      <button
                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                        onClick={handleCancel}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleEdit(rate.id, rate.basePrice)}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRates.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No services match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRatesEditor;
