
// Theme management utilities

export type ThemeMode = 'dark' | 'light';
export type ThemeSettings = {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  backgroundImage: string;
  enableCustomColors: boolean;
  fontFamily: string;
};

export const defaultTheme: ThemeSettings = {
  mode: 'dark',
  primaryColor: '#4CAF50',
  secondaryColor: '#8BC34A',
  backgroundImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
  enableCustomColors: true,
  fontFamily: 'Inter, sans-serif',
};

// Apply theme to the document
export function applyTheme(theme: ThemeSettings | null | undefined): void {
  // Safety check - if theme is null or undefined, use default
  if (!theme) {
    console.warn("Attempting to apply undefined theme. Using default instead.");
    theme = defaultTheme;
  }
  
  try {
    // Ensure document is available (avoid SSR issues)
    if (typeof document === 'undefined') return;

    // Set color mode
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply custom colors if enabled
    if (theme.enableCustomColors) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--secondary', theme.secondaryColor);
    }

    // Apply background safely
    if (theme.backgroundImage) {
      document.documentElement.style.setProperty('--nursery-background', `url(${theme.backgroundImage})`);
    }
    
    // Apply font safely
    if (theme.fontFamily) {
      document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    }
  } catch (error) {
    console.error("Error applying theme:", error);
    // Continue execution even if there's an error with theme application
  }
}

// Initialize theme from localStorage or defaults with improved error handling
export function initializeTheme(): ThemeSettings {
  try {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return defaultTheme;
    }
    
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        applyTheme(theme);
        return theme;
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
        applyTheme(defaultTheme);
        return defaultTheme;
      }
    } else {
      applyTheme(defaultTheme);
      return defaultTheme;
    }
  } catch (error) {
    console.error("Failed to initialize theme:", error);
    // If we can't access localStorage or there's another error, 
    // still try to apply the default theme
    try {
      applyTheme(defaultTheme);
    } catch (e) {
      console.error("Failed to apply default theme:", e);
    }
    return defaultTheme;
  }
}
