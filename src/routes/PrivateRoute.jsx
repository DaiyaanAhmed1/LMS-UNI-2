import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ allowedRoles }) => {
  const { role } = useAuth();

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
