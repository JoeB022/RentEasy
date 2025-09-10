import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { Navigate, useNavigate } from 'react-router-dom';
import { TextInput, SubmitButton } from './forms';
import { setToken, clearToken, isAuthenticated, getToken } from '../utils/auth';
import { Button, Typography } from './ui';
import { jwtDecode } from 'jwt-decode';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Home,
  Building2,
  Phone
} from 'lucide-react';

// Validation schemas
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const signupSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// 🔐 Login API call
const login = async (email, password) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await res.json();
    
    // Validate response structure
    if (!data.tokens || !data.user) {
      throw new Error('Invalid response format from server');
    }
    
    // Extract tokens and user data
    const { tokens, user } = data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    
    // Decode JWT to extract role
    let userRole;
    try {
      const decodedToken = jwtDecode(tokens.access_token);
      userRole = decodedToken.role || user.role;
    } catch (decodeError) {
      console.warn('JWT decode failed, using role from user data:', decodeError);
      userRole = user.role;
    }
    
    // Validate and store role in localStorage
    const validRoles = ['tenant', 'landlord', 'admin'];
    if (!validRoles.includes(userRole)) {
      console.warn('Invalid role received:', userRole, 'defaulting to tenant');
      userRole = 'tenant';
    }
    
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('username', user.username);
    
    // Also use the existing auth utility for compatibility
    setToken(tokens.access_token, tokens.refresh_token, userRole, user.username);

    // Log successful login for debugging
    console.log('Login successful:', {
      username: user.username,
      role: userRole,
      tokensStored: !!tokens.access_token
    });

    return { user: { ...user, role: userRole }, tokens };
  } catch (error) {
    toast.error('❌ Login failed: ' + error.message);
    throw error;
  }
};

// 🆕 Registration API call
const register = async (username, email, phone, password, role) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    console.log('Registering user with:', { username, email, phone, role });
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phone, password, role }),
    });

    console.log('Registration response status:', res.status);
    if (!res.ok) {
      const errorData = await res.json();
      console.log('Registration error:', errorData);
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await res.json();
    console.log('Registration success data:', data);
    return data;
  } catch (error) {
    console.log('Registration error caught:', error);
    toast.error('❌ Registration failed: ' + error.message);
    throw error;
  }
};

// 🔓 Logout function
export const logout = () => {
  clearToken();
  
  // Clear localStorage items
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('username');
  
  toast.success('👋 Logged out successfully');
  window.location.href = '/login';
};

// 🗑️ Delete account function
export const deleteAccount = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Account deletion failed');
    }

    const data = await res.json();
    
    // Clear all user data
    clearToken();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    
    toast.success('🗑️ Account deleted successfully');
    window.location.href = '/login';
    
    return data;
  } catch (error) {
    console.error('Delete account error:', error);
    toast.error('❌ Failed to delete account: ' + error.message);
    throw error;
  }
};

// 🛡️ Route protection
export const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// 🧠 Auth Component
const Auth = ({ mode = 'login', onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(mode);
  const [role, setRole] = useState('tenant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already logged in and redirect
  React.useEffect(() => {
    const storedRole = localStorage.getItem('user_role');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedRole && storedToken) {
      // User is already logged in, redirect to appropriate dashboard
      if (storedRole === 'tenant') {
        window.location.href = '/dashboard/tenant';
      } else if (storedRole === 'landlord') {
        window.location.href = '/dashboard/landlord';
      } else if (storedRole === 'admin') {
        window.location.href = '/dashboard/admin';
      }
    }
  }, []);

  // Form hooks for login and signup
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const signupForm = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
  });

  const currentForm = activeTab === 'login' ? loginForm : signupForm;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset form errors when switching tabs
    if (tab === 'login') {
      loginForm.clearErrors();
    } else {
      signupForm.clearErrors();
      // Reset role to tenant when switching to signup (since admin is not available)
      setRole('tenant');
    }
    // Clear backend errors
    setBackendError('');
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    console.log('Active tab:', activeTab);
    console.log('Role:', role);
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'login') {
        const res = await login(data.email, data.password);
        toast.success('✅ Logged in successfully!');
        if (onClose) onClose();
        
        // Clear backend error
        setBackendError('');
        
        // Get role from localStorage (set by login function)
        const userRole = localStorage.getItem('user_role');
        
        // Redirect based on role
        if (userRole === 'tenant') {
          window.location.href = '/dashboard/tenant';
        } else if (userRole === 'landlord') {
          window.location.href = '/dashboard/landlord';
        } else if (userRole === 'admin') {
          window.location.href = '/dashboard/admin';
        } else {
          // Fallback to general dashboard
          window.location.href = '/dashboard';
        }
      } else {
        // Handle registration
        console.log('Starting registration process...');
        const res = await register(data.username, data.email, data.phone, data.password, role);
        console.log('Registration response:', res);
        
        // Check if user needs approval
        if (res.requires_approval) {
          toast.success('🎉 Account created successfully! Your account is pending admin approval. Redirecting to login...');
        } else {
          toast.success('🎉 Account created successfully! Redirecting to login...');
        }
        
        // Clear backend error and redirect to login page
        setBackendError('');
        
        // Redirect to login page after successful registration
        console.log('Setting up redirect to login page...');
        setTimeout(() => {
          console.log('Redirecting to login page now...');
          // Always use window.location.href for reliable redirect
          window.location.href = '/login';
        }, 2000); // Increased delay to ensure user sees the message
      }
    } catch (err) {
      console.log('Error in form submission:', err);
      // Error handled by toast
      setBackendError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast(`🔐 ${provider} login not connected yet.`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Container with Beautiful Background */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 p-6 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm overflow-hidden min-h-[650px]">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <div className="relative text-center mb-4">
          {/* Logo Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-[#007C99] via-[#0099B3] to-[#00B3CC] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#003B4C] to-[#007C99] bg-clip-text text-transparent mb-2">
            {activeTab === 'login' ? 'Welcome Back' : 'Join RentEasy'}
          </h1>
          
          {/* Subtitle */}
          <p className="text-[#007C99] font-medium text-sm">
            {activeTab === 'login' 
              ? 'Sign in to access your dashboard' 
              : 'Create your account to get started'
            }
          </p>
          
          {/* Decorative Line */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#007C99] via-[#0099B3] to-[#00B3CC] rounded-full mx-auto mt-2"></div>
        </div>

        {/* Enhanced Tabs */}
        <div className="relative mb-4">
          <div className="flex bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl overflow-hidden shadow-lg border border-white/50 p-1">
            <button
              className={`flex-1 py-2 text-center text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'login'
                  ? 'text-white'
                  : 'text-[#003B4C] hover:text-[#007C99]'
              }`}
              onClick={() => handleTabChange('login')}
            >
              {activeTab === 'login' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl shadow-lg transform scale-105"></div>
              )}
              <div className="relative flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'signup'
                  ? 'text-white'
                  : 'text-[#003B4C] hover:text-[#007C99]'
              }`}
              onClick={() => handleTabChange('signup')}
            >
              {activeTab === 'signup' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl shadow-lg transform scale-105"></div>
              )}
              <div className="relative flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Role Selector - Only show for signup */}
        {activeTab === 'signup' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#003B4C] mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#007C99]" />
              Choose Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('tenant')}
                className={`p-2 rounded-xl border-2 transition-all duration-300 text-center group ${
                  role === 'tenant'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-800 shadow-lg transform scale-105'
                    : 'bg-white/80 border-gray-200 text-[#003B4C] hover:border-[#007C99]/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    role === 'tenant' ? 'bg-blue-500 shadow-lg' : 'bg-gray-300 group-hover:bg-blue-400'
                  }`}>
                    <Home className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-xs">Tenant</span>
                  <span className="text-xs opacity-75">Looking for a home</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('landlord')}
                className={`p-2 rounded-xl border-2 transition-all duration-300 text-center group ${
                  role === 'landlord'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800 shadow-lg transform scale-105'
                    : 'bg-white/80 border-gray-200 text-[#003B4C] hover:border-[#007C99]/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    role === 'landlord' ? 'bg-green-500 shadow-lg' : 'bg-gray-300 group-hover:bg-green-400'
                  }`}>
                    <Building2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-xs">Landlord</span>
                  <span className="text-xs opacity-75">Own properties</span>
                </div>
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-[#007C99] bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm font-medium">
                💡 Admin roles are created securely through server administration only.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Form */}
        <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-3 mb-4">
          {activeTab === 'signup' && (
            <div className="relative group">
              <label className="block text-sm font-semibold text-[#003B4C] mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[#007C99]" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full px-3 py-2 pl-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 bg-white/80 backdrop-blur-sm ${
                    currentForm.formState.errors.username
                      ? 'border-red-300 bg-red-50'
                      : 'border-[#007C99]/30 hover:border-[#007C99]/50 focus:border-[#007C99]'
                  }`}
                  {...currentForm.register('username')}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]/60" />
              </div>
              {currentForm.formState.errors.username && (
                <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {currentForm.formState.errors.username.message}
                </div>
              )}
            </div>
          )}
          
          {/* Enhanced Backend Error Display */}
          {backendError && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg">
              <AlertCircle className="w-4 h-4" />
              {backendError}
            </div>
          )}
          
          <div className="relative group">
            <label className="block text-sm font-semibold text-[#003B4C] mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#007C99]" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-2 pl-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 bg-white/80 backdrop-blur-sm ${
                  currentForm.formState.errors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-[#007C99]/30 hover:border-[#007C99]/50 focus:border-[#007C99]'
                }`}
                {...currentForm.register('email')}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]/60" />
            </div>
            {currentForm.formState.errors.email && (
              <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {currentForm.formState.errors.email.message}
              </div>
            )}
          </div>

          {activeTab === 'signup' && (
            <div className="relative group">
              <label className="block text-sm font-semibold text-[#003B4C] mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#007C99]" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter your phone number (e.g., +254712345678)"
                  className={`w-full px-3 py-2 pl-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 bg-white/80 backdrop-blur-sm ${
                    currentForm.formState.errors.phone
                      ? 'border-red-300 bg-red-50'
                      : 'border-[#007C99]/30 hover:border-[#007C99]/50 focus:border-[#007C99]'
                  }`}
                  {...currentForm.register('phone')}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]/60" />
              </div>
              {currentForm.formState.errors.phone && (
                <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {currentForm.formState.errors.phone.message}
                </div>
              )}
            </div>
          )}

          <div className="relative group">
            <label className="block text-sm font-semibold text-[#003B4C] mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#007C99]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 pl-10 pr-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 bg-white/80 backdrop-blur-sm ${
                  currentForm.formState.errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-[#007C99]/30 hover:border-[#007C99]/50 focus:border-[#007C99]'
                }`}
                {...currentForm.register('password')}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]/60" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#007C99] hover:text-[#003B4C] transition-colors duration-300 p-1 rounded hover:bg-[#007C99]/10"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {currentForm.formState.errors.password && (
              <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {currentForm.formState.errors.password.message}
              </div>
            )}
          </div>

          {activeTab === 'signup' && (
            <div className="relative group">
              <label className="block text-sm font-semibold text-[#003B4C] mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#007C99]" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 pl-10 pr-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007C99]/20 bg-white/80 backdrop-blur-sm ${
                    currentForm.formState.errors.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-[#007C99]/30 hover:border-[#007C99]/50 focus:border-[#007C99]'
                  }`}
                  {...currentForm.register('confirmPassword')}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#007C99]/60" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#007C99] hover:text-[#003B4C] transition-colors duration-300 p-1 rounded hover:bg-[#007C99]/10"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {currentForm.formState.errors.confirmPassword && (
                <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {currentForm.formState.errors.confirmPassword.message}
                </div>
              )}
            </div>
          )}

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#007C99] via-[#0099B3] to-[#00B3CC] text-white py-2 px-6 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/25 mt-3"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </div>
            )}
          </button>
        </form>

        {/* Enhanced Divider */}
        <div className="flex items-center gap-3 my-3">
          <hr className="flex-1 border-[#007C99]/20" />
          <span className="text-xs text-[#007C99] font-medium bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm">
            or continue with
          </span>
          <hr className="flex-1 border-[#007C99]/20" />
        </div>

        {/* Enhanced Social Login */}
        <div className="space-y-3 mb-3">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full bg-white border-2 border-gray-200 text-[#003B4C] py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:border-[#007C99]/50 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-3 group"
          >
            <FcGoogle className="text-lg group-hover:scale-110 transition-transform duration-300" />
            Continue with Google
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-[#007C99]/70">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
