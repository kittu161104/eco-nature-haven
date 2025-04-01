
import { formatPhoneNumber } from "./utils";

// OTP generation
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let OTP = '';
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
}

// Simulate sending OTP via SMS (in a real app, this would call an SMS API)
export function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Sending OTP ${otp} to ${formatPhoneNumber(phoneNumber)}`);
    // In a real implementation, this would call an SMS API service
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

// For demo purposes - store OTPs in memory (in production, use a secure method)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

// Store OTP with expiration (5 minutes)
export function storeOTP(phoneNumber: string, otp: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[phoneNumber] = { otp, expiresAt };
}

// Verify OTP
export function verifyOTP(phoneNumber: string, userOTP: string): boolean {
  const record = otpStore[phoneNumber];
  
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    delete otpStore[phoneNumber]; // Clean up expired OTP
    return false;
  }
  
  const isValid = record.otp === userOTP;
  
  if (isValid) {
    delete otpStore[phoneNumber]; // Clean up used OTP
  }
  
  return isValid;
}
