import React, { useState } from 'react';
import {
  Trash2,
  Check,
  Search,
  Filter,
  AlertTriangle,
  MessageSquare,
  User,
  Home,
  Calendar,
  Shield,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

// Sample combined data (abuse + comment flags)
const dummyReports = [
  { id: 1, type: 'abuse', reporter: 'James Mwangi', comment: 'Tenant left trash everywhere', date: '2025-06-12', property: 'Green View', status: 'unresolved', priority: 'high' },
  { id: 2, type: 'comment', reporter: 'Faith Wanjiku', comment: 'Inappropriate language in review', date: '2025-06-10', property: 'Sunrise Villas', status: 'unresolved', priority: 'medium' },
  { id: 3, type: 'abuse', reporter: 'Moses Otieno', comment: 'Excessive noise complaints', date: '2025-06-13', property: 'Lake Breeze', status: 'resolved', priority: 'low' },
  { id: 4, type: 'comment', reporter: 'Mary Njoki', comment: 'Spam comments', date: '2025-06-14', property: 'Sunset Towers', status: 'unresolved', priority: 'high' },
  { id: 5, type: 'abuse', reporter: 'John Kamau', comment: 'Property damage reported', date: '2025-06-15', property: 'Mountain View', status: 'resolved', priority: 'medium' },
  { id: 6, type: 'comment', reporter: 'Sarah Wambui', comment: 'Harassment in comments', date: '2025-06-16', property: 'Ocean Heights', status: 'unresolved', priority: 'high' },
];

const AbuseReports = () => {
  const [reports, setReports] = useState(dummyReports);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkResolve = () => {
    if (!selectedIds.length) return;
    setReports((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, status: 'resolved' } : r
      )
    );
    toast.success('✅ Selected reports marked as resolved');
    setSelectedIds([]);
  };

  const bulkDelete = () => {
    if (!selectedIds.length) return;
    setReports((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    toast.success('🗑️ Selected reports deleted');
    setSelectedIds([]);
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus =
      statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === 'All' || r.type === typeFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === 'All' || r.priority === priorityFilter.toLowerCase();
    const matchesSearch =
      r.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (status) {
      case 'resolved':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
      case 'unresolved':
        return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (type) {
      case 'abuse':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300`;
      case 'comment':
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-lg text-xs font-semibold";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white`;
      case 'medium':
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white`;
      case 'low':
        return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'abuse':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalReports = reports.length;
  const unresolvedReports = reports.filter(r => r.status === 'unresolved').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const highPriorityReports = reports.filter(r => r.priority === 'high').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Abuse Reports & Flags</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-600 font-medium mb-1">Total Reports</h4>
              <p className="text-2xl font-bold text-red-800">{totalReports}</p>
              <div className="text-xs text-red-600 mt-1">All time</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-yellow-600 font-medium mb-1">Unresolved</h4>
              <p className="text-2xl font-bold text-yellow-800">{unresolvedReports}</p>
              <div className="text-xs text-yellow-600 mt-1">Requires attention</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Resolved</h4>
              <p className="text-2xl font-bold text-green-800">{resolvedReports}</p>
              <div className="text-xs text-green-600 mt-1">Successfully handled</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-600 font-medium mb-1">High Priority</h4>
              <p className="text-2xl font-bold text-purple-800">{highPriorityReports}</p>
              <div className="text-xs text-purple-600 mt-1">Urgent attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007C99]" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="abuse">Abuse Reports</option>
                <option value="comment">Flagged Comments</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#007C99]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#007C99]" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={bulkResolve}
              disabled={!selectedIds.length}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Check size={16} /> Resolve Selected
            </button>

            <button
              onClick={bulkDelete}
              disabled={!selectedIds.length}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Trash2 size={16} /> Delete Selected
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search reporter, property, or comment..."
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
                <th className="px-8 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredReports.length &&
                      filteredReports.length > 0
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredReports.map((r) => r.id) : []
                      )
                    }
                    className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20 cursor-pointer"
                  />
                </th>
                <th className="px-8 py-4 text-left font-bold">Type</th>
                <th className="px-8 py-4 text-left font-bold">Priority</th>
                <th className="px-8 py-4 text-left font-bold">Reporter</th>
                <th className="px-8 py-4 text-left font-bold">Comment</th>
                <th className="px-8 py-4 text-left font-bold">Property</th>
                <th className="px-8 py-4 text-left font-bold">Date</th>
                <th className="px-8 py-4 text-left font-bold">Status</th>
                <th className="px-8 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-white/50 hover:bg-gradient-to-r hover:from-white/50 hover:to-[#f8fafc]/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(report.id)}
                      onChange={() => toggleSelect(report.id)}
                      className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20 cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      <span className={getTypeBadge(report.type)}>
                        {report.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={getPriorityBadge(report.priority)}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-[#003B4C]">{report.reporter}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className="text-[#003B4C] leading-relaxed">{report.comment}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#007C99]" />
                      <span className="font-medium text-[#003B4C]">{report.property}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#007C99]" />
                      <span className="text-[#003B4C]">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={getStatusBadge(report.status)}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#003B4C] mb-2">No Reports Found</h3>
                        <p className="text-[#007C99] font-medium">
                          {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' || priorityFilter !== 'All'
                            ? 'Try adjusting your filters or search terms.'
                            : 'All reports have been resolved. Great job!'}
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

export default AbuseReports;
