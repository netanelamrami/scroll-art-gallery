
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { log } from "node:console";

interface PhoneCountryInputProps {
  onSubmit: (phone: string, notifications: boolean) => void;
  onBack: () => void;
}

const countries = [
  { 
    code: "+972", 
    name: { he: "ישראל", en: "Israel" }, 
    flag: "🇮🇱",
    pattern: /^5[0-9]{8}$/ // Israeli mobile format: 5XXXXXXXX
  },
  { 
    code: "+1", 
    name: { he: "ארה״ב", en: "United States" }, 
    flag: "🇺🇸",
    pattern: /^[2-9][0-9]{9}$/ // US format: [2-9]XXXXXXXXX
  },
  { 
    code: "+44", 
    name: { he: "בריטניה", en: "United Kingdom" }, 
    flag: "🇬🇧",
    pattern: /^7[0-9]{9}$/ // UK mobile format: 7XXXXXXXXX
  },
  { 
    code: "+33", 
    name: { he: "צרפת", en: "France" }, 
    flag: "🇫🇷",
    pattern: /^[67][0-9]{8}$/ // France mobile format: [67]XXXXXXXX
  },
  { 
    code: "+49", 
    name: { he: "גרמניה", en: "Germany" }, 
    flag: "🇩🇪",
    pattern: /^1[5-7][0-9]{8,9}$/ // Germany mobile format: 1[5-7]XXXXXXXX
  },
  { 
    code: "+39", 
    name: { he: "איטליה", en: "Italy" }, 
    flag: "🇮🇹",
    pattern: /^3[0-9]{8,9}$/ // Italy mobile format: 3XXXXXXXX
  },
  { 
    code: "+34", 
    name: { he: "ספרד", en: "Spain" }, 
    flag: "🇪🇸",
    pattern: /^[67][0-9]{8}$/ // Spain mobile format: [67]XXXXXXXX
  },
  { 
    code: "+31", 
    name: { he: "הולנד", en: "Netherlands" }, 
    flag: "🇳🇱",
    pattern: /^6[0-9]{8}$/ // Netherlands mobile format: 6XXXXXXXX
  },
  { 
    code: "+41", 
    name: { he: "שוויץ", en: "Switzerland" }, 
    flag: "🇨🇭",
    pattern: /^7[0-9]{8}$/ // Switzerland mobile format: 7XXXXXXXX
  },
  { 
    code: "+43", 
    name: { he: "אוסטריה", en: "Austria" }, 
    flag: "🇦🇹",
    pattern: /^6[0-9]{8,10}$/ // Austria mobile format: 6XXXXXXXX
  },
];

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
        <h2 className="text-2xl font-bold mb-2">{t('auth.enterPhone')}</h2>
        <p className="text-muted-foreground">
          {t('auth.phoneInstruction')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2" dir="ltr">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-32">
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
        
        <div className="text-xs text-muted-foreground text-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
          {t('auth.phoneExample')}
        </div>

        <div className="flex items-center space-x-2 space-x-reverse" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <Checkbox
            id="notifications"
            checked={notifications}
            onCheckedChange={(checked) => setNotifications(checked as boolean)}
          />
          <label
            htmlFor="notifications"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('auth.notifyNewPhotos')}
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            {t('common.back')}
          </Button>
          <Button type="submit" className="flex-1">
            {t('auth.sendCode')}
          </Button>
        </div>
      </form>
    </div>
  );
};
