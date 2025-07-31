import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface LeadGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadGenerationModal = ({ isOpen, onClose }: LeadGenerationModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const { t } = useLanguage();
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
      title: t('leads.thanksFeedback'),
      description: t('leads.futureHelp')
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: שליחה ל-API
      // await apiService.submitLead(formData);
      
      toast({
        title: t('leads.thankYou'),
        description: t('leads.detailsSaved')
      });
      onClose();
      setShowForm(false);
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: t('toast.error.title'),
        description: t('leads.saveError'),
        variant: "destructive"
      });
    }
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
              <DialogTitle className="text-xl">{t('leads.likedService')}</DialogTitle>
              <DialogDescription className="text-base">
                {t('leads.upcomingEvent')}
              </DialogDescription>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleLiked}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {t('leads.yesEvent')}
                </Button>
                <Button 
                  onClick={handleNotLiked}
                  variant="outline"
                  className="flex-1"
                >
                  {t('leads.notSoon')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogTitle className="text-xl">{t('leads.letsTalk')}</DialogTitle>
              <DialogDescription className="text-base">
                {t('leads.leaveDetails')}
              </DialogDescription>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                 <div className="space-y-2">
                   <Label htmlFor="name">{t('leads.fullName')}</Label>
                   <Input
                     id="name"
                     value={formData.name}
                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                     placeholder={t('leads.fullNamePlaceholder')}
                     required
                     className="text-right"
                   />
                 </div>
                
                 <div className="space-y-2">
                   <Label htmlFor="phone">{t('leads.phone')}</Label>
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
                   <Label htmlFor="message">{t('leads.eventType')}</Label>
                   <Textarea
                     id="message"
                     value={formData.message}
                     onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                     placeholder={t('leads.eventTypePlaceholder')}
                     className="text-right resize-none"
                     rows={3}
                   />
                 </div>
                
                 <div className="flex gap-3 pt-2">
                   <Button type="submit" className="flex-1">
                     {t('leads.sendOffer')}
                   </Button>
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={() => setShowForm(false)}
                     className="flex-1"
                   >
                     {t('common.back')}
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