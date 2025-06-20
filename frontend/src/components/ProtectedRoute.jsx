import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
