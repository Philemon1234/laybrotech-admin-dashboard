import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-brand-muted text-sm font-semibold text-brand-softText">Checking session...</div>;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

