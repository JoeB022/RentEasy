// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  
  // Admin endpoints
  PENDING_USERS: '/auth/admin/pending-users',
  APPROVE_USER: (id) => `/auth/admin/approve-user/${id}`,
  REJECT_USER: (id) => `/auth/admin/reject-user/${id}`,
  
  // Properties
  PROPERTIES: '/api/properties',
  PROPERTY: (id) => `/api/properties/${id}`,
  PROPERTY_LANDLORD: (id) => `/api/properties/${id}/landlord`,
  LANDLORD_PROPERTIES: '/api/landlord/properties',
  
  // Dashboard
  TENANT_DASHBOARD: '/dashboard/tenant',
  LANDLORD_DASHBOARD: '/dashboard/landlord',
  ADMIN_DASHBOARD: '/dashboard/admin',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

