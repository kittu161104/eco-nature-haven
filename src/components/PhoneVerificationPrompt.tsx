
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PhoneVerification from "./PhoneVerification";
import { enableModalScrolling } from "@/lib/utils";

const PhoneVerificationPrompt = () => {
  const { needsPhoneVerification, updatePhoneNumber } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (needsPhoneVerification) {
      // Short delay to not show immediately after login/register
      const timer = setTimeout(() => {
        setShowVerification(true);
        
        // Apply scrolling to modal when it opens
        if (contentRef.current) {
          enableModalScrolling(contentRef.current);
        }
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
      contentRef={contentRef}
    />
  );
};

export default PhoneVerificationPrompt;
