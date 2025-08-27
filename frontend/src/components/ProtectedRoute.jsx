import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole, clearToken, isTokenExpired, getToken } from "../utils/auth";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateAccess = () => {
      try {
        console.log('ProtectedRoute: Validating access for roles:', allowedRoles);
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('ProtectedRoute: User not authenticated');
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Get the access token
        const token = getToken();
        if (!token) {
          console.log('ProtectedRoute: No access token found');
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('ProtectedRoute: Token expired');
          clearToken();
          toast.error('Session expired. Please login again.');
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Check role-based access if specified
        if (allowedRoles && allowedRoles.length > 0) {
          const userRole = getUserRole();
          if (!userRole || !allowedRoles.includes(userRole)) {
            console.log('ProtectedRoute: Role access denied. User role:', userRole, 'Allowed roles:', allowedRoles);
            setIsValid(false);
            setIsValidating(false);
            return;
          }
        }

        console.log('ProtectedRoute: Access granted');
        setIsValid(true);
        setIsValidating(false);
        
      } catch (error) {
        console.error('ProtectedRoute: Error during validation:', error);
        clearToken();
        toast.error('Authentication error. Please login again.');
        setIsValid(false);
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [allowedRoles, location.pathname]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Validating access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not valid
  if (!isValid) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render children if access is granted
  return children;
};

export default ProtectedRoute;
