
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
          // Validate the theme object to ensure it has the required properties
          if (typeof parsedTheme === 'object' && parsedTheme !== null && 'mode' in parsedTheme) {
            setTheme(parsedTheme);
            applyTheme(parsedTheme);
          } else {
            console.warn('Invalid theme structure, resetting to default');
            setTheme(defaultTheme);
            applyTheme(defaultTheme);
          }
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
      
      try {
        localStorage.setItem('themeSettings', JSON.stringify(updatedTheme));
      } catch (storageError) {
        console.error('Error saving theme to localStorage:', storageError);
        // Continue even if storage fails
      }
      
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
