
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { isValidPhoneNumber } from "@/lib/utils";
import { generateOTP, sendOTP, storeOTP, verifyOTP } from "@/lib/otp-utils";
import { Loader2, AlertCircle, CheckCircle2, Phone } from "lucide-react";

interface PhoneVerificationProps {
  open: boolean;
  onClose: () => void;
  onVerificationComplete: (phoneNumber: string) => void;
}

const PhoneVerification = ({
  open,
  onClose,
  onVerificationComplete
}: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSendOTP = async () => {
    setError("");
    
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const generatedOTP = generateOTP();
      const sent = await sendOTP(phoneNumber, generatedOTP);
      
      if (sent) {
        storeOTP(phoneNumber, generatedOTP);
        setStep("otp");
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${phoneNumber}`,
        });
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("OTP sending error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    setError("");
    
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const isValid = verifyOTP(phoneNumber, otp);
      
      if (isValid) {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified",
        });
        onVerificationComplete(phoneNumber);
        resetForm();
        onClose();
      } else {
        setError("Invalid OTP. Please try again or request a new code.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setOtp("");
    setStep("phone");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Phone Verification
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-2">
            {error && (
              <div className="flex items-center p-3 text-sm bg-red-50 text-red-600 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Please enter your mobile number to receive a verification code.
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="phone"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Example: 1234567890 (10 digits, no spaces or special characters)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  We've sent a 6-digit verification code to {phoneNumber}.
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setOtp("");
                      setStep("phone");
                    }}
                    disabled={isLoading}
                  >
                    Use a different number
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          {step === "phone" ? (
            <Button 
              onClick={handleSendOTP} 
              disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Code
            </Button>
          ) : (
            <Button 
              onClick={handleVerifyOTP} 
              disabled={otp.length < 6 || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneVerification;
