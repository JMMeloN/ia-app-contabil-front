import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/presentation/hooks/use-auth';
import { useUserRole } from '@/hooks/useUserRole';
import Loading from '@/presentation/components/loading';
import type { UserRole } from '@/types/user';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}: RoleBasedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}
