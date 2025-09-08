import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Shield,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const PendingUserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch pending users from backend
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending users: ${response.status}`);
      }

      const data = await response.json();
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError(err.message);
      toast.error(`Failed to fetch pending users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Approve a user
  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to approve user: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`✅ ${data.user.username} has been approved successfully`);
      
      // Remove the approved user from the list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error approving user:', err);
      toast.error(`Failed to approve user: ${err.message}`);
    }
  };

  // Reject a user
  const rejectUser = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reject user: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`❌ ${data.message}`);
      
      // Remove the rejected user from the list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error rejecting user:', err);
      toast.error(`Failed to reject user: ${err.message}`);
    }
  };

  // Bulk approve users
  const bulkApprove = async () => {
    if (!selectedIds.length) return;
    
    try {
      for (const userId of selectedIds) {
        await approveUser(userId);
      }
      setSelectedIds([]);
    } catch (err) {
      console.error('Error in bulk approve:', err);
    }
  };

  // Bulk reject users
  const bulkReject = async () => {
    if (!selectedIds.length) return;
    
    try {
      for (const userId of selectedIds) {
        await rejectUser(userId);
      }
      setSelectedIds([]);
    } catch (err) {
      console.error('Error in bulk reject:', err);
    }
  };

  // Toggle user selection
  const toggleSelect = (userId) => {
    setSelectedIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#007C99] animate-spin" />
          <span className="text-[#003B4C] font-medium">Loading pending users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#003B4C] mb-2">Error Loading Users</h3>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchPendingUsers}
              className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-6 py-3 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Pending User Approvals</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Approval</p>
              <p className="text-xl font-bold text-yellow-800">{pendingUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Landlords</p>
              <p className="text-xl font-bold text-blue-800">{pendingUsers.filter(u => u.role === 'landlord').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Tenants</p>
              <p className="text-xl font-bold text-green-800">{pendingUsers.filter(u => u.role === 'tenant').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchPendingUsers}
          className="bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white px-4 py-2 rounded-xl hover:from-[#0099B3] hover:to-[#007C99] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-yellow-800 font-medium">
              {selectedIds.length} user(s) selected
            </span>
            <button
              onClick={bulkApprove}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <CheckCircle size={16} /> Approve Selected
            </button>
            <button
              onClick={bulkReject}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <XCircle size={16} /> Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      {pendingUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-green-200 to-green-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <UserCheck className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
              No Pending Users
            </h3>
            <p className="text-[#007C99] font-medium">
              All users have been approved! New registrations will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20 cursor-pointer"
                  />
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#003B4C]">{user.username}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-[#003B4C]">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#007C99]" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#007C99]" />
                        <span>Joined: {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => approveUser(user.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectUser(user.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select All */}
      {pendingUsers.length > 0 && (
        <div className="bg-gradient-to-r from-white to-[#f8fafc] p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
          <label className="inline-flex items-center gap-3 text-[#003B4C] font-medium cursor-pointer hover:text-[#007C99] transition-colors duration-300">
            <input
              type="checkbox"
              checked={selectedIds.length === pendingUsers.length && pendingUsers.length > 0}
              onChange={() => setSelectedIds(
                selectedIds.length === pendingUsers.length ? [] : pendingUsers.map(u => u.id)
              )}
              className="w-4 h-4 text-[#007C99] bg-white border-2 border-[#007C99] rounded focus:ring-2 focus:ring-[#007C99]/20"
            />
            Select All ({pendingUsers.length} users)
          </label>
        </div>
      )}
    </div>
  );
};

export default PendingUserApprovals;
