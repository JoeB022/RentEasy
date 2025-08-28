import React, { useState } from 'react';
import {
  MailOpen,
  Mail,
  Trash2,
  Search,
  Filter,
  MessageSquare,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Archive,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy data
const dummyData = [
  { id: 1, type: 'log', message: 'Admin logged in from new device', date: '2025-01-20', read: false, priority: 'low', category: 'Authentication' },
  { id: 2, type: 'feedback', message: 'Great platform, but search is slow sometimes. Would love to see improvements in performance.', date: '2025-01-19', read: false, priority: 'medium', category: 'Performance' },
  { id: 3, type: 'log', message: 'Service rates updated by admin - Cleaning service increased to KES 2000', date: '2025-01-18', read: true, priority: 'high', category: 'System' },
  { id: 4, type: 'feedback', message: 'Please add more cleaning options for tenants. The current selection is limited.', date: '2025-01-17', read: false, priority: 'high', category: 'Feature Request' },
  { id: 5, type: 'log', message: 'New user registration: jane@example.com', date: '2025-01-16', read: true, priority: 'low', category: 'User Management' },
  { id: 6, type: 'feedback', message: 'The mobile app is fantastic! Easy to use and intuitive interface.', date: '2025-01-15', read: true, priority: 'low', category: 'User Experience' },
  { id: 7, type: 'log', message: 'Database backup completed successfully', date: '2025-01-14', read: true, priority: 'medium', category: 'System' },
  { id: 8, type: 'feedback', message: 'Can you add a dark mode option? The current theme is too bright for night use.', date: '2025-01-13', read: false, priority: 'medium', category: 'Feature Request' },
];

const TagBadge = ({ read, priority, category }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border-2 transition ${
        read
          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300'
          : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
      }`}
    >
      {read ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
      {read ? 'Read' : 'Unread'}
    </span>
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border-2 ${
        priority === 'high'
          ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300'
          : priority === 'medium'
          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
          : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300'
      }`}
    >
      <AlertTriangle className="w-3 h-3" />
      {priority}
    </span>
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
      {category}
    </span>
  </div>
);

const LogsAndFeedback = () => {
  const [entries, setEntries] = useState(dummyData);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filtered = entries.filter((entry) => {
    const matchType = filter === 'All' || entry.type === filter.toLowerCase();
    const matchSearch = entry.message.toLowerCase().includes(search.toLowerCase()) ||
                       entry.category.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'All' || entry.priority === priorityFilter.toLowerCase();
    return matchType && matchSearch && matchPriority;
  });

  const showToast = (msg, icon = '✅') =>
    toast.success(`${icon} ${msg}`, {
      style: {
        background: '#003B4C',
        color: '#fff',
        borderRadius: '6px',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#fff',
      },
    });

  const toggleRead = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, read: !entry.read } : entry
      )
    );
    showToast('Status updated', '📬');
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    showToast('Entry deleted', '🗑️');
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const ids = filtered.map((e) => e.id);
    setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
  };

  const bulkMarkRead = () => {
    setEntries((prev) =>
      prev.map((e) =>
        selectedIds.includes(e.id) ? { ...e, read: true } : e
      )
    );
    showToast('Marked selected as read');
    setSelectedIds([]);
  };

  const bulkDelete = () => {
    setEntries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
    showToast('Deleted selected', '🗑️');
    setSelectedIds([]);
  };

  const unreadFeedbackCount = entries.filter(e => e.type === 'feedback' && !e.read).length;
  const unreadLogCount = entries.filter(e => e.type === 'log' && !e.read).length;
  const totalEntries = entries.length;
  const highPriorityCount = entries.filter(e => e.priority === 'high').length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'log':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Feedback & System Logs</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-blue-600 font-medium mb-1">Total Entries</h4>
              <p className="text-2xl font-bold text-blue-800">{totalEntries}</p>
              <div className="text-xs text-blue-600 mt-1">All feedback & logs</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-yellow-600 font-medium mb-1">Unread Feedback</h4>
              <p className="text-2xl font-bold text-yellow-800">{unreadFeedbackCount}</p>
              <div className="text-xs text-yellow-600 mt-1">Requires attention</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Unread Logs</h4>
              <p className="text-2xl font-bold text-green-800">{unreadLogCount}</p>
              <div className="text-xs text-green-600 mt-1">System notifications</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-600 font-medium mb-1">High Priority</h4>
              <p className="text-2xl font-bold text-red-800">{highPriorityCount}</p>
              <div className="text-xs text-red-600 mt-1">Urgent attention</div>
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
              {['All', 'Log', 'Feedback'].map((opt) => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium ${
                    filter === opt
                      ? 'bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white border-[#007C99] shadow-lg'
                      : 'bg-white/80 text-[#003B4C] border-[#007C99]/30 hover:border-[#007C99]/50 hover:bg-white backdrop-blur-sm'
                  }`}
                  onClick={() => setFilter(opt)}
                >
                  {opt}
                </button>
              ))}
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

          <button className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-4 py-2 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search messages or categories..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-yellow-800 font-medium">
              {selectedIds.length} item(s) selected
            </span>
            <button
              onClick={bulkMarkRead}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <CheckCircle size={16} /> Mark as Read
            </button>
            <button
              onClick={bulkDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Trash2 size={16} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Entry List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              layout
              className={`border-2 rounded-2xl p-6 flex justify-between items-start shadow-lg transition-all duration-300 hover:shadow-xl ${
                entry.read
                  ? 'bg-gradient-to-br from-white to-[#f8fafc] border-white/50'
                  : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
              }`}
            >
              <div className="flex items-start gap-4 w-full">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entry.id)}
                  onChange={() => toggleSelect(entry.id)}
                  className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20 cursor-pointer mt-1"
                />
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                    {getTypeIcon(entry.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-[#003B4C] capitalize">
                        {entry.type}
                      </h4>
                      <span className="text-[#007C99] text-sm bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-[#003B4C] text-base leading-relaxed mb-3">{entry.message}</p>
                    <TagBadge read={entry.read} priority={entry.priority} category={entry.category} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-start ml-4">
                <button
                  onClick={() => toggleRead(entry.id)}
                  title={entry.read ? 'Mark as Unread' : 'Mark as Read'}
                  className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl ${
                    entry.read
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                  }`}
                >
                  {entry.read ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  title="Delete"
                  className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003B4C] mb-2">No Entries Found</h3>
                <p className="text-[#007C99] font-medium">
                  {search || filter !== 'All' || priorityFilter !== 'All'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No feedback or logs available. Everything is up to date!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select All */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-white to-[#f8fafc] p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
          <label className="inline-flex items-center gap-3 text-[#003B4C] font-medium cursor-pointer hover:text-[#007C99] transition-colors duration-300">
            <input
              type="checkbox"
              checked={selectedIds.length === filtered.length && filtered.length > 0}
              onChange={selectAll}
              className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20"
            />
            Select All ({filtered.length} entries)
          </label>
        </div>
      )}
    </div>
  );
};

export default LogsAndFeedback;
