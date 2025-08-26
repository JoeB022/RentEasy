import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DEV_BYPASS = true; // set to false when backend is ready

const ProtectedRoute = ({ children, allowedRoles }) => {
  console.log('ProtectedRoute: Checking access for roles:', allowedRoles);
  
  if (DEV_BYPASS) {
    console.log('ProtectedRoute: DEV_BYPASS enabled, allowing access');
    return children;
  }
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
