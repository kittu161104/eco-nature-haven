
import { useState, useEffect } from 'react';
import { ThemeSettings, defaultTheme, applyTheme } from '@/lib/theme';

export function useTheme() {
  // Initialize with a safe default theme
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Safe theme loading on mount
  useEffect(() => {
    const loadTheme = () => {
      setIsLoading(true);
      try {
        // Start with the default theme
        let currentTheme = {...defaultTheme};
        
        const savedTheme = localStorage.getItem('themeSettings');
        if (savedTheme) {
          try {
            const parsedTheme = JSON.parse(savedTheme);
            // Validate the theme structure with explicit checks
            if (
              typeof parsedTheme === 'object' && 
              parsedTheme !== null && 
              'mode' in parsedTheme
            ) {
              currentTheme = {...currentTheme, ...parsedTheme};
            } else {
              console.warn('Invalid theme structure, using default theme');
            }
          } catch (parseError) {
            console.error('Error parsing theme settings:', parseError);
          }
        }
        
        setTheme(currentTheme);
        applyTheme(currentTheme);
      } catch (error) {
        console.error('Error loading theme from localStorage:', error);
        // Ensure we have a valid theme even if everything fails
        setTheme({...defaultTheme});
        applyTheme(defaultTheme);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };
    
    // Use setTimeout to ensure DOM is ready before applying theme
    const timer = setTimeout(loadTheme, 0);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    try {
      const updatedTheme = { ...theme, ...newTheme };
      setTheme(updatedTheme);
      
      try {
        localStorage.setItem('themeSettings', JSON.stringify(updatedTheme));
      } catch (storageError) {
        console.error('Error saving theme to localStorage:', storageError);
      }
      
      applyTheme(updatedTheme);
      return updatedTheme;
    } catch (error) {
      console.error('Error updating theme:', error);
      return theme;
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
    isLoading,
  };
}

export default useTheme;
