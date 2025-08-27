import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogoutButton = ({ 
  className = '', 
  variant = 'default',
  size = 'md',
  children,
  onLogout 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear all authentication data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
      
      // Also clear any existing auth tokens (for compatibility)
      if (typeof window !== 'undefined' && window.clearToken) {
        window.clearToken();
      }
      
      // Show success message
      toast.success('👋 Logged out successfully');
      
      // Call custom onLogout callback if provided
      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      }
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ Logout failed. Please try again.');
    }
  };

  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };
  
  // Color variants
  const variantClasses = {
    default: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500',
    ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 shadow-sm hover:shadow-md',
    subtle: 'bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500'
  };

  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      onClick={handleLogout}
      className={buttonClasses}
      type="button"
      aria-label="Logout"
    >
      {/* Logout Icon */}
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
      
      {/* Button Text */}
      {children || 'Logout'}
    </button>
  );
};

export default LogoutButton;
