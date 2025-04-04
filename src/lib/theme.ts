
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
  primaryColor: '#16a34a', // Green-600
  secondaryColor: '#4ade80', // Green-400
  backgroundImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1742&auto=format&fit=crop',
  enableCustomColors: true,
  fontFamily: 'Inter, sans-serif',
};

// Apply theme to the document with improved error handling
export function applyTheme(theme: ThemeSettings | null | undefined): void {
  // Use default theme if the provided theme is null or undefined
  if (!theme) {
    console.warn("Attempting to apply undefined theme. Using default instead.");
    theme = {...defaultTheme};
  }
  
  try {
    // Ensure document is available (avoid SSR issues)
    if (typeof document === 'undefined') return;

    // Set color mode with fallbacks
    try {
      if (theme.mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.remove('light-theme-active');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.classList.add('light-theme-active');
      }
    } catch (e) {
      console.error("Error applying theme mode:", e);
    }

    // Apply custom colors if enabled
    try {
      if (theme.enableCustomColors) {
        document.documentElement.style.setProperty('--primary', theme.primaryColor || defaultTheme.primaryColor);
        document.documentElement.style.setProperty('--secondary', theme.secondaryColor || defaultTheme.secondaryColor);
      }
    } catch (e) {
      console.error("Error applying theme colors:", e);
    }

    // Apply background safely
    try {
      if (theme.backgroundImage) {
        document.documentElement.style.setProperty('--nursery-background', `url(${theme.backgroundImage})`);
      }
    } catch (e) {
      console.error("Error applying background image:", e);
    }
    
    // Apply font safely
    try {
      if (theme.fontFamily) {
        document.documentElement.style.setProperty('--font-family', theme.fontFamily);
      }
    } catch (e) {
      console.error("Error applying font family:", e);
    }

    // Always set text colors for proper contrast
    document.documentElement.style.setProperty('--foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--card-foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--popover-foreground', '0 0% 100%');
    
    // Set input and form text colors
    document.documentElement.style.setProperty('--input-text', '#ffffff');
    document.documentElement.style.setProperty('--form-text', '#ffffff');
    
    // Set global text color override to ensure readability
    document.documentElement.style.setProperty('--bg-color', '#000000');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
  } catch (error) {
    console.error("Error applying theme:", error);
  }
}

// Initialize theme from localStorage or defaults with improved error handling
export function initializeTheme(): ThemeSettings {
  try {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {...defaultTheme};
    }
    
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        // Validate the theme has required properties
        if (typeof theme === 'object' && theme !== null && 'mode' in theme) {
          // Apply with safely merged defaults for missing properties
          const validTheme = { ...defaultTheme, ...theme };
          applyTheme(validTheme);
          return validTheme;
        } else {
          console.warn("Invalid theme structure in localStorage, using default");
          applyTheme(defaultTheme);
          return {...defaultTheme};
        }
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
        applyTheme(defaultTheme);
        return {...defaultTheme};
      }
    } else {
      applyTheme(defaultTheme);
      return {...defaultTheme};
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
    return {...defaultTheme};
  }
}
