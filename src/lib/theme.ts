
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
export function applyTheme(theme: ThemeSettings): void {
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

  // Apply background
  document.documentElement.style.setProperty('--nursery-background', `url(${theme.backgroundImage})`);
  
  // Apply font
  document.documentElement.style.setProperty('--font-family', theme.fontFamily);
}

// Initialize theme from localStorage or defaults
export function initializeTheme(): void {
  try {
    const savedTheme = localStorage.getItem('themeSettings');
    const theme = savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    applyTheme(theme);
  } catch (error) {
    console.error("Failed to initialize theme:", error);
    applyTheme(defaultTheme);
  }
}
