import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationModal } from "./NotificationModal";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";

interface NotificationBellProps {
  event: event;
}

export const NotificationBell = ({ event }: NotificationBellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = (contact: string, notifications: boolean) => {
    console.log('Subscribed:', { contact, notifications });
    // כאן נוסיף את הלוגיקה לשמירה בבסיס הנתונים
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="relative"
        title={t('notifications.subscribeTo')}
      >
        <Bell className="h-4 w-4" />
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