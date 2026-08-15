import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Yüklənir...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
