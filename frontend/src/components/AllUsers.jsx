import React, { useState } from 'react';
import { Search, UserCheck, UserX, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const dummyUsers = [
  { id: 1, name: 'Jane Wanjiku', email: 'jane@gmail.com', role: 'tenant', status: 'active', joined: '2024-11-12' },
  { id: 2, name: 'David Otieno', email: 'david@gmail.com', role: 'landlord', status: 'suspended', joined: '2025-01-05' },
  { id: 3, name: 'Lucy Kendi', email: 'lucy@gmail.com', role: 'tenant', status: 'active', joined: '2025-03-18' },
  { id: 4, name: 'Brian Mwangi', email: 'brian@estate.co.ke', role: 'landlord', status: 'active', joined: '2024-12-10' },
  { id: 5, name: 'Admin Joe', email: 'admin@renteasy.com', role: 'admin', status: 'active', joined: '2024-10-01' },
];

const AllUsers = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || user.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const suspendUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'suspended' } : u
      )
    );
    toast.success('User suspended');
  };

  const activateUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'active' } : u
      )
    );
    toast.success('User reactivated');
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('User deleted');
  };

  return (
    <div className="text-sm">
      <h2 className="text-lg font-semibold mb-4 text-[#003B4C]">All Users</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Roles</option>
            <option value="tenant">Tenants</option>
            <option value="landlord">Landlords</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center border rounded px-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="px-2 py-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-[#003B4C] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'tenant'
                        ? 'bg-blue-100 text-blue-700'
                        : user.role === 'landlord'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2">{user.joined}</td>
                <td className="px-4 py-2 space-x-2">
                  {user.status === 'active' ? (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => suspendUser(user.id)}
                    >
                      <UserX size={16} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => activateUser(user.id)}
                    >
                      <UserCheck size={16} />
                    </button>
                  )}
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-6">
                  No users match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
