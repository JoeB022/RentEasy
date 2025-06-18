import React, { useState } from 'react';
import { MailOpen, Mail, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy data
const dummyData = [
  { id: 1, type: 'log', message: 'Admin logged in from new device', date: '2025-06-10', read: false },
  { id: 2, type: 'feedback', message: 'Great platform, but search is slow sometimes.', date: '2025-06-11', read: false },
  { id: 3, type: 'log', message: 'Service rates updated by admin', date: '2025-06-12', read: true },
  { id: 4, type: 'feedback', message: 'Please add more cleaning options for tenants.', date: '2025-06-13', read: false },
];

const TagBadge = ({ read }) => (
  <span
    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium transition ${
      read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    {read ? 'Read' : 'Unread'}
  </span>
);

const LogsAndFeedback = () => {
  const [entries, setEntries] = useState(dummyData);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = entries.filter((entry) => {
    const matchType = filter === 'All' || entry.type === filter.toLowerCase();
    const matchSearch = entry.message.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
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

  return (
    <div className="text-sm">
      {/* Summary Counters */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
          📨 Unread Feedback: {unreadFeedbackCount}
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          📋 Unread Logs: {unreadLogCount}
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="flex gap-2">
          {['All', 'Log', 'Feedback'].map((opt) => (
            <button
              key={opt}
              className={`px-3 py-1 rounded border transition ${
                filter === opt
                  ? 'bg-[#003B4C] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center border rounded px-2 bg-white w-full md:w-80">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            className="w-full px-2 py-1 outline-none text-sm"
            placeholder="Search messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={bulkMarkRead}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            ✅ Mark as Read ({selectedIds.length})
          </button>
          <button
            onClick={bulkDelete}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            🗑️ Delete ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Entry List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              layout
              className={`border rounded-lg p-4 flex justify-between items-start shadow-sm transition ${
                entry.read ? 'bg-white' : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entry.id)}
                  onChange={() => toggleSelect(entry.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {entry.type}
                  </p>
                  <p className="text-gray-700">{entry.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{entry.date}</p>
                  <TagBadge read={entry.read} />
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <button
                  onClick={() => toggleRead(entry.id)}
                  title={entry.read ? 'Mark as Unread' : 'Mark as Read'}
                  className="p-2 rounded hover:bg-gray-100 transition"
                >
                  {entry.read ? (
                    <MailOpen size={16} className="text-green-600" />
                  ) : (
                    <Mail size={16} className="text-yellow-600" />
                  )}
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  title="Delete"
                  className="p-2 rounded hover:bg-gray-100 transition"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-6">No matching results.</p>
        )}
      </div>

      {/* Select All */}
      {filtered.length > 0 && (
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={
                selectedIds.length === filtered.length && filtered.length > 0
              }
              onChange={selectAll}
            />
            Select All
          </label>
        </div>
      )}
    </div>
  );
};

export default LogsAndFeedback;
