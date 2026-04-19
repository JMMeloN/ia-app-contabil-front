import { useEffect, useState } from 'react';
import type { UserModel } from '@/domain/models/auth-model';
import { makeGetCurrentUser } from '@/main/factories';
import { clearAuthStorage, isJwtExpired } from '@/infra/auth/jwt-token';

export const useAuthRecoil = () => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = localStorage.getItem('access_token');
      if (!token || isJwtExpired(token)) {
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const getCurrentUserUseCase = makeGetCurrentUser();
        const currentUser = await getCurrentUserUseCase.execute();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};

export const useAuth = useAuthRecoil;
