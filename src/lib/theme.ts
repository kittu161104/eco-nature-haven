
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

    // Set text colors based on theme mode to ensure visibility
    try {
      if (theme.mode === 'light') {
        // Ensure text is dark in light mode for better visibility
        document.documentElement.style.setProperty('--foreground', '20 14.3% 4.1%');
        document.documentElement.style.setProperty('--card-foreground', '20 14.3% 4.1%');
        document.documentElement.style.setProperty('--popover-foreground', '20 14.3% 4.1%');
        
        // Add additional text color rules for forms and inputs
        document.documentElement.style.setProperty('--input-text', '#000000');
        document.documentElement.style.setProperty('--form-text', '#111111');
      } else {
        // Reset text colors for dark mode
        document.documentElement.style.setProperty('--foreground', '210 40% 98%');
        document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
        document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
        
        // Reset additional text colors
        document.documentElement.style.setProperty('--input-text', '#ffffff');
        document.documentElement.style.setProperty('--form-text', '#f9f9f9');
      }
      
      // Set a global text color override to ensure readability
      const backgroundColor = theme.mode === 'light' ? '#ffffff' : '#121212';
      const textColor = theme.mode === 'light' ? '#111111' : '#f9f9f9';
      
      document.documentElement.style.setProperty('--bg-color', backgroundColor);
      document.documentElement.style.setProperty('--text-color', textColor);
      
    } catch (e) {
      console.error("Error applying text colors:", e);
    }
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
