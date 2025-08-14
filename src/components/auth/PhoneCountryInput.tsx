
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { log } from "node:console";
import countries from "@/types/contries";

interface PhoneCountryInputProps {
  onSubmit: (phone: string, notifications: boolean) => void;
  onBack: () => void;
}

export const PhoneCountryInput = ({ onSubmit, onBack }: PhoneCountryInputProps) => {
  const [countryCode, setCountryCode] = useState("+972");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notifications, setNotifications] = useState(true);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const validatePhoneNumber = (number: string, countryCode: string): boolean => {
    const selectedCountry = countries.find(country => country.code === countryCode);
    if (!selectedCountry) return false;
    
    // Remove leading zero and any spaces/dashes
    const cleanNumber = number.replace(/^0/, '').replace(/[\s-]/g, '');
    
    return selectedCountry.pattern.test(cleanNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: t('toast.error.title'),
        description: t('auth.phoneRequired'),
        variant: "destructive",
      });
      return;
    }

    const cleanPhoneNumber = phoneNumber.replace(/^0/, '').replace(/[\s-]/g, '');

    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      toast({
        title: t('toast.error.title'),
        description: t('auth.invalidPhone'),
        variant: "destructive",
      });
      return;
    }

    const fullPhone = countryCode + cleanPhoneNumber;
    onSubmit(fullPhone, notifications);
  };

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">{t('auth.enterPhone')}</h2>
        <p className="text-muted-foreground">
          {t('auth.phoneInstruction')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2" dir="ltr">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                    <span className="text-sm text-muted-foreground">
                      {country.name[language as keyof typeof country.name]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="tel"
            placeholder={t('auth.enterPhone')}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
            required
            dir="ltr"
          />
        </div>
        
        {/* <div className="text-xs text-muted-foreground text-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
          {t('auth.phoneExample')}
        </div> */}

        <div className="flex items-center text-center space-x-2 space-x-reverse" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <Checkbox
            id="notifications"
            checked={notifications}
            onCheckedChange={(checked) => setNotifications(checked as boolean)}
          />
          <label
            htmlFor="notifications"
            className="text-sm text-center font-medium leading-none align-middle peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('auth.notifyNewPhotos')}
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1  mt-4"
          >
            {t('common.back')}
          </Button>
          <Button type="submit" className="flex-1  mt-4">
            {t('auth.sendCode')}
          </Button>
        </div>
      </form>
    </div>
  );
};
