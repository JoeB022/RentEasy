import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Auth = ({ mode = 'login', onClose }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [role, setRole] = useState('tenant');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    // Simulate auth logic
    console.log({
      action: activeTab,
      role,
      ...formData,
    });

    toast.success(
      activeTab === 'login'
        ? '✅ Logged in successfully!'
        : '🎉 Account created successfully!'
    );

    if (onClose) onClose(); // close the modal after success
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'signup' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Headings */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <h3 className="text-sm text-gray-500">
          {activeTab === 'login' ? 'Please sign in to continue' : 'Please sign up to continue'}
        </h3>
      </div>

      {/* Role Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {activeTab === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {activeTab === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {/* Optional Close Button at bottom for smaller screens */}
      {onClose && (
        <div className="mt-4 text-center">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-red-500">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
