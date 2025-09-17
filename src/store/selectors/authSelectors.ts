import { selector } from 'recoil';
import { authState } from '../atoms/authAtoms';

export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user !== null && auth.isAuthenticated;
  },
});

export const currentUserSelector = selector({
  key: 'currentUserSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user;
  },
});

export const userDisplayNameSelector = selector({
  key: 'userDisplayNameSelector',
  get: ({ get }) => {
    const user = get(currentUserSelector);
    return user?.displayName || user?.email || 'Usuário';
  },
});