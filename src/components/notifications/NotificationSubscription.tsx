import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCountryInput } from "@/components/auth/PhoneCountryInput";
import { EmailInput } from "@/components/auth/EmailInput";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";
import { Bell, X } from "lucide-react";

type NotificationStep = "collapsed" | "contact" | "otp" | "complete";

interface NotificationSubscriptionProps {
  event: event;
  onSubscribe: (contact: string, notifications: boolean) => void;
  onClose: () => void;
}

export const NotificationSubscription = ({ event, onSubscribe, onClose }: NotificationSubscriptionProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<NotificationStep>("collapsed");
  const [contactInfo, setContactInfo] = useState("");
  const [notifications, setNotifications] = useState(true);
  
  const isEmailMode = event?.registerBy === "Email";

  const handleContactSubmit = (contact: string, notificationPreference: boolean) => {
    setContactInfo(contact);
    setNotifications(notificationPreference);
    setCurrentStep("otp");
    console.log('Contact submitted for notifications:', contact);
    // שליחת SMS/Email במציאות
  };

  const handleOTPSubmit = (otp: string) => {
    console.log('OTP verified for notifications:', otp);
    setCurrentStep("complete");
    onSubscribe(contactInfo, notifications);
  };

  const stepTitles = {
    collapsed: "",
    contact: t('notifications.subscribeTo'),
    otp: t('auth.otpVerification'),
    complete: t('notifications.subscribeSuccess')
  };

  if (currentStep === "collapsed") {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 mx-4">
        <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-sm">{t('notifications.title')}</p>
                <p className="text-xs opacity-90">{t('notifications.subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentStep("contact")}
                className="text-xs"
              >
                {t('notifications.subscribe')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md">
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
              onClick={() => setCurrentStep("collapsed")}
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
                  onBack={() => setCurrentStep("collapsed")}
                />
              ) : (
                <PhoneCountryInput 
                  onSubmit={handleContactSubmit}
                  onBack={() => setCurrentStep("collapsed")}
                />
              )}
            </>
          )}
          
          {currentStep === "otp" && (
            <OTPVerification 
              phoneNumber={contactInfo}
              onSubmit={handleOTPSubmit}
              onBack={() => setCurrentStep("contact")}
            />
          )}

          {currentStep === "complete" && (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-4">
                <div className="text-green-600 dark:text-green-400 text-sm">
                  ✓ {t('notifications.subscribeSuccess')}
                </div>
              </div>
              
              <Button onClick={() => setCurrentStep("collapsed")} className="w-full">
                {t('notifications.close')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};