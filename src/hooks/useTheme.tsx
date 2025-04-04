
import { useState, useEffect } from 'react';
import { ThemeSettings, defaultTheme, applyTheme } from '@/lib/theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage on initial load
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        applyTheme(parsedTheme);
      } catch (e) {
        console.error('Error parsing theme settings:', e);
        // If there's an error, reset to default theme
        setTheme(defaultTheme);
        applyTheme(defaultTheme);
      }
    } else {
      // Initialize with default theme if nothing is saved
      applyTheme(defaultTheme);
    }
  }, []);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);
    localStorage.setItem('themeSettings', JSON.stringify(updatedTheme));
    applyTheme(updatedTheme);
    return updatedTheme;
  };

  const toggleMode = () => {
    const newMode = theme.mode === 'dark' ? 'light' : 'dark';
    return updateTheme({ mode: newMode });
  };

  return {
    theme,
    updateTheme,
    toggleMode,
    isDark: theme.mode === 'dark',
    isLight: theme.mode === 'light',
  };
}

export default useTheme;
