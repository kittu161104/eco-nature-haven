
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, isValid, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe date formatting utility
export function formatDate(date: Date | string): string {
  if (!date) return "Invalid date";
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) {
    return "Invalid date";
  }
  
  return format(parsedDate, "MMM dd, yyyy");
}

// Image loading error handling utility
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string = "/placeholder.svg") {
  const target = e.target as HTMLImageElement;
  target.src = fallbackSrc;
  target.onerror = null; // Prevent infinite error loops
}

// Performance measurement utilities
export function measurePerformance(label: string, callback: () => void) {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    callback();
    console.timeEnd(label);
  } else {
    callback();
  }
}

// Safely parse JSON with error handling
export function safelyParseJSON<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

// Function to retry failed operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      
      if (attempt < maxRetries - 1) {
        // Wait before the next retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError || new Error("Operation failed after multiple retries");
}

// Format phone number for display
export function formatPhoneNumber(phoneNumber: string): string {
  // Basic formatting for 10-digit US numbers
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }
  
  // For international numbers or other formats
  return phoneNumber;
}

// Validate phone number (basic validation)
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // This is a simple validation for 10-digit numbers
  // For production, use a more robust validation or a library
  return /^\d{10}$/.test(phoneNumber);
}

// Format currency to INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

// Enable scrolling for modal content
export function enableModalScrolling(modalContent: HTMLElement | null) {
  if (!modalContent) return;
  
  // Calculate if content exceeds viewport height
  const viewportHeight = window.innerHeight;
  const contentHeight = modalContent.scrollHeight;
  
  if (contentHeight > viewportHeight * 0.8) {
    modalContent.style.maxHeight = `${viewportHeight * 0.8}px`;
    modalContent.style.overflowY = 'auto';
  }
}
