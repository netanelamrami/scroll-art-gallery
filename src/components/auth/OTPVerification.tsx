import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/hooks/useLanguage";

interface OTPVerificationProps {
  phoneNumber: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
}

export const OTPVerification = ({ phoneNumber, onSubmit, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { t } = useLanguage();

  // טיימר לשליחה חוזרת
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 4) return;
    
    setIsLoading(true);
    
    // דמיית אימות הקוד
    setTimeout(() => {
      setIsLoading(false);
      // במציאות נבדק את הקוד מול השרת
      onSubmit(otp);
    }, 1000);
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimeLeft(60);
    setOtp("");
    
    // דמיית שליחה חוזרת
    console.log("Resending SMS to:", phoneNumber);
  };

  const maskedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1***$3");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-2">
          {t('auth.otp.description') || "הזן את הקוד בן 4 הספרות שנשלח אליך"}
        </p>
        <p className="text-sm text-foreground font-medium">
          {maskedPhone}
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={4}
          value={otp}
          onChange={setOtp}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Resend section */}
      <div className="text-center">
        {!canResend ? (
          <p className="text-sm text-muted-foreground">
            {t('auth.otp.resendIn') || "שלח שוב בעוד"} {timeLeft} {t('auth.otp.seconds') || "שניות"}
          </p>
        ) : (
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            className="text-sm p-0 h-auto"
          >
            {t('auth.otp.resend') || "שלח קוד שוב"}
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          {t('common.back') || "חזור"}
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={otp.length !== 4 || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {t('auth.otp.verifying') || "מאמת..."}
            </div>
          ) : (
            t('common.continue') || "המשך"
          )}
        </Button>
      </div>
    </form>
  );
};