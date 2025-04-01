
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

// Enhanced localStorage get that handles errors gracefully
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Throttled localStorage set to prevent excessive writes
export const setStorageItem = debounce((key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch storage event for cross-component communication
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    // If quota exceeded, try to clear less important data
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, clearing non-essential data');
      // We could add logic here to clear less important cached data
    }
  }
}, 500); // 500ms debounce to prevent rapid successive writes

// Custom hook for using localStorage with optimized performance
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageItem<T>(key, initialValue);
  });

  // Previous value ref to avoid unnecessary updates
  const prevValueRef = useRef<T>(storedValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      
      // Only update localStorage if value has changed
      // This prevents unnecessary writes for objects/arrays (deep comparison would be better)
      if (JSON.stringify(prevValueRef.current) !== JSON.stringify(nextValue)) {
        setStorageItem(key, nextValue);
        prevValueRef.current = nextValue;
      }
      
      return nextValue;
    });
  }, [key]);

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const newValue = getStorageItem<T>(key, initialValue);
      if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
        setStoredValue(newValue);
        prevValueRef.current = newValue;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue] as const;
}

// Helper to batch localStorage operations for better performance
export function batchStorageUpdate(updates: Array<{key: string, value: any}>): void {
  // Collect all updates and apply them at once
  for (const update of updates) {
    try {
      localStorage.setItem(update.key, JSON.stringify(update.value));
    } catch (error) {
      console.error(`Error in batch update for ${update.key}:`, error);
    }
  }
  
  // Trigger a single storage event after all updates
  window.dispatchEvent(new Event('storage'));
}

// Utility for throttling function calls
export function throttleFunction<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    if (now - lastCall < limit) {
      return undefined;
    }
    lastCall = now;
    return func.apply(this, args);
  };
}

// Function to clear expired or less important data
export function clearLessImportantData(): boolean {
  try {
    // Clear data that's less important or can be recreated
    // This is app-specific, but here are some examples:
    
    // Clear old session data
    const oldSessions = Object.keys(localStorage).filter(key => 
      key.startsWith('session_') && 
      Date.now() - JSON.parse(localStorage.getItem(key) || '{"timestamp":0}').timestamp > 7 * 24 * 60 * 60 * 1000
    );
    
    oldSessions.forEach(key => localStorage.removeItem(key));
    
    // Clear cached items if space is needed
    const cachedItems = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    if (cachedItems.length > 0) {
      cachedItems.forEach(key => localStorage.removeItem(key));
      return true;
    }
    
    return oldSessions.length > 0;
  } catch (error) {
    console.error("Error clearing less important data:", error);
    return false;
  }
}
