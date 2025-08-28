import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
  Filter,
  Users,
  Shield,
  User,
  Calendar,
  Mail,
  Eye,
  MoreHorizontal,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const dummyUsers = [
  { id: 1, name: 'Jane Wanjiku', email: 'jane@gmail.com', role: 'tenant', status: 'active', joined: '2024-11-12', lastActive: '2025-01-20' },
  { id: 2, name: 'David Otieno', email: 'david@gmail.com', role: 'landlord', status: 'suspended', joined: '2025-01-05', lastActive: '2025-01-15' },
  { id: 3, name: 'Lucy Kendi', email: 'lucy@gmail.com', role: 'tenant', status: 'active', joined: '2025-03-18', lastActive: '2025-01-21' },
  { id: 4, name: 'Brian Mwangi', email: 'brian@estate.co.ke', role: 'landlord', status: 'active', joined: '2024-12-10', lastActive: '2025-01-19' },
  { id: 5, name: 'Admin Joe', email: 'admin@renteasy.com', role: 'admin', status: 'active', joined: '2024-10-01', lastActive: '2025-01-21' },
  { id: 6, name: 'Sarah Kamau', email: 'sarah@properties.co.ke', role: 'tenant', status: 'active', joined: '2025-01-08', lastActive: '2025-01-20' },
  { id: 7, name: 'Michael Ochieng', email: 'michael@homes.co.ke', role: 'landlord', status: 'active', joined: '2024-11-20', lastActive: '2025-01-18' },
  { id: 8, name: 'Grace Wambui', email: 'grace@renteasy.co.ke', role: 'admin', status: 'active', joined: '2024-09-15', lastActive: '2025-01-21' },
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
    toast.success('✅ User suspended successfully');
  };

  const activateUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'active' } : u
      )
    );
    toast.success('✅ User reactivated successfully');
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('🗑️ User deleted successfully');
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300`;
      case 'suspended':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-xl text-xs font-semibold border-2";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300`;
      case 'landlord':
        return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300`;
      case 'tenant':
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300`;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'landlord':
        return <User className="w-4 h-4 text-yellow-600" />;
      case 'tenant':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">User Data Management</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-blue-600 font-medium mb-1">Total Users</h4>
              <p className="text-2xl font-bold text-blue-800">{totalUsers}</p>
              <div className="text-xs text-blue-600 mt-1">All registered users</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Active Users</h4>
              <p className="text-2xl font-bold text-green-800">{activeUsers}</p>
              <div className="text-xs text-green-600 mt-1">Currently active</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-600 font-medium mb-1">Suspended Users</h4>
              <p className="text-2xl font-bold text-red-800">{suspendedUsers}</p>
              <div className="text-xs text-red-600 mt-1">Temporarily disabled</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-600 font-medium mb-1">Admin Users</h4>
              <p className="text-2xl font-bold text-purple-800">{adminUsers}</p>
              <div className="text-xs text-purple-600 mt-1">System administrators</div>
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="tenant">Tenants</option>
                <option value="landlord">Landlords</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#007C99]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <button className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-4 py-2 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <UserPlus size={16} /> Add New User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-8 py-4 text-left font-bold">User</th>
                <th className="px-8 py-4 text-left font-bold">Role</th>
                <th className="px-8 py-4 text-left font-bold">Status</th>
                <th className="px-8 py-4 text-left font-bold">Join Date</th>
                <th className="px-8 py-4 text-left font-bold">Last Active</th>
                <th className="px-8 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/50 hover:bg-gradient-to-r hover:from-white/50 hover:to-[#f8fafc]/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#003B4C] text-lg">{user.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-[#007C99]" />
                          <span className="text-[#007C99] text-sm">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#007C99]" />
                      <span className="text-[#003B4C] bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {user.joined}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#007C99]" />
                      <span className="text-[#003B4C] bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {user.lastActive}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                          onClick={() => suspendUser(user.id)}
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                          onClick={() => activateUser(user.id)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#003B4C] mb-2">No Users Found</h3>
                        <p className="text-[#007C99] font-medium">
                          {search || statusFilter !== 'All' || roleFilter !== 'All'
                            ? 'Try adjusting your filters or search terms.'
                            : 'No users available. Add your first user to get started!'}
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

export default AllUsers;
