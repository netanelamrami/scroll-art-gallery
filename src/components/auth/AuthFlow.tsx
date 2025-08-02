
import { useState } from "react";
import { PhoneCountryInput } from "./PhoneCountryInput";
import { EmailInput } from "./EmailInput";
import { OTPVerification } from "./OTPVerification";
import { SelfieCapture } from "./SelfieCapture";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/data/services/apiService";
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
  const { toast } = useToast();

  const isEmailMode = event?.registerBy === "Email";

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
      setOtpCode(otp);
      
      // בדיקה האם המשתמש כבר רשום
      try {
        const authenticateBy = isEmailMode ? "Email" : "PhoneNumber";
        const userAuth = await apiService.authenticateUser(contactInfo, event.id, authenticateBy);
        
        if (userAuth && userAuth.isAuthenticated) {
          // המשתמש כבר רשום - מסיימים את התהליך ללא selfie
          setCurrentStep("complete");
          onComplete({
            contact: contactInfo,
            otp: otp,
            selfieData: "existing-user", // ציון שזה משתמש קיים
            notifications: notifications
          });
          toast({
            title: "ברוכים השובים!",
            description: "זוהית כמשתמש רשום. נכנסת לגלריה!",
            variant: "default",
          });
        } else {
          // משתמש חדש - ממשיכים לשלב selfie
          setCurrentStep("selfie");
        }
      } catch (error) {
        // אם יש שגיאה באימות, ממשיכים לשלב selfie
        console.error('Error authenticating existing user:', error);
        setCurrentStep("selfie");
      }
    } else {
      toast({
        title: "שגיאה",
        description: "קוד האימות שגוי. אנא נסה שוב.",
        variant: "destructive",
      });
    }
  };

  const handleSelfieCapture = async (imageData: string) => {
    setSelfieData(imageData);
    
    try {
      // יצירת FormData לרישום המשתמש
      const formData = new FormData();
      
      // המרת base64 לblob ואז לfile
      const response = await fetch(imageData);
      const blob = await response.blob();
      const imageFile = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      
      formData.append('image', imageFile);
      formData.append('eventid', event.id.toString());
      
      if (event.needDetect) {
        // משתמש חדש - משתמשים בטלפון/אימייל כid
        formData.append('id', contactInfo || "selfie-only");
        formData.append('fullname', ''); // אין שם מלא במערכת שלנו כרגע
        formData.append('sendNotification', notifications.toString());
        formData.append('email', isEmailMode ? contactInfo : '');
        formData.append('AuthenticateBy', isEmailMode ? 'Email' : 'PhoneNumber');
        
        const response = await apiService.registerUser(formData);
        
        if (response && response.token) {
          // שמירת הטוקן
          sessionStorage.setItem("jwtUser", response.token);
          sessionStorage.setItem("isRegister", "true");
          
          // שליחת SMS עם קישור לגלריה (רק לטלפון)
          if (!isEmailMode && response.user?.id) {
            try {
              await apiService.sendWelcomeSMS(contactInfo, event.eventLink, response.user.id);
            } catch (smsError) {
              console.error('Failed to send welcome SMS:', smsError);
              // לא נוותר על הרישום בגלל שגיאת SMS
            }
          }
          
          setCurrentStep("complete");
          onComplete({
            contact: contactInfo || "selfie-only",
            otp: otpCode || "no-otp",
            selfieData: imageData,
            notifications: notifications
          });
          
          toast({
            title: "רישום הושלם בהצלחה!",
            description: isEmailMode ? "נרשמת בהצלחה!" : "נרשמת בהצלחה! SMS נשלח עם קישור לגלריה שלך",
            variant: "default",
          });
        } else {
          throw new Error("Registration failed - no token received");
        }
      } else {
        // לאירועים ללא זיהוי פנים
        const response = await apiService.registerUserByPhoto(formData);
        
        if (response && response.token) {
          sessionStorage.setItem("jwtUser", response.token);
          sessionStorage.setItem("isRegister", "true");
          
          setCurrentStep("complete");
          onComplete({
            contact: contactInfo || "selfie-only",
            otp: otpCode || "no-otp", 
            selfieData: imageData,
            notifications: notifications
          });
          
          toast({
            title: "רישום הושלם!",
            description: "נרשמת בהצלחה לאירוע!",
            variant: "default",
          });
        } else {
          throw new Error("Registration by photo failed");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "שגיאה ברישום",
        description: "אירעה שגיאה ברישום. אנא נסה שוב.",
        variant: "destructive",
      });
    }
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
              isEmailMode={isEmailMode}
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
