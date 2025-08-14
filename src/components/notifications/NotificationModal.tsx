import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCountryInput } from "@/components/auth/PhoneCountryInput";
import { EmailInput } from "@/components/auth/EmailInput";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/data/services/apiService";
import { event } from "@/types/event";
import { Bell, X } from "lucide-react";

type NotificationStep = "contact" | "otp" | "complete";

interface NotificationModalProps {
  event: event;
  onSubscribe: (contact: string, notifications: boolean) => void;
  onClose: () => void;
}

export const NotificationModal = ({ event, onSubscribe, onClose }: NotificationModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<NotificationStep>("contact");
  const [contactInfo, setContactInfo] = useState("");
  const [notifications, setNotifications] = useState(true);
  
  const isEmailMode = event?.registerBy === "Email";
useEffect(() => {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.overflow = 'hidden';
  document.body.style.width = '100%';

  return () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY); // מחזיר את המשתמש לאותו מקום
  };
}, []);


  const handleContactSubmit = async (contact: string, notificationPreference: boolean) => {
    setContactInfo(contact);
    setNotifications(notificationPreference);
    
    try {
      if (isEmailMode) {
        await apiService.sendOTPEmail(contact);
        toast({
          title: "אימייל נשלח",
          description: "קוד האימות נשלח לכתובת המייל שלך",
          variant: "default",
        });
      } else {
        const verificationMessage = "קוד האימות שלך מ Pixshare, ברוכים הבאים";
        await apiService.sendSMS(contact, verificationMessage, true);
        toast({
          title: "SMS נשלח", 
          description: "קוד האימות נשלח למספר הטלפון שלך",
          variant: "default",
        });
      }
      
      setCurrentStep("otp");
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "שגיאה",
        description: `שליחת ה${isEmailMode ? 'אימייל' : 'SMS'} נכשלה. אנא נסה שוב.`,
        variant: "destructive",
      });
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    const isVerified = await apiService.verifyOTP(contactInfo, otp);
    if (isVerified) {
      setCurrentStep("complete");
      onSubscribe(contactInfo, notifications);
    } else {
      toast({
        title: "שגיאה",
        description: "קוד האימות שגוי. אנא נסה שוב.",
        variant: "destructive",
      });
    }
  };

  const stepTitles = {
    contact: t('notifications.subscribeTo'),
    otp: t('auth.otpVerification'),
    complete: t('notifications.subscribeSuccess')
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md relative"
           style={{ maxHeight: '90vh', overflow: 'auto', }}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {stepTitles[currentStep]}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress indicator */}
          {currentStep !== "complete" && (
            <div className="mt-4 flex gap-2">
              {["contact", "otp"].map((step, index) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step === currentStep || 
                    (currentStep === "otp" && step === "contact")
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === "contact" && (
            <>
              <div className="mb-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t('notifications.subtitle')}
                </p>
              </div>
              
              {isEmailMode ? (
                <EmailInput 
                  onSubmit={handleContactSubmit}
                  onBack={onClose}
                />
              ) : (
                <PhoneCountryInput 
                  onSubmit={handleContactSubmit}
                  onBack={onClose}
                />
              )}
            </>
          )}
          
          {currentStep === "otp" && (
            <OTPVerification 
              phoneNumber={contactInfo}
              onSubmit={handleOTPSubmit}
              onBack={() => setCurrentStep("contact")}
              isEmailMode={isEmailMode}
            />
          )}

          {currentStep === "complete" && (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-4">
                <div className="text-green-600 dark:text-green-400 text-sm">
                  ✓ {t('notifications.subscribeSuccess')}
                </div>
              </div>
              
              <Button onClick={onClose} className="w-full">
                {t('notifications.close')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};