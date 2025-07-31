import { useState } from "react";
import { PhoneCountryInput } from "./PhoneCountryInput";
import { OTPVerification } from "./OTPVerification";
import { SelfieCapture } from "./SelfieCapture";
import { useLanguage } from "@/hooks/useLanguage";

type AuthStep = "phone" | "otp" | "selfie" | "complete";

interface AuthFlowProps {
  onComplete: (userData: { phone: string; otp: string; selfieData: string }) => void;
  onCancel: () => void;
}

export const AuthFlow = ({ onComplete, onCancel }: AuthFlowProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [selfieData, setSelfieData] = useState("");
  const { t } = useLanguage();

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentStep("otp");
    // כאן נשלח SMS במציאות
    console.log("SMS sent to:", phone);
  };

  const handleOTPSubmit = (otp: string) => {
    setOtpCode(otp);
    setCurrentStep("selfie");
  };

  const handleSelfieCapture = (imageData: string) => {
    setSelfieData(imageData);
    setCurrentStep("complete");
    
    // שמירת הנתונים והשלמת התהליך
    onComplete({
      phone: phoneNumber,
      otp: otpCode,
      selfieData: imageData
    });
  };

  const stepTitles = {
    phone: t('auth.phoneEntry'),
    otp: t('auth.otpVerification'),
    selfie: t('auth.selfieCapture'),
    complete: t('auth.registrationComplete')
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {stepTitles[currentStep]}
            </h2>
            <button 
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 flex gap-2">
            {["phone", "otp", "selfie"].map((step, index) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step === currentStep || 
                  (currentStep === "complete" && index < 3)
                    ? "bg-primary" 
                    : currentStep === "otp" && step === "phone"
                    ? "bg-primary"
                    : currentStep === "selfie" && (step === "phone" || step === "otp")
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === "phone" && (
            <PhoneCountryInput 
              onSubmit={handlePhoneSubmit}
              onBack={onCancel}
            />
          )}
          
          {currentStep === "otp" && (
            <OTPVerification 
              phoneNumber={phoneNumber}
              onSubmit={handleOTPSubmit}
              onBack={() => setCurrentStep("phone")}
            />
          )}
          
          {currentStep === "selfie" && (
            <SelfieCapture 
              onCapture={handleSelfieCapture}
              onBack={() => setCurrentStep("otp")}
            />
          )}
        </div>
      </div>
    </div>
  );
};