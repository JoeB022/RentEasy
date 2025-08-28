import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const TenantProfile = ({ tenant }) => {
  const initialProfile =
    tenant ||
    JSON.parse(localStorage.getItem('tenantProfile')) || {
      name: 'Joe Brian',
      email: 'joe@example.com',
      avatar: '',
      phone: '',
      role: 'Tenant',
      location: '',
    };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    if (tenant) setProfile(tenant);
  }, [tenant]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('tenantProfile', JSON.stringify(profile));
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto pt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#003B4C]">
          My Profile
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      <div className="bg-gradient-to-br from-white to-[#f8fafc] shadow-xl rounded-2xl border border-white/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/50">
          <h3 className="text-xl font-semibold text-[#003B4C] flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            Personal Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              isEditing 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 hover:shadow-lg' 
                : 'bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white hover:from-[#0088A3] hover:to-[#00A6C0] hover:shadow-lg'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Avatar */}
        <div className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white flex items-center justify-center text-2xl font-bold overflow-hidden shadow-lg border-4 border-white">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-[#003B4C] mb-1">{profile.name}</h4>
              <p className="text-[#007C99] font-medium text-lg">{profile.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Active Tenant</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-[#003B4C]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-300 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#003B4C]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-300 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-[#003B4C]">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-300 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-[#003B4C]">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value="Tenant"
                readOnly
                className="mt-1 w-full px-4 py-3 border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 text-sm rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-[#003B4C]">
                Preferred Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={profile.location}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-300 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-[#007C99] focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 hover:border-[#007C99]/50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          </form>

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-white/50">
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-[#007C99] text-[#007C99] rounded-xl font-medium hover:bg-[#007C99] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-8 py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TenantProfile.propTypes = {
  tenant: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.string,
    location: PropTypes.string,
  }),
};

export default TenantProfile;
