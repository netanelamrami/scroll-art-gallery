
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface EmailInputProps {
  onSubmit: (email: string, notifications: boolean) => void;
  onBack: () => void;
}

export const EmailInput = ({ onSubmit, onBack }: EmailInputProps) => {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: t('toast.error.title'),
        description: t('auth.emailRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: t('toast.error.title'),
        description: t('auth.invalidEmail'),
        variant: "destructive",
      });
      return;
    }

    onSubmit(email, notifications);
  };

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t('auth.enterEmail')}</h2>
        <p className="text-muted-foreground">
          {t('auth.emailInstruction')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder={t('auth.enterEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
          dir="ltr"
        />
        
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
