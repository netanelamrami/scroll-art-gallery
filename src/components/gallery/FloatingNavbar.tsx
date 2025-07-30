import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Images, MessageCircle, QrCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

interface FloatingNavbarProps {
  galleryType: 'all' | 'my';
  onToggleGalleryType: () => void;
  className?: string;
}

export const FloatingNavbar = ({ galleryType, onToggleGalleryType, className }: FloatingNavbarProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    try {
      const url = window.location.href;
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCode(qrDataURL);
      setIsQrOpen(true);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור QR קוד",
        variant: "destructive",
      });
    }
  };

  const handleSupport = () => {
    toast({
      title: "תמיכה",
      description: "פניה לתמיכה נשלחה בהצלחה",
    });
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
        {/* Support */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSupport}
          className="rounded-full hover:bg-accent"
        >
          <MessageCircle className="h-4 w-4 ml-2" />
          תמיכה
        </Button>

        {/* Gallery Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGalleryType}
          className="rounded-full min-w-[120px]"
        >
          <Images className="h-4 w-4 ml-2" />
          {galleryType === 'all' ? 'כל התמונות' : 'התמונות שלי'}
        </Button>

        {/* Share Event */}
        <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateQRCode}
              className="rounded-full hover:bg-accent"
            >
              <Share2 className="h-4 w-4 ml-2" />
              שתף אירוע
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">שתף את הגלריה</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {qrCode && (
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">
                סרוק את הקוד או שתף את הקישור
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "הקישור הועתק",
                    description: "הקישור לגלריה הועתק ללוח",
                  });
                }}
                className="w-full"
              >
                <Share2 className="h-4 w-4 ml-2" />
                העתק קישור
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};