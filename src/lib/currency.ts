
// Currency utility functions for INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRWithDecimals = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseINR = (value: string): number => {
  // Remove currency symbols and parse
  const cleanValue = value.replace(/[₹,\s]/g, '');
  return parseFloat(cleanValue) || 0;
};

export const convertToINR = (amount: number, fromCurrency: string = 'USD'): number => {
  // Simple conversion rates (in real app, use dynamic rates)
  const rates: Record<string, number> = {
    'USD': 83.0,
    'EUR': 90.0,
    'GBP': 105.0,
  };
  
  return amount * (rates[fromCurrency] || 1);
};
