// API Configuration
export const API_BASE_URL = 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  
  // Properties
  PROPERTIES: '/api/properties',
  PROPERTY: (id) => `/api/properties/${id}`,
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

