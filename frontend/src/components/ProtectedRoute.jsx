import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white rounded-2xl shadow-sm border border-rose-100 text-center">
        <h3 className="text-lg font-bold text-rose-700">Access Restricted</h3>
        <p className="text-sm text-slate-600 mt-2">
          Your account role (<span className="font-semibold">{user.role}</span>) is not authorized to view this page.
        </p>
        <div className="mt-4">
          <a
            href="/"
            className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
