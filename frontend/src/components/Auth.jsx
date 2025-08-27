import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedinIn } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { TextInput, SubmitButton } from './forms';
import { setToken, clearToken, isAuthenticated } from '../utils/auth';
import { Button, Typography } from './ui';
import { jwtDecode } from 'jwt-decode';

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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
const register = async (username, email, password, role) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await res.json();
    return data;
  } catch (error) {
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

// 🛡️ Route protection
export const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// 🧠 Auth Component
const Auth = ({ mode = 'login', onClose }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [role, setRole] = useState('tenant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState('');

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
    }
    // Clear backend errors
    setBackendError('');
  };

  const onSubmit = async (data) => {
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
        const res = await register(data.username, data.email, data.password, role);
        toast.success('🎉 Account created successfully!');
        if (onClose) onClose();
        
        // Clear backend error and redirect to login page
        setBackendError('');
        setActiveTab('login');
        signupForm.reset();
      }
    } catch (err) {
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
    <div className="w-full">
      {/* Tabs */}
      <div className="flex mb-6 bg-[#f0f4f6] rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition ${
            activeTab === 'login'
              ? 'bg-[#003B4C] text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => handleTabChange('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium transition ${
            activeTab === 'signup'
              ? 'bg-[#003B4C] text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => handleTabChange('signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <Typography.Heading level={2} className="text-primary-500 mb-2">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </Typography.Heading>
        <Typography.BodyText variant="muted" size="sm">
          {activeTab === 'login'
            ? 'Login to access your dashboard'
            : 'Sign up to get started'}
        </Typography.BodyText>
      </div>

      {/* Role Selector - Only show for signup */}
      {activeTab === 'signup' && (
        <div className="mb-4">
          <Typography.Label className="mb-1">Select Role</Typography.Label>
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
      )}

      {/* Form */}
      <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
        {activeTab === 'signup' && (
          <TextInput
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
            error={currentForm.formState.errors.username?.message}
            {...currentForm.register('username')}
          />
        )}
        
        {/* Backend Error Display */}
        {backendError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {backendError}
          </div>
        )}
        
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          error={currentForm.formState.errors.email?.message}
          {...currentForm.register('email')}
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          error={currentForm.formState.errors.password?.message}
          {...currentForm.register('password')}
        />

        {activeTab === 'signup' && (
          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            error={currentForm.formState.errors.confirmPassword?.message}
            {...currentForm.register('confirmPassword')}
          />
        )}

                          <SubmitButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {activeTab === 'login' ? 'Login' : 'Sign Up'}
                  </SubmitButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="text-xs text-gray-500">or continue with</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          variant="outline"
          fullWidth
          onClick={() => handleSocialLogin('Google')}
        >
          <FcGoogle className="mr-2 text-xl" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => handleSocialLogin('LinkedIn')}
          className="bg-[#0077B5] text-white border-[#0077B5] hover:bg-[#0077B5] hover:opacity-90"
        >
          <FaLinkedinIn className="mr-2 text-xl" />
          Continue with LinkedIn
        </Button>
      </div>

      {/* Cancel */}
      {onClose && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-error-500"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default Auth;
