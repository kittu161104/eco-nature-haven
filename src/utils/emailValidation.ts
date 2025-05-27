
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidEmailDomain = async (email: string): Promise<boolean> => {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    // Check if domain has valid format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  } catch (error) {
    console.error('Error validating email domain:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
