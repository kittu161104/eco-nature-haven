
import { useState, useEffect } from 'react';
import { ThemeSettings, defaultTheme, applyTheme } from '@/lib/theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on initial load
    try {
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
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      // Continue with default theme
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    try {
      const updatedTheme = { ...theme, ...newTheme };
      setTheme(updatedTheme);
      localStorage.setItem('themeSettings', JSON.stringify(updatedTheme));
      applyTheme(updatedTheme);
      return updatedTheme;
    } catch (error) {
      console.error('Error updating theme:', error);
      return theme; // Return current theme if update fails
    }
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
    isInitialized,
  };
}

export default useTheme;
