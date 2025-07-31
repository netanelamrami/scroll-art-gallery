import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Mail, Phone, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageCount: number;
}

export const DownloadModal = ({ isOpen, onClose, imageCount }: DownloadModalProps) => {
  const [step, setStep] = useState<'contact' | 'quality' | 'success'>('contact');
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    quality: "high" // "high" or "web"
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email && !formData.phone) {
      toast({
        title: "שגיאה",
        description: "אנא הזינו טלפון או מייל",
        variant: "destructive"
      });
      return;
    }
    setStep('quality');
  };

  const handleQualitySubmit = async () => {
    try {
      // TODO: שליחה ל-API
      // await apiService.submitDownloadRequest(formData);
      
      setStep('success');
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setStep('contact');
        setFormData({ email: "", phone: "", quality: "high" });
      }, 3000);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הבקשה, נסו שוב",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    onClose();
    setStep('contact');
    setFormData({ email: "", phone: "", quality: "high" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          {step === 'contact' && (
            <>
              <div className="flex justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">הורדת כל התמונות</DialogTitle>
              <DialogDescription className="text-base">
                {imageCount} תמונות ממתינות לכם!
                <br />
                השאירו פרטים ונשלח לכם קישור להורדה כשהתמונות מוכנות
              </DialogDescription>
              
              <form onSubmit={handleContactSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    מייל (אופציונלי)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    טלפון (אופציונלי)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05X-XXXXXXX"
                    className="text-right"
                  />
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  * נדרש לפחות אחד מהפרטים לשליחת הקישור
                </p>
                
                <Button type="submit" className="w-full">
                  המשך לבחירת איכות
                </Button>
              </form>
            </>
          )}

          {step === 'quality' && (
            <>
              <div className="flex justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">בחירת איכות התמונות</DialogTitle>
              <DialogDescription className="text-base">
                איזו איכות תמונות תעדיפו?
              </DialogDescription>
              
              <div className="space-y-4 pt-4">
                <RadioGroup
                  value={formData.quality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <div className="font-medium">איכות גבוהה</div>
                      <div className="text-sm text-muted-foreground">
                        מתאים להדפסה ועריכה (קובץ גדול יותר)
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="web" id="web" />
                    <Label htmlFor="web" className="flex-1 cursor-pointer">
                      <div className="font-medium">איכות אינטרנט</div>
                      <div className="text-sm text-muted-foreground">
                        מתאים לשיתוף ברשתות (הורדה מהירה יותר)
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleQualitySubmit} className="flex-1">
                    שלח בקשה
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('contact')}
                    className="flex-1"
                  >
                    חזור
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-xl">הבקשה נשלחה בהצלחה!</DialogTitle>
              <DialogDescription className="text-base">
                תהליך הכנת התמונות החל.
                <br />
                נשלח לכם קישור להורדה תוך מספר דקות.
                <br />
                <span className="text-sm text-muted-foreground">
                  (חלון זה ייסגר אוטומטית)
                </span>
              </DialogDescription>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};