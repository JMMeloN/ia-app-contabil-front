import { useRecoilValue } from 'recoil';
import { authState, authLoadingState } from '@/store';

export const useAuthRecoil = () => {
  const authData = useRecoilValue(authState);
  const isLoading = useRecoilValue(authLoadingState);

  return {
    user: authData.user,
    isLoading,
    isAuthenticated: authData.isAuthenticated,
  };
};

export const useAuth = useAuthRecoil;