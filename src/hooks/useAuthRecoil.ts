import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { authState, authLoadingState } from '@/store';

export const useAuthRecoil = () => {
  const [authData, setAuthData] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useRecoilState(authLoadingState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setAuthData({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setAuthData, setIsLoading]);

  return {
    user: authData.user,
    isLoading,
    isAuthenticated: authData.isAuthenticated,
  };
};

export const useAuth = useAuthRecoil;