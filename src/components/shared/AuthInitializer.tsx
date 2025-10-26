import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { User } from 'firebase/auth';
import { authState, authLoadingState } from '@/store';
import { initializeAuthListener } from '@/firebase/authListener';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const setAuthData = useSetRecoilState(authState);
  const setIsLoading = useSetRecoilState(authLoadingState);

  useEffect(() => {
    const unsubscribe = initializeAuthListener((user: User | null) => {
      setAuthData({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setAuthData, setIsLoading]);

  return <>{children}</>;
};