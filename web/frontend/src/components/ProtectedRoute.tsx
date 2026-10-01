import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserType } from '@/types/user';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: UserType[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  allowedUserTypes,
  fallbackPath = '/',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && user && !allowedUserTypes.includes(user.user_type)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
