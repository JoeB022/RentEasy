import { jwtDecode } from 'jwt-decode';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'role';
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
  
  // Temporarily simplify: just check if token and role exist
  // TODO: Fix JWT decoding and re-enable proper expiry check
  const result = token && role;
  
  console.log('[DEBUG] isAuthenticated result:', result);
  return result;
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshTokenValue = getRefreshToken();
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    // TODO: Replace with actual backend refresh endpoint when ready
    // For now, simulate a refresh with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate new token generation (replace with actual API call)
    const newAccessToken = generateMockToken();
    const newRefreshToken = generateMockToken();
    
    // Update tokens in storage
    const role = getUserRole();
    const username = getUsername();
    setToken(newAccessToken, newRefreshToken, role, username);
    
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearToken();
    throw error;
  }
};

// Generate mock token for development (remove when backend is ready)
const generateMockToken = () => {
  // Create a mock JWT with 1 hour expiry
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
    username: getUsername() || 'user',
    role: getUserRole() || 'tenant'
  }));
  const signature = btoa('mock_signature');
  
  return `${header}.${payload}.${signature}`;
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
