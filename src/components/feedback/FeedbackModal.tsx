import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleLiked = () => {
    setShowForm(true);
  };

  const handleNotLiked = () => {
    toast({
      title: "תודה על המשוב!",
      description: "נשמח לשמוע איך נוכל להשתפר בפעם הבאה"
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תוכל להוסיף שליחה לשרת
    toast({
      title: "תודה רבה!",
      description: "נחזור אליך בהקדם האפשרי ❤️"
    });
    onClose();
    setShowForm(false);
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
          
          {!showForm ? (
            <>
              <div className="flex justify-center">
                <Heart className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <DialogTitle className="text-xl">אהבתם את התמונות?</DialogTitle>
              <DialogDescription className="text-base">
                נשמח לשמוע מכם ולעזור בכל שאלה!
              </DialogDescription>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleLiked}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  כן, מדהים! 😍
                </Button>
                <Button 
                  onClick={handleNotLiked}
                  variant="outline"
                  className="flex-1"
                >
                  לא בדיוק
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogTitle className="text-xl">נשמח ליצור קשר!</DialogTitle>
              <DialogDescription className="text-base">
                השאירו פרטים ונחזור אליכם בהקדם
              </DialogDescription>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="השם שלכם"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05X-XXXXXXX"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">הודעה (אופציונלי)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="איך נוכל לעזור לכם?"
                    className="text-right resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1">
                    שלח
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    חזור
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};