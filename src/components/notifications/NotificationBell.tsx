import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationModal } from "./NotificationModal";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { event } from "@/types/event";

interface NotificationBellProps {
  event: event;
}

export const NotificationBell = ({ event }: NotificationBellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userContact, setUserContact] = useState<string | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  // בדיקה אם המשתמש כבר רשום - נבדוק את הלוקל סטורג'
  useEffect(() => {
    const savedContact = localStorage.getItem('userContact');
    const savedSubscription = localStorage.getItem('notificationSubscription');
    
    if (savedContact && savedSubscription === 'true') {
      setIsSubscribed(true);
      setUserContact(savedContact);
    }
  }, []);

  const handleSubscribe = (contact: string, notifications: boolean) => {
    console.log('Subscribed:', { contact, notifications });
    
    // שמירה ברלוקל סטורג'
    localStorage.setItem('userContact', contact);
    localStorage.setItem('notificationSubscription', notifications.toString());
    
    setIsSubscribed(notifications);
    setUserContact(contact);
    setIsModalOpen(false);
    
    toast({
      title: notifications ? t('notifications.subscribeSuccess') : t('notifications.notificationsDisabled'),
      description: notifications ? t('notifications.notificationsEnabled') : t('notifications.notificationsDisabled'),
    });
  };

  const toggleSubscription = () => {
    if (isSubscribed && userContact) {
      // כבה התראות
      localStorage.setItem('notificationSubscription', 'false');
      setIsSubscribed(false);
      
      toast({
        title: t('notifications.notificationsDisabled'),
        description: t('notifications.notificationsDisabled'),
      });
    } else {
      // פתח מודל להרשמה או הפעלת התראות
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSubscription}
        className="relative"
        title={isSubscribed ? t('notifications.notificationsDisabled') : t('notifications.subscribeTo')}
      >
        {isSubscribed ? (
          <Bell className="h-4 w-4 text-primary" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </Button>

      {isModalOpen && (
        <NotificationModal
          event={event}
          onSubscribe={handleSubscribe}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};