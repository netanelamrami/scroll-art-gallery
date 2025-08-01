import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
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
  const { t, language } = useLanguage();
  const [faq, setFaq] = useState(questions);

  // Update FAQ when language changes or questions change
  React.useEffect(() => {
    setFaq(questions);
  }, [questions, language]);

  const toggleAnswer = (idx: number) => {
    setFaq(faq =>
      faq.map((q, i) =>
        i === idx ? { ...q, isExpanded: !q.isExpanded } : q
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg p-0 max-h-[90vh] flex flex-col" dir={useLanguage().language === 'he' ? 'rtl' : 'ltr'}>
        <div className="flex flex-col py-4 px-2 h-full">
          {/* לוגו */}
          <img src="/main_simple.png" alt="Logo" className="w-24 mb-2 mx-auto" />
          {/* כפתור סגירה */}
          <button
            className="absolute top-2 right-2 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          {/* כותרות */}
          <h3 className="font-bold text-lg mt-4 mb-1 text-center">
            {useLanguage().language === 'he' ? 'תמיכת אורח' : 'Guest Support'}
          </h3>
          <h4 className="mb-4 text-base text-center">
            {useLanguage().language === 'he' ? 'שאלות נפוצות ועזרה מהירה' : 'FAQ and Quick Help'}
          </h4>
          {/* שאלות ותשובות */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] px-2">
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
          {/* וואטסאפ ואתר - תמיד נראה למטה */}
          <div className="flex items-center mt-4 w-full gap-4 px-2 border-t pt-4">
            <a
              href={`https://wa.me/585500232?text=${useLanguage().language === 'he' ? 'היי,%20אני%20צריך%20עזרה%20עם%20האירוע' : 'Hi,%20I%20need%20help%20with%20the%20event'}%0A${useLanguage().language === 'he' ? 'שם%20האירוע' : 'Event%20name'}:${encodeURIComponent(event.name)}%0A${useLanguage().language === 'he' ? 'מזהה%20האירוע' : 'Event%20ID'}:${encodeURIComponent(event.id.toString())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              <img src="/whatapp-icon.png" alt="whatsapp" width={36} />
              <div>
                <span className="text-sm">
                  {useLanguage().language === 'he' ? 'לא מוצא תשובה?' : "Can't find an answer?"}
                </span>
                <br />
                <strong className="text-green-600">
                  {useLanguage().language === 'he' ? 'פנה בוואטסאפ' : 'Contact WhatsApp'}
                </strong>
              </div>
            </a>
            <a
              href="https://pixshare-ai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              <img src="/atar.svg" alt="web" width={40} />
              <div>
                <span className="text-sm">
                  {useLanguage().language === 'he' ? 'מידע נוסף' : 'More info'}
                </span>
                <br />
                <strong className="text-blue-600">Pixshare-ai.com</strong>
              </div>
            </a>
          </div>
          {/* תחתית */}
          <div className="mt-4 text-xs opacity-80">
            <a className="underline mx-1" href="https://www.pixshare.live/takanon" target="_blank" rel="noopener noreferrer">
              {useLanguage().language === 'he' ? 'תקנון' : 'Terms'}
            </a>
            |
            <a className="underline mx-1" href="https://www.pixshare.live/privacy" target="_blank" rel="noopener noreferrer">
              {useLanguage().language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};