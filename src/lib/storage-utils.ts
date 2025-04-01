
import { useState, useEffect, useCallback } from 'react';
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
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageItem<T>(key, initialValue);
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      setStorageItem(key, nextValue);
      return nextValue;
    });
  }, [key]);

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const newValue = getStorageItem<T>(key, initialValue);
      setStoredValue(newValue);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
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
