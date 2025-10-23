import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';


export default function ProtectedRoute({ roles }) {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
  
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
