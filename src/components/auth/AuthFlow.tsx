
import { useState } from "react";
import { PhoneCountryInput } from "./PhoneCountryInput";
import { EmailInput } from "./EmailInput";
import { OTPVerification } from "./OTPVerification";
import { SelfieCapture } from "./SelfieCapture";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";

type AuthStep = "contact" | "otp" | "selfie" | "complete";

interface AuthFlowProps {
  event: event;
  onComplete: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
  onCancel: () => void;
}

export const AuthFlow = ({ event, onComplete, onCancel }: AuthFlowProps) => {
  const needsFullAuth = event?.needDetect !== false;
  console.log('AuthFlow - event.needDetect:', event?.needDetect);
  console.log('AuthFlow - needsFullAuth:', needsFullAuth);
  const [currentStep, setCurrentStep] = useState<AuthStep>(needsFullAuth ? "contact" : "selfie");
  const [contactInfo, setContactInfo] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [selfieData, setSelfieData] = useState("");
  const { t } = useLanguage();

  const isEmailMode = event?.registerBy === "Email";

  const handleContactSubmit = (contact: string, notificationPreference: boolean) => {
    setContactInfo(contact);
    setNotifications(notificationPreference);
    setCurrentStep("otp");
    // כאן נשלח SMS/Email במציאות
    console.log(`${isEmailMode ? 'Email' : 'SMS'} sent to:`, contact);
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
      contact: contactInfo || "selfie-only",
      otp: otpCode || "no-otp",
      selfieData: imageData,
      notifications: notifications
    });
  };

  const stepTitles = {
    contact: isEmailMode ? t('auth.emailEntry') : t('auth.phoneEntry'),
    otp: t('auth.otpVerification'),
    selfie: needsFullAuth ? t('auth.selfieCapture') : t('auth.takeSelfie'),
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
            {(needsFullAuth ? ["contact", "otp", "selfie"] : ["selfie"]).map((step, index) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step === currentStep || 
                  (currentStep === "complete" && index < (needsFullAuth ? 3 : 1))
                    ? "bg-primary" 
                    : currentStep === "otp" && step === "contact"
                    ? "bg-primary"
                    : currentStep === "selfie" && (step === "contact" || step === "otp")
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {needsFullAuth && currentStep === "contact" && (
            isEmailMode ? (
              <EmailInput 
                onSubmit={handleContactSubmit}
                onBack={onCancel}
              />
            ) : (
              <PhoneCountryInput 
                onSubmit={handleContactSubmit}
                onBack={onCancel}
              />
            )
          )}
          
          {needsFullAuth && currentStep === "otp" && (
            <OTPVerification 
              phoneNumber={contactInfo}
              onSubmit={handleOTPSubmit}
              onBack={() => setCurrentStep("contact")}
            />
          )}
          
          {currentStep === "selfie" && (
            <SelfieCapture 
              onCapture={handleSelfieCapture}
              onBack={needsFullAuth ? () => setCurrentStep("otp") : onCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};
