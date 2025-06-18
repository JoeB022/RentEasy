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
      <h2 className="text-2xl font-bold text-[#003B4C] mb-6">Landlord Profile</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'profile' ? 'bg-[#003B4C] text-white' : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <UserCircle size={18} /> Profile Info
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'settings' ? 'bg-[#003B4C] text-white' : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* Avatar */}
      {activeTab === 'profile' && (
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://api.dicebear.com/8.x/initials/svg?seed=Joe%20Brian"
            alt="Profile"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <div>
            <p className="font-semibold text-lg">{profile.name}</p>
            <p className="text-sm text-gray-600">Landlord</p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form className="bg-blue-50 shadow p-6 rounded-lg space-y-4 border">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 block w-full border px-3 py-2 rounded ${
                editMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 block w-full border px-3 py-2 rounded ${
                editMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 block w-full border px-3 py-2 rounded ${
                editMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 block w-full border px-3 py-2 rounded ${
                editMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={toggleEdit}
            className={`mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded ${
              editMode ? 'bg-green-600 text-white' : 'bg-[#003B4C] text-white'
            }`}
          >
            {editMode ? <Save size={16} className="mr-2" /> : <Edit3 size={16} className="mr-2" />}
            {editMode ? 'Save' : 'Edit Profile'}
          </button>
        </form>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white shadow p-6 rounded-lg border space-y-6 text-sm text-gray-800">

          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-[#007C99]">
              <Lock size={18} /> Change Password
            </h3>
            <div className="space-y-2">
              <input type="password" placeholder="Current password" className="w-full border px-3 py-2 rounded" />
              <input type="password" placeholder="New password" className="w-full border px-3 py-2 rounded" />
              <input type="password" placeholder="Confirm new password" className="w-full border px-3 py-2 rounded" />
              <button className="mt-2 bg-[#003B4C] text-white px-4 py-2 rounded text-sm">Update Password</button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-[#007C99]">
              <Bell size={18} /> Notifications
            </h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              Enable rent and service alerts
            </label>
          </div>

          {/* Logout & Delete */}
          <div className="flex justify-between mt-6">
            <button className="flex items-center gap-2 text-red-600 hover:underline">
              <Trash2 size={16} /> Delete Account
            </button>
            <button className="flex items-center gap-2 text-[#003B4C] hover:underline">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProfile;
