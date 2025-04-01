
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PhoneVerification from "./PhoneVerification";

const PhoneVerificationPrompt = () => {
  const { needsPhoneVerification, updatePhoneNumber } = useAuth();
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (needsPhoneVerification) {
      // Short delay to not show immediately after login/register
      const timer = setTimeout(() => {
        setShowVerification(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [needsPhoneVerification]);

  const handleVerificationComplete = async (phoneNumber: string) => {
    try {
      await updatePhoneNumber(phoneNumber);
      setShowVerification(false);
    } catch (error) {
      console.error("Error updating phone:", error);
    }
  };

  return (
    <PhoneVerification
      open={showVerification}
      onClose={() => setShowVerification(false)}
      onVerificationComplete={handleVerificationComplete}
    />
  );
};

export default PhoneVerificationPrompt;
