import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCountryInput } from "@/components/auth/PhoneCountryInput";
import { EmailInput } from "@/components/auth/EmailInput";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";
import { Bell, X } from "lucide-react";

interface NotificationSubscriptionProps {
  event: event;
  onSubscribe: (contact: string, notifications: boolean) => void;
  onClose: () => void;
}

export const NotificationSubscription = ({ event, onSubscribe, onClose }: NotificationSubscriptionProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const isEmailMode = event?.registerBy === "Email";

  const handleContactSubmit = (contact: string, notifications: boolean) => {
    onSubscribe(contact, notifications);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 mx-4">
        <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">{t('notifications.title')}</p>
                <p className="text-xs opacity-90">{t('notifications.subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsExpanded(true)}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {t('notifications.getUpdates')}
            </h2>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEmailMode ? (
            <EmailInput 
              onSubmit={handleContactSubmit}
              onBack={() => setIsExpanded(false)}
            />
          ) : (
            <PhoneCountryInput 
              onSubmit={handleContactSubmit}
              onBack={() => setIsExpanded(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};