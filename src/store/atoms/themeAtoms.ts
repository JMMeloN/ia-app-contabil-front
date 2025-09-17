import { atom } from 'recoil';
import { Theme } from '@/types';

export const themeState = atom<Theme>({
  key: 'themeState',
  default: (() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('vite-ui-theme') as Theme) || 'dark';
    }
    return 'dark';
  })(),
});