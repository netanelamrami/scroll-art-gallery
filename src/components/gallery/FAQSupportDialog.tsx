import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
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
      <DialogContent className="max-w-lg p-0 max-h-[90vh] overflow-y-auto">
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
          <h3 className="font-bold text-lg mt-4 mb-1">תמיכת אורח</h3>
          <h4 className="mb-4 text-base">שאלות נפוצות ועזרה מהירה</h4>
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
              href={`https://wa.me/585500232?text=היי,%20אני%20צריך%20עזרה%20עם%20האירוע%0Aשם%20האירוע:${encodeURIComponent(event.name)}%0Aמזהה%20האירוע:${encodeURIComponent(event.id.toString())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src="/whatapp-icon.png" alt="whatsapp" width={36} />
              <div>
                <span className="text-sm">לא מוצא תשובה?</span>
                <br />
                <strong className="text-green-600">פנה בוואטסאפ</strong>
              </div>
            </a>
            <a
              href="https://pixshare-ai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src="/atar.svg" alt="web" width={40} />
              <div>
                <span className="text-sm">מידע נוסף</span>
                <br />
                <strong className="text-blue-600">Pixshare-ai.com</strong>
              </div>
            </a>
          </div>
          {/* תחתית */}
          <div className="mt-4 text-xs opacity-80">
            <a className="underline mx-1" href="https://www.pixshare.live/takanon" target="_blank" rel="noopener noreferrer">
              תקנון
            </a>
            |
            <a className="underline mx-1" href="https://www.pixshare.live/privacy" target="_blank" rel="noopener noreferrer">
              מדיניות פרטיות
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};