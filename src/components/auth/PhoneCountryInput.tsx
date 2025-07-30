import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneCountryInputProps {
  onSubmit: (phone: string) => void;
  onBack: () => void;
}

const countries = [
  { code: "+972", name: "ישראל", flag: "🇮🇱" },
  { code: "+1", name: "ארה״ב", flag: "🇺🇸" },
  { code: "+44", name: "בריטניה", flag: "🇬🇧" },
  { code: "+33", name: "צרפת", flag: "🇫🇷" },
  { code: "+49", name: "גרמניה", flag: "🇩🇪" },
  { code: "+39", name: "איטליה", flag: "🇮🇹" },
  { code: "+34", name: "ספרד", flag: "🇪🇸" },
  { code: "+31", name: "הולנד", flag: "🇳🇱" },
  { code: "+41", name: "שוויץ", flag: "🇨🇭" },
  { code: "+43", name: "אוסטריה", flag: "🇦🇹" },
];

export const PhoneCountryInput = ({ onSubmit, onBack }: PhoneCountryInputProps) => {
  const [countryCode, setCountryCode] = useState("+972");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      const fullPhone = countryCode + phoneNumber.replace(/^0/, '');
      onSubmit(fullPhone);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">הזן מספר טלפון</h2>
        <p className="text-muted-foreground">
          נשלח לך קוד אימות בהודעת SMS
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
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="tel"
            placeholder="הזן מספר טלפון"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
            required
            dir="ltr"
          />
        </div>
        
        <div className="text-xs text-muted-foreground text-center" dir="rtl">
          המספר יוזן ללא הקידומת 0. לדוגמה: 50-123-4567
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            שלח קוד
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            חזור
          </Button>
        </div>
      </form>
    </div>
  );
};