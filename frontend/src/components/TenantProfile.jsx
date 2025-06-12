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
    <div className="mt-20 mb-10 bg-[#E6F8FA] shadow-sm rounded-lg p-6 border border-white-200">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#003B4C]">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#003B4C] text-white flex items-center justify-center text-lg font-semibold overflow-hidden">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>
        <span className="text-md font-medium">{profile.name}</span>
      </div>

      {/* Form Fields */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 w-full px-3 py-2 border rounded-md text-sm ${
              isEditing ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 w-full px-3 py-2 border rounded-md text-sm ${
              isEditing ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 w-full px-3 py-2 border rounded-md text-sm ${
              isEditing ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        <div>
  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
    Role
  </label>
  <input
    type="text"
    id="role"
    name="role"
    value="Tenant"
    readOnly
    className="mt-1 w-full px-3 py-2 border border-gray-300 bg-gray-100 text-sm rounded-md cursor-not-allowed"
  />
</div>


        <div className="sm:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Preferred Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 w-full px-3 py-2 border rounded-md text-sm ${
              isEditing ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>
      </form>

      {isEditing && (
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="bg-[#003B4C] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      )}
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
