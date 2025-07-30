import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  onCancel: () => void;
}

export const PhoneInput = ({ onSubmit, onCancel }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) return;
    
    // בדיקה בסיסית של מספר הטלפון
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("אנא הזן מספר טלפון ישראלי תקין (05XXXXXXXX)");
      return;
    }

    setIsLoading(true);
    
    // דמיית שליחת SMS - במציאות נשלח בקשה לשרת
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(phone);
    }, 1500);
  };

  const formatPhoneNumber = (value: string) => {
    // הסרת כל התווים שאינם ספרות
    const numbers = value.replace(/\D/g, '');
    
    // הגבלה ל-10 ספרות
    if (numbers.length > 10) return phone;
    
    return numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          {t('auth.phone.description') || "הזן את מספר הטלפון שלך כדי לקבל קוד אימות"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          {t('auth.phone.label') || "מספר טלפון"}
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="05XXXXXXXX"
          className="text-lg text-center tracking-wider"
          dir="ltr"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground text-center">
          {t('auth.phone.format') || "פורמט: 05XXXXXXXX"}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          {t('common.cancel') || "ביטול"}
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!phone || phone.length !== 10 || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {t('auth.phone.sending') || "שולח..."}
            </div>
          ) : (
            t('common.continue') || "המשך"
          )}
        </Button>
      </div>
    </form>
  );
};