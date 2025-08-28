import React, { useState } from 'react';
import {
  Pencil,
  Save,
  X,
  Filter,
  DollarSign,
  Settings,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  Edit3,
  Plus,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialRates = [
  { id: 1, service: 'Cleaning', basePrice: 1500, status: 'active', category: 'Maintenance', lastUpdated: '2025-01-15' },
  { id: 2, service: 'Moving', basePrice: 3000, status: 'active', category: 'Relocation', lastUpdated: '2025-01-10' },
  { id: 3, service: 'Repairs', basePrice: 2000, status: 'inactive', category: 'Maintenance', lastUpdated: '2025-01-05' },
  { id: 4, service: 'Packing', basePrice: 1800, status: 'active', category: 'Relocation', lastUpdated: '2025-01-12' },
  { id: 5, service: 'Pest Control', basePrice: 2500, status: 'inactive', category: 'Maintenance', lastUpdated: '2025-01-08' },
  { id: 6, service: 'Interior Design', basePrice: 5000, status: 'active', category: 'Enhancement', lastUpdated: '2025-01-20' },
  { id: 7, service: 'Security', basePrice: 4000, status: 'active', category: 'Safety', lastUpdated: '2025-01-18' },
  { id: 8, service: 'Landscaping', basePrice: 3500, status: 'active', category: 'Enhancement', lastUpdated: '2025-01-14' },
];

const ServiceRatesEditor = () => {
  const [rates, setRates] = useState(initialRates);
  const [editId, setEditId] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
      r.id === id ? { ...r, basePrice: parseInt(editedPrice), lastUpdated: new Date().toISOString().split('T')[0] } : r
    );
    setRates(updated);
    setEditId(null);
    toast.success('✅ Rate updated successfully');
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedPrice('');
  };

  const toggleStatus = (id) => {
    setRates((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
      )
    );
    toast.success('✅ Status updated successfully');
  };

  const uniqueCategories = [
    'All',
    ...Array.from(new Set(rates.map((r) => r.category))),
  ];

  const filteredRates = rates.filter((r) => {
    const categoryMatch =
      categoryFilter === 'All' || r.category === categoryFilter;
    const statusMatch =
      statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    const searchMatch =
      r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
      case 'inactive':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const getCategoryBadge = (category) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (category) {
      case 'Maintenance':
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300`;
      case 'Relocation':
        return `${baseClasses} bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300`;
      case 'Enhancement':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
      case 'Safety':
        return `${baseClasses} bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const totalServices = rates.length;
  const activeServices = rates.filter(r => r.status === 'active').length;
  const inactiveServices = rates.filter(r => r.status === 'inactive').length;
  const totalRevenue = rates.filter(r => r.status === 'active').reduce((sum, r) => sum + r.basePrice, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Service Rates Management</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-blue-600 font-medium mb-1">Total Services</h4>
              <p className="text-2xl font-bold text-blue-800">{totalServices}</p>
              <div className="text-xs text-blue-600 mt-1">Available services</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Active Services</h4>
              <p className="text-2xl font-bold text-green-800">{activeServices}</p>
              <div className="text-xs text-green-600 mt-1">Currently available</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-600 font-medium mb-1">Inactive Services</h4>
              <p className="text-2xl font-bold text-red-800">{inactiveServices}</p>
              <div className="text-xs text-red-600 mt-1">Temporarily disabled</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-yellow-600 font-medium mb-1">Total Revenue</h4>
              <p className="text-2xl font-bold text-yellow-800">KES {totalRevenue.toLocaleString()}</p>
              <div className="text-xs text-yellow-600 mt-1">From active services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007C99]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#007C99]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <button className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-4 py-2 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus size={16} /> Add New Service
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search services or categories..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-[#003B4C] to-[#007C99] text-white">
              <tr>
                <th className="px-8 py-4 text-left font-bold">Service</th>
                <th className="px-8 py-4 text-left font-bold">Category</th>
                <th className="px-8 py-4 text-left font-bold">Base Price (KES)</th>
                <th className="px-8 py-4 text-left font-bold">Status</th>
                <th className="px-8 py-4 text-left font-bold">Last Updated</th>
                <th className="px-8 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="border-b border-white/50 hover:bg-gradient-to-r hover:from-white/50 hover:to-[#f8fafc]/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-[#003B4C]">{rate.service}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={getCategoryBadge(rate.category)}>
                      {rate.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {editId === rate.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#007C99] font-medium">KES</span>
                        <input
                          type="number"
                          className="px-3 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 bg-white/80 backdrop-blur-sm w-32"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          placeholder="Enter price"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#007C99]" />
                        <span className="font-bold text-[#003B4C] text-lg">
                          {rate.basePrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={getStatusBadge(rate.status)}>
                      {rate.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#007C99]" />
                      <span className="text-[#003B4C] bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {rate.lastUpdated}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {editId === rate.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                          onClick={() => handleSave(rate.id)}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                          onClick={handleCancel}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                          onClick={() => handleEdit(rate.id, rate.basePrice)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl ${
                            rate.status === 'active'
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          }`}
                          onClick={() => toggleStatus(rate.id)}
                        >
                          {rate.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRates.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#003B4C] mb-2">No Services Found</h3>
                        <p className="text-[#007C99] font-medium">
                          {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                            ? 'Try adjusting your filters or search terms.'
                            : 'No services available. Add your first service to get started!'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceRatesEditor;
