import { atom } from 'recoil';
import { AuthState } from '@/types';

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  },
});

export const authLoadingState = atom<boolean>({
  key: 'authLoadingState',
  default: true,
});