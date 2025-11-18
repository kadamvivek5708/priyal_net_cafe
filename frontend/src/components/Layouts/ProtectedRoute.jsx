import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const ProtectedRoute = () => {
  const { token } = useAuth();

  // If there is no token (admin not logged in), redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes (the admin pages)
  return <Outlet />;
};

export default ProtectedRoute;