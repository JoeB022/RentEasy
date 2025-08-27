import React, { useState } from 'react';
import { ProtectedRoute } from './common';
import { Button } from './ui';
import { setToken, clearToken, getToken, isTokenExpired } from '../utils/auth';

const ProtectedRouteDemo = () => {
  const [currentToken, setCurrentToken] = useState(getToken());
  const [tokenStatus, setTokenStatus] = useState('');

  const createMockToken = (expiresIn = 3600) => {
    // Create a mock JWT token that expires in specified seconds
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      iat: Math.floor(Date.now() / 1000),
      username: 'demo_user',
      role: 'tenant'
    }));
    const signature = btoa('mock_signature');
    
    return `${header}.${payload}.${signature}`;
  };

  const handleCreateValidToken = () => {
    const token = createMockToken(3600); // 1 hour
    setToken(token, 'mock_refresh_token', 'tenant', 'demo_user');
    setCurrentToken(token);
    setTokenStatus('Valid token created (expires in 1 hour)');
  };

  const handleCreateExpiredToken = () => {
    const token = createMockToken(-3600); // Expired 1 hour ago
    setToken(token, 'mock_refresh_token', 'tenant', 'demo_user');
    setCurrentToken(token);
    setTokenStatus('Expired token created');
  };

  const handleClearToken = () => {
    clearToken();
    setCurrentToken(null);
    setTokenStatus('Token cleared');
  };

  const checkTokenStatus = () => {
    if (!currentToken) {
      setTokenStatus('No token');
      return;
    }
    
    if (isTokenExpired(currentToken)) {
      setTokenStatus('Token is EXPIRED');
    } else {
      setTokenStatus('Token is VALID');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ProtectedRoute Demo</h1>
      
      {/* Token Management Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🔑 Token Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button onClick={handleCreateValidToken} variant="primary">
            Create Valid Token (1 hour)
          </Button>
          
          <Button onClick={handleCreateExpiredToken} variant="danger">
            Create Expired Token
          </Button>
          
          <Button onClick={handleClearToken} variant="outline">
            Clear Token
          </Button>
          
          <Button onClick={checkTokenStatus} variant="ghost">
            Check Token Status
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Current Token Status:</h3>
          <p className="text-sm text-gray-600 mb-2">{tokenStatus}</p>
          <p className="text-xs text-gray-500">
            Token: {currentToken ? `${currentToken.substring(0, 50)}...` : 'None'}
          </p>
        </div>
      </div>

      {/* Protected Route Testing Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🛡️ Protected Route Testing</h2>
        
        <div className="space-y-6">
          {/* Test 1: Valid Access */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">✅ Test 1: Valid Access (Tenant Role)</h3>
            <p className="text-sm text-gray-600 mb-3">
              This route should be accessible with a valid tenant token.
            </p>
            <ProtectedRoute allowedRoles={['tenant']}>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 text-sm">
                  🎉 Access granted! You have a valid tenant token.
                </p>
              </div>
            </ProtectedRoute>
          </div>

          {/* Test 2: Role Restriction */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">🚫 Test 2: Role Restriction (Admin Only)</h3>
            <p className="text-sm text-gray-600 mb-3">
              This route should redirect to login if you don't have admin role.
            </p>
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-800 text-sm">
                  🔓 Admin access granted! (This shouldn't show for tenants)
                </p>
              </div>
            </ProtectedRoute>
          </div>

          {/* Test 3: No Role Restriction */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">🌐 Test 3: No Role Restriction</h3>
            <p className="text-sm text-gray-600 mb-3">
              This route should be accessible to any authenticated user.
            </p>
            <ProtectedRoute>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-purple-800 text-sm">
                  🌟 General access granted! Any authenticated user can see this.
                </p>
              </div>
            </ProtectedRoute>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">📋 How to Test</h2>
        
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start gap-2">
            <span className="font-medium">1.</span>
            <p>Click "Create Valid Token" to simulate a logged-in user</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium">2.</span>
            <p>Notice how all protected routes become accessible</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium">3.</span>
            <p>Click "Create Expired Token" to simulate an expired session</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium">4.</span>
            <p>Notice how you get redirected to login with "Session expired" message</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium">5.</span>
            <p>Click "Clear Token" to simulate logging out</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-medium">6.</span>
            <p>Notice how you get redirected to login</p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔧 Technical Details</h2>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>JWT Validation:</strong> Checks token expiration using <code>isTokenExpired()</code>
          </div>
          
          <div>
            <strong>Authentication Check:</strong> Uses <code>isAuthenticated()</code> to verify token presence and validity
          </div>
          
          <div>
            <strong>Role-Based Access:</strong> Validates user roles against <code>allowedRoles</code> array
          </div>
          
          <div>
            <strong>Error Handling:</strong> Gracefully handles invalid tokens and redirects to login
          </div>
          
          <div>
            <strong>Loading State:</strong> Shows spinner while validating authentication
          </div>
          
          <div>
            <strong>Toast Notifications:</strong> Provides user feedback for expired sessions and errors
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRouteDemo;
