import React, { useState } from 'react';
import {
  Edit3,
  Save,
  UserCircle,
  Settings,
  Trash2,
  LogOut,
  Bell,
  Lock,
} from 'lucide-react';

const initialProfile = {
  name: 'Joe Brian',
  email: 'joe.brian@example.com',
  phone: '+254712345678',
  location: 'Nairobi, Kenya',
};

const LandlordProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => setEditMode(!editMode);

  return (
    <div className="max-w-4xl mx-auto pt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          Landlord Profile
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Tabs */}
      <div className="bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#003B4C] mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
            <UserCircle className="text-white" size={14} />
          </div>
          Profile Sections
        </h3>
        
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'profile' 
                ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white shadow-lg' 
                : 'bg-white/80 text-[#003B4C] hover:bg-white hover:shadow-md'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCircle size={18} /> Profile Info
          </button>
          <button
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white shadow-lg' 
                : 'bg-white/80 text-[#003B4C] hover:bg-white hover:shadow-md'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      {/* Avatar */}
      {activeTab === 'profile' && (
        <div className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-xl border border-white/50 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://api.dicebear.com/8.x/initials/svg?seed=Joe%20Brian"
                alt="Profile"
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👑</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#003B4C] mb-1">{profile.name}</h3>
              <p className="text-[#007C99] font-medium text-lg">Landlord</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Active Account</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <div className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl p-8 rounded-2xl border border-white/50 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6 text-[#003B4C] flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
              <Edit3 className="text-white" size={16} />
            </div>
            Personal Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#003B4C]">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editMode}
                className={`mt-1 block w-full border-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  editMode 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#003B4C]">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editMode}
                className={`mt-1 block w-full border-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  editMode 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#003B4C]">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editMode}
                className={`mt-1 block w-full border-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  editMode 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#003B4C]">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled={!editMode}
                className={`mt-1 block w-full border-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  editMode 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={toggleEdit}
              className={`inline-flex items-center gap-2 px-8 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                editMode 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white hover:from-[#004A5F] hover:to-[#006B8A]'
              }`}
            >
              {editMode ? <Save size={16} /> : <Edit3 size={16} />}
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Password Change */}
          <div className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl p-8 rounded-2xl border border-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#003B4C]">
              <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={16} />
              </div>
              Change Password
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003B4C]">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003B4C]">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password" 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003B4C]">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50" 
                />
              </div>
            </div>
            <button className="mt-6 bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Update Password
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl p-8 rounded-2xl border border-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#003B4C]">
              <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
                <Bell className="text-white" size={16} />
              </div>
              Notifications
            </h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-5 h-5 text-[#007C99] bg-gray-100 border-gray-300 rounded focus:ring-[#007C99] focus:ring-2 transition-all duration-300"
              />
              <span className="text-[#003B4C] font-medium group-hover:text-[#007C99] transition-colors duration-300">
                Enable rent and service alerts
              </span>
            </label>
            <p className="text-sm text-gray-600 mt-2 ml-8">
              Receive notifications about rent payments, service requests, and important updates
            </p>
          </div>

          {/* Logout & Delete */}
          <div className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl p-8 rounded-2xl border border-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#003B4C]">
              <div className="w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              Account Actions
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-red-200">
                <Trash2 size={16} /> Delete Account
              </button>
              <button className="flex items-center gap-2 text-[#003B4C] hover:text-[#005A6E] bg-[#003B4C]/10 hover:bg-[#003B4C]/20 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-[#003B4C]/20">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProfile;
