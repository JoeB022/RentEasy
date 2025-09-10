import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import { 
  getToken, 
  isTokenExpired, 
  shouldRefreshToken, 
  refreshToken, 
  clearToken 
} from '../utils/auth';

const useAuthFetch = () => {
  const navigate = useNavigate();

  const authFetch = useCallback(async (url, options = {}) => {
    let token = getToken();
    
    // Check if token exists and is valid
    if (!token || isTokenExpired(token)) {
      // Try to refresh the token
      try {
        token = await refreshToken();
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        console.error('Initial token refresh failed:', error);
        clearToken();
        // Clear all localStorage items to ensure clean state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        navigate('/login');
        throw new Error('Authentication failed. Please login again.');
      }
    }
    
    // Check if token needs refresh (within 5 minutes of expiry)
    if (shouldRefreshToken(token)) {
      try {
        token = await refreshToken();
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        console.error('Proactive token refresh failed:', error);
        clearToken();
        // Clear all localStorage items to ensure clean state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        navigate('/login');
        throw new Error('Authentication failed. Please login again.');
      }
    }

    // Prepare headers with authorization
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Build the full API URL
    const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
    
    // Make the request
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized or 403 Forbidden responses (token issues)
    if (response.status === 401 || response.status === 403) {
      // Token might be invalid or expired, try to refresh once
      try {
        const newToken = await refreshToken();
        headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the request with new token
        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers,
        });
        
        return retryResponse;
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        console.error('Token refresh failed:', error);
        clearToken();
        // Clear all localStorage items to ensure clean state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        navigate('/login');
        throw new Error('Authentication failed. Please login again.');
      }
    }

    return response;
  }, [navigate]);

  // Convenience methods for common HTTP methods
  const get = useCallback((url, options = {}) => {
    return authFetch(url, { ...options, method: 'GET' });
  }, [authFetch]);

  const post = useCallback((url, data, options = {}) => {
    return authFetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [authFetch]);

  const put = useCallback((url, data, options = {}) => {
    return authFetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [authFetch]);

  const del = useCallback((url, options = {}) => {
    return authFetch(url, { ...options, method: 'DELETE' });
  }, [authFetch]);

  const patch = useCallback((url, data, options = {}) => {
    return authFetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }, [authFetch]);

  return {
    fetch: authFetch,
    get,
    post,
    put,
    delete: del,
    patch,
  };
};

export default useAuthFetch;
