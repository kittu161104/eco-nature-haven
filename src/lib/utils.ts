
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
