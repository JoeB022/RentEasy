import { jwtDecode } from 'jwt-decode';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'user_role';
const USERNAME_KEY = 'username';

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Get access token from localStorage
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Set both access and refresh tokens
export const setToken = (accessToken, refreshToken, role, username) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_ROLE_KEY, role);
  localStorage.setItem(USERNAME_KEY, username);
};

// Clear all tokens and user data
export const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY);
};

// Get username
export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const role = getUserRole();
  
  console.log('[DEBUG] isAuthenticated check:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    hasRole: !!role,
    role: role
  });
  
  // Check if both token and role exist and are not empty
  const hasValidToken = token && token.trim() !== '';
  const hasValidRole = role && role.trim() !== '';
  
  const result = hasValidToken && hasValidRole;
  
  console.log('[DEBUG] isAuthenticated result:', result);
  return Boolean(result); // Ensure we return a boolean
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshTokenValue = getRefreshToken();
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    // Call the actual backend refresh endpoint
    const response = await fetch('http://localhost:8000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshTokenValue}`
      }
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    
    // Update the access token in storage (keep the same refresh token)
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearToken();
    throw error;
  }
};



// Get token expiry time
export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Check if token needs refresh (within 5 minutes of expiry)
export const shouldRefreshToken = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Refresh if token expires within 5 minutes
    return timeUntilExpiry < 300;
  } catch (error) {
    return false;
  }
};
