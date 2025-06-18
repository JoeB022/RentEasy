import React, { useState } from 'react';
import {
  ShieldCheck,
  XCircle,
  Trash2,
  Edit2,
  Save,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const dummyUsers = [
  { id: 1, name: 'Jane Mwende', email: 'jane@renteasy.co.ke', role: 'tenant', status: 'active' },
  { id: 2, name: 'John Kariuki', email: 'john@homes.co.ke', role: 'landlord', status: 'suspended' },
  { id: 3, name: 'Grace Admin', email: 'admin@renteasy.co.ke', role: 'admin', status: 'active' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [roleTab, setRoleTab] = useState('All');
  const [statusTab, setStatusTab] = useState('All');

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const handleAction = (id, action) => {
    if (action === 'promote') {
      updateUser(id, { role: 'admin' });
      toast.success('✅ User promoted to admin');
    } else if (action === 'suspend') {
      updateUser(id, { status: 'suspended' });
      toast.success('⚠️ User suspended');
    }
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('🗑️ User deleted');
  };

  const handleSave = (id, name, email) => {
    updateUser(id, { name, email });
    setEditingId(null);
    toast.success('✏️ User info updated');
  };

  const filteredUsers = users.filter(user => {
    const matchRole = roleTab === 'All' || user.role === roleTab.toLowerCase();
    const matchStatus = statusTab === 'All' || user.status === statusTab.toLowerCase();
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField].toLowerCase();
    const valB = b[sortField].toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const tabStyles = (active, tab) =>
    `px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
      active === tab
        ? 'bg-[#003B4C] text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  const getRowBg = (status) => {
    return status === 'active'
      ? 'bg-green-50'
      : status === 'suspended'
      ? 'bg-yellow-50'
      : '';
  };

  return (
    <div className="text-sm">
      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex gap-2">
          {['All', 'Tenant', 'Landlord', 'Admin'].map(tab => (
            <button
              key={tab}
              className={tabStyles(roleTab, tab)}
              onClick={() => setRoleTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Suspended'].map(tab => (
            <button
              key={tab}
              className={tabStyles(statusTab, tab)}
              onClick={() => setStatusTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto border px-3 py-1.5 rounded w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-[#003B4C] text-white">
            <tr>
              {['name', 'email', 'role', 'status'].map(field => (
                <th
                  key={field}
                  onClick={() => {
                    setSortField(field);
                    setSortAsc(prev => (sortField === field ? !prev : true));
                  }}
                  className="px-4 py-2 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1 capitalize">
                    {field}
                    {sortField === field && (
                      <ChevronDown
                        size={14}
                        className={`transform ${
                          sortAsc ? 'rotate-0' : 'rotate-180'
                        } transition`}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(({ id, name, email, role, status }) => {
              const isEditing = editingId === id;
              return (
                <tr key={id} className={`${getRowBg(status)} border-b`}>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        defaultValue={name}
                        className="border rounded px-2 py-1 w-full"
                        onChange={e => updateUser(id, { name: e.target.value })}
                      />
                    ) : (
                      name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        defaultValue={email}
                        className="border rounded px-2 py-1 w-full"
                        onChange={e => updateUser(id, { email: e.target.value })}
                      />
                    ) : (
                      email
                    )}
                  </td>
                  <td className="px-4 py-2 capitalize">{role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(id, name, email)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {role !== 'admin' && (
                      <button
                        onClick={() => handleAction(id, 'promote')}
                        className="text-[#003B4C] hover:text-green-600"
                        title="Promote to Admin"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(id, 'suspend')}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Suspend User"
                    >
                      <XCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
