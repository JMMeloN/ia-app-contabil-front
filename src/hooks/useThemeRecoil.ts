import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '@/store';
import { Theme } from '@/types';

export const useThemeRecoil = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem('vite-ui-theme', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme: updateTheme,
  };
};

export const useTheme = useThemeRecoil;