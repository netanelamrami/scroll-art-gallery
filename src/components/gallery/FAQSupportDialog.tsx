// FAQSupportDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Share2, Images, MessageCircle, QrCode } from 'lucide-react';
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";

export interface Question {
  title: string;
  answer: string;
  isExpanded?: boolean;
}

interface FAQSupportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  questions: Question[];
  event: event;
}

export const FAQSupportDialog = ({ isOpen, setIsOpen, questions, event }: FAQSupportDialogProps) => {
  const [faq, setFaq] = useState(questions);
  const { t } = useLanguage();

  const toggleAnswer = (idx: number) => {
    setFaq(faq =>
      faq.map((q, i) =>
        i === idx ? { ...q, isExpanded: !q.isExpanded } : q
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
       <Button
          variant="ghost"
          size="sm"
          className="rounded-full hover:bg-accent px-1 py-1 text-sm sm:px-4 sm:py-2"
        >
          <MessageCircle className="h-4 w-4 ml-2" />
          {t('navbar.support')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0">
        <div className="flex flex-col items-center py-4 px-2">
          {/* לוגו */}
          <img src="/main_simple.png" alt="Logo" className="w-24 mb-2" />
          {/* כפתור סגירה */}
          <button
            className="absolute top-2 left-2 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          {/* כותרות */}
          <h3 className="font-bold text-lg mt-4 mb-1">{t('support.guestSupport')}</h3>
          <h4 className="mb-4 text-base">{t('support.faqAndQuickHelp')}</h4>
          {/* שאלות ותשובות */}
          <div className="w-full">
            {faq.map((question, idx) => (
              <div key={idx} className="mb-2 border-b">
                <div
                  className="flex items-center cursor-pointer py-2"
                  onClick={() => toggleAnswer(idx)}
                >
                  <ChevronDown
                    className={`transition-transform mr-2 ${question.isExpanded ? "rotate-180" : ""}`}
                  />
                  <span className="font-medium">{question.title}</span>
                </div>
                {question.isExpanded && (
                  <div className="px-6 pb-2 text-sm text-muted-foreground">
                    {question.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* וואטסאפ */}
          <div className="flex items-center mt-6 w-full gap-4">
            <a
              href={`https://wa.me/585500232?text=${t('support.whatsappMessage')}%0A${t('support.eventName')}:+${encodeURIComponent(event.name)}%0A${t('support.eventId')}:+${encodeURIComponent(event.id.toString())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <img src="/whatapp-icon.png" alt="whatsapp" width={36} />
              <div>
                <span>{t('support.noAnswer')}</span>
                <br />
                <strong>{t('support.contactWhatsapp')}</strong>
              </div>
            </a>
            <a
              href="https://pixshare-ai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <img src="/atar.svg" alt="web" width={40} />
              <div>
                <span>{t('support.moreInfo')}</span>
                <br />
                <strong>Pixshare-ai.com</strong>
              </div>
            </a>
          </div>
          {/* תחתית */}
          <div className="mt-4 text-xs opacity-80">
            <a className="underline mx-1" href="https://www.pixshare.live/takanon" target="_blank" rel="noopener noreferrer">
              {t('support.terms')}
            </a>
            |
            <a className="underline mx-1" href="https://www.pixshare.live/privacy" target="_blank" rel="noopener noreferrer">
              {t('support.privacy')}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};