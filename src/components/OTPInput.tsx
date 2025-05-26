
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const OTPInput = ({ length, value, onChange, className }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length);
      while (otpArray.length < length) {
        otpArray.push("");
      }
      setOtp(otpArray);
    }
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    if (isNaN(Number(digit))) return;

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const otpArray = pastedData.split("").slice(0, length);
    while (otpArray.length < length) {
      otpArray.push("");
    }
    setOtp(otpArray);
    onChange(otpArray.join(""));
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-semibold bg-black/40 border-green-800/50 text-white focus:border-green-500 transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
