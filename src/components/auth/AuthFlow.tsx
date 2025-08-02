
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();

  const isEmailMode = event?.registerBy === "Email";

  // פונקציה למזעור תמונה
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleContactSubmit = async (contact: string, notificationPreference: boolean) => {
    setContactInfo(contact);
    setNotifications(notificationPreference);
    setIsLoading(true);
    setLoadingMessage(isEmailMode ? "שולח אימייל..." : "שולח SMS...");
    
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
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    setIsLoading(true);
    setLoadingMessage("מאמת קוד...");
    
    try {
      const isVerified = await apiService.verifyOTP(contactInfo, otp);
      if (isVerified) {
        setOtpCode(otp);
        
        // בדיקה האם המשתמש כבר רשום
        setLoadingMessage("בודק משתמש קיים...");
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
    } catch (error) {
      console.error('Error in OTP verification:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה באימות הקוד. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleSelfieCapture = async (imageData: string) => {
    setSelfieData(imageData);
    setIsLoading(true);
    setLoadingMessage("מעבד תמונה...");
    
    try {
      // יצירת FormData לרישום המשתמש
      const formData = new FormData();
      
      // המרת base64 לblob ואז לfile
      const response = await fetch(imageData);
      const blob = await response.blob();
      const originalFile = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      
      // מזעור התמונה
      setLoadingMessage("מקטין תמונה...");
      const compressedBlob = await compressImage(originalFile, 800, 0.7);
      const compressedFile = new File([compressedBlob], 'selfie_compressed.jpg', { type: 'image/jpeg' });
      
      formData.append('image', compressedFile);
      formData.append('eventid', event.id.toString());
      
      if (event.needDetect) {
        setLoadingMessage("רושם משתמש חדש...");
        
        // משתמש חדש - משתמשים בטלפון/אימייל כid
        formData.append('id', contactInfo || "selfie-only");
        formData.append('fullname', 'Anonymous');
        formData.append('sendNotification', notifications.toString());
        formData.append('email', isEmailMode ? contactInfo : '');
        formData.append('AuthenticateBy', isEmailMode ? 'Email' : 'PhoneNumber');
        
        const registrationResponse = await apiService.registerUser(formData);
        
        if (registrationResponse && registrationResponse.token) {
          // שמירת הטוקן
          sessionStorage.setItem("jwtUser", registrationResponse.token);
          sessionStorage.setItem("isRegister", "true");
          
          // שליחת SMS עם קישור לגלריה (רק לטלפון)
          if (!isEmailMode && registrationResponse.user?.id) {
            try {
              setLoadingMessage("שולח קישור לגלריה...");
              await apiService.sendWelcomeSMS(contactInfo, event.eventLink, registrationResponse.user.id);
            } catch (smsError) {
              console.error('Failed to send welcome SMS:', smsError);
              toast({
                title: "התראה",
                description: "הרישום הצליח אבל שליחת SMS נכשלה. תוכל לגשת לגלריה דרך הקישור באתר.",
                variant: "default",
              });
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
        setLoadingMessage("רושם משתמש...");
        
        // לאירועים ללא זיהוי פנים
        const registrationResponse = await apiService.registerUserByPhoto(formData);
        
        if (registrationResponse && registrationResponse.token) {
          sessionStorage.setItem("jwtUser", registrationResponse.token);
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
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
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
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground text-sm text-center">
                {loadingMessage}
              </p>
            </div>
          )}
          
          {!isLoading && needsFullAuth && currentStep === "contact" && (
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
          
          {!isLoading && needsFullAuth && currentStep === "otp" && (
            <OTPVerification 
              phoneNumber={contactInfo}
              onSubmit={handleOTPSubmit}
              onBack={() => setCurrentStep("contact")}
              isEmailMode={isEmailMode}
            />
          )}
          
          {!isLoading && currentStep === "selfie" && (
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
