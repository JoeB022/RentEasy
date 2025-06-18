import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedinIn } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

// 🔐 Login API call
const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const data = await res.json();
    localStorage.setItem('token', data.access);
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);

    // 🔐 Token-based secure GET request after login
    const token = data.access;
    const secureRes = await fetch('http://localhost:8000/api/your-endpoint/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!secureRes.ok) {
      toast.error('⚠️ Token is invalid or expired.');
    } else {
      const responseData = await secureRes.json();
      console.log('Secure data:', responseData);
    }

    return data;
  } catch (error) {
    toast.error('❌ Login failed: ' + error.message);
    throw error;
  }
};

// 🔓 Logout function
export const logout = () => {
  localStorage.clear();
  toast.success('👋 Logged out');
  window.location.href = '/';
};

// 🛡️ Route protection
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// 🧠 Auth Component
const Auth = ({ mode = 'login', onClose }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [role, setRole] = useState('tenant');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    if (activeTab === 'login') {
      try {
        const res = await login(formData.email, formData.password);
        toast.success('✅ Logged in successfully!');
        if (onClose) onClose();

        const userRole = res.role;
        if (userRole === 'tenant') window.location.href = '/dashboard/tenant';
        else if (userRole === 'landlord') window.location.href = '/dashboard/landlord';
        else if (userRole === 'admin') window.location.href = '/dashboard/admin';
        else window.location.href = '/dashboard';
      } catch (err) {
        // Error handled by toast
      }
    } else {
      toast.success('🎉 Account created successfully! (SignUp not connected)');
      if (onClose) onClose();
    }
  };

  const handleSocialLogin = (provider) => {
    toast(`🔐 ${provider} login not connected yet.`);
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex mb-6 bg-[#f0f4f6] rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition ${
            activeTab === 'login'
              ? 'bg-[#003B4C] text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition ${
            activeTab === 'signup'
              ? 'bg-[#003B4C] text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#003B4C]">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-500">
          {activeTab === 'login'
            ? 'Login to access your dashboard'
            : 'Sign up to get started'}
        </p>
      </div>

      {/* Role Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#007C99] focus:outline-none"
        >
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#007C99] focus:outline-none"
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
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#007C99] focus:outline-none"
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
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#007C99] focus:outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#003B4C] text-white py-2 rounded-md hover:bg-[#005A6E] transition"
        >
          {activeTab === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="text-xs text-gray-500">or continue with</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 transition"
        >
          <FcGoogle className="mr-2 text-xl" />
          Continue with Google
        </button>

        <button
          onClick={() => handleSocialLogin('LinkedIn')}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm rounded-md bg-[#0077B5] text-white hover:opacity-90 transition"
        >
          <FaLinkedinIn className="mr-2 text-xl" />
          Continue with LinkedIn
        </button>
      </div>

      {/* Cancel */}
      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
