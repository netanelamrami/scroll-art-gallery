import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCountryInput } from "@/components/auth/PhoneCountryInput";
import { EmailInput } from "@/components/auth/EmailInput";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";
import { Bell, X } from "lucide-react";

type NotificationStep = "collapsed" | "contact" | "otp" | "complete" | "hidden";

interface NotificationSubscriptionProps {
  event: event;
  onSubscribe: (contact: string, notifications: boolean) => void;
  onClose: () => void;
}

export const NotificationSubscription = ({ event, onSubscribe, onClose }: NotificationSubscriptionProps) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<NotificationStep>("collapsed");
  const [contactInfo, setContactInfo] = useState("");
  const [notifications, setNotifications] = useState(true);
  
  const isEmailMode = event?.registerBy === "Email";
  
  // Auto close after 20 seconds
  useEffect(() => {
    if (currentStep === "collapsed") {
      const timer = setTimeout(() => {
        setCurrentStep("hidden");
      }, 20000); // 20 שניות

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleContactSubmit = (contact: string, notificationPreference: boolean) => {
    setContactInfo(contact);
    setNotifications(notificationPreference);
    setCurrentStep("otp");
    console.log('Contact submitted for notifications:', contact);
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

  if (currentStep === "hidden") {
    return null;
  }

  if (currentStep === "collapsed") {
    return (
      <div className="fixed bottom-20 left-0 right-0 z-[60] mx-2 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:max-w-md animate-fade-in">
        <div className="bg-card/95 backdrop-blur-sm border border-accent/50 text-card-foreground rounded-lg shadow-lg p-3 w-full sm:max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <div>
                  <h3 className="font-medium text-sm">
                    {language === 'he' ? 'התראות על תמונות חדשות' : 'New Photo Notifications'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === 'he' ? 'קבל התראה כשמעלים תמונות חדשות' : 'Get notified when new photos are uploaded'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => setCurrentStep("contact")}
                  className="h-7 px-2 text-xs"
                >
                  {language === 'he' ? 'הירשם' : 'Subscribe'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("hidden")}
                  className="h-7 w-7 p-0"
                >
                  <X className="w-3 h-3" />
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
              onClick={() => setCurrentStep("hidden")}
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
              
              <Button onClick={() => setCurrentStep("hidden")} className="w-full">
                {t('notifications.close')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};