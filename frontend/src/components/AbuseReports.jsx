import React, { useState } from 'react';
import { Trash2, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Sample combined data (abuse + comment flags)
const dummyReports = [
  { id: 1, type: 'abuse', reporter: 'James Mwangi', comment: 'Tenant left trash everywhere', date: '2025-06-12', property: 'Green View', status: 'unresolved' },
  { id: 2, type: 'comment', reporter: 'Faith Wanjiku', comment: 'Inappropriate language in review', date: '2025-06-10', property: 'Sunrise Villas', status: 'unresolved' },
  { id: 3, type: 'abuse', reporter: 'Moses Otieno', comment: 'Excessive noise complaints', date: '2025-06-13', property: 'Lake Breeze', status: 'resolved' },
  { id: 4, type: 'comment', reporter: 'Mary Njoki', comment: 'Spam comments', date: '2025-06-14', property: 'Sunset Towers', status: 'unresolved' },
];

const AbuseReports = () => {
  const [reports, setReports] = useState(dummyReports);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
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
    const matchesSearch =
      r.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.property.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="text-sm">
      {/* Filters and Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="All">All Types</option>
            <option value="abuse">Abuse Reports</option>
            <option value="comment">Flagged Comments</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="All">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>

          <button
            onClick={bulkResolve}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            <Check size={14} className="inline-block mr-1" /> Resolve
          </button>

          <button
            onClick={bulkDelete}
            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          >
            <Trash2 size={14} className="inline-block mr-1" /> Delete
          </button>
        </div>

        <div className="flex items-center border rounded px-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search reporter/property"
            className="px-2 py-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-[#003B4C] text-white">
            <tr>
              <th className="px-4 py-2">
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
                />
              </th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Reporter</th>
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-left">Property</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(report.id)}
                    onChange={() => toggleSelect(report.id)}
                  />
                </td>
                <td className="px-4 py-2 capitalize">{report.type}</td>
                <td className="px-4 py-2">{report.reporter}</td>
                <td className="px-4 py-2">{report.comment}</td>
                <td className="px-4 py-2">{report.property}</td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-6">
                  No reports match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbuseReports;
