import React, { useState } from 'react';
import {
  ShieldCheck,
  XCircle,
  Trash2,
  Edit2,
  Save,
  ChevronDown,
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

const dummyUsers = [
  { id: 1, name: 'Jane Mwende', email: 'jane@renteasy.co.ke', role: 'tenant', status: 'active', joinDate: '2025-01-10' },
  { id: 2, name: 'John Kariuki', email: 'john@homes.co.ke', role: 'landlord', status: 'suspended', joinDate: '2025-01-08' },
  { id: 3, name: 'Grace Admin', email: 'admin@renteasy.co.ke', role: 'admin', status: 'active', joinDate: '2025-01-05' },
  { id: 4, name: 'Sarah Kamau', email: 'sarah@properties.co.ke', role: 'tenant', status: 'active', joinDate: '2025-01-12' },
  { id: 5, name: 'David Ochieng', email: 'david@realestate.co.ke', role: 'landlord', status: 'active', joinDate: '2025-01-15' },
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-md">
            ✅ Active
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 shadow-md">
            ⚠️ Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-md">
            ❓ Unknown
          </span>
        );
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 shadow-md">
            👑 Admin
          </span>
        );
      case 'landlord':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 shadow-md">
            🏠 Landlord
          </span>
        );
      case 'tenant':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-md">
            🏡 Tenant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-md">
            ❓ Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Manage Users</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-xl font-bold text-blue-800">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-xl font-bold text-green-800">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Suspended</p>
              <p className="text-xl font-bold text-yellow-800">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Admins</p>
              <p className="text-xl font-bold text-purple-800">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Role and Status Tabs */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007C99]" />
              <span className="text-sm font-medium text-[#003B4C]">Role:</span>
            </div>
            <div className="flex gap-2">
              {['All', 'Tenant', 'Landlord', 'Admin'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                    roleTab === tab
                      ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                      : 'text-[#003B4C] border-[#007C99] hover:bg-gradient-to-r hover:from-[#007C99]/10 hover:to-[#0099B3]/10 hover:border-[#007C99] hover:shadow-md'
                  }`}
                  onClick={() => setRoleTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007C99]" />
              <span className="text-sm font-medium text-[#003B4C]">Status:</span>
            </div>
            <div className="flex gap-2">
              {['All', 'Active', 'Suspended'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                    statusTab === tab
                      ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                      : 'text-[#003B4C] border-[#007C99] hover:bg-gradient-to-r hover:from-[#007C99]/10 hover:to-[#0099B3]/10 hover:border-[#007C99] hover:shadow-md'
                  }`}
                  onClick={() => setStatusTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {sortedUsers.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
              No users found
            </h3>
            <p className="text-[#007C99] font-medium">
              Try adjusting your search criteria or filters to find users.
            </p>
          </div>
        </div>
      ) : (
        // Users Table
        <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] text-[#003B4C]">
                  <th 
                    className="px-8 py-4 font-bold text-left border-b border-white/50 cursor-pointer hover:bg-[#F0FDFF] transition-colors duration-200"
                    onClick={() => {
                      setSortField('name');
                      setSortAsc(prev => (sortField === 'name' ? !prev : true));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortField === 'name' && (
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-200 ${
                            sortAsc ? 'rotate-0' : 'rotate-180'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-8 py-4 font-bold text-left border-b border-white/50 cursor-pointer hover:bg-[#F0FDFF] transition-colors duration-200"
                    onClick={() => {
                      setSortField('email');
                      setSortAsc(prev => (sortField === 'email' ? !prev : true));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortField === 'email' && (
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-200 ${
                            sortAsc ? 'rotate-0' : 'rotate-180'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Role</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Status</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Join Date</th>
                  <th className="px-8 py-4 font-bold text-left border-b border-white/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {sortedUsers.map(({ id, name, email, role, status, joinDate }) => {
                  const isEditing = editingId === id;
                  return (
                    <tr key={id} className="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 group">
                      <td className="px-8 py-6">
                        {isEditing ? (
                          <input
                            defaultValue={name}
                            className="w-full px-3 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 bg-white/80"
                            onChange={e => updateUser(id, { name: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium text-[#003B4C] group-hover:text-[#007C99] transition-colors duration-300">
                            {name}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {isEditing ? (
                          <input
                            defaultValue={email}
                            className="w-full px-3 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 bg-white/80"
                            onChange={e => updateUser(id, { email: e.target.value })}
                          />
                        ) : (
                          <span className="text-[#007C99] group-hover:text-[#003B4C] transition-colors duration-300">
                            {email}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {getRoleBadge(role)}
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                          {new Date(joinDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(id, name, email)}
                              className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              title="Save Changes"
                            >
                              <Save size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingId(id)}
                              className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          
                          {role !== 'admin' && (
                            <button
                              onClick={() => handleAction(id, 'promote')}
                              className="p-2 bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white rounded-xl hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              title="Promote to Admin"
                            >
                              <ShieldCheck size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleAction(id, 'suspend')}
                            className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            title="Suspend User"
                          >
                            <XCircle size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
