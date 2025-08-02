import React, { useState, useRef } from 'react';
import { useMultiUserAuth } from '@/hooks/useMultiUserAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const { addUser } = useMultiUserAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'selfie' | 'complete'>('info');
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' });
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInfoSubmit = () => {
    // Skip info validation - only name is optional now
    setStep('selfie');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast({
        title: t('auth.cameraError') || 'שגיאה במצלמה',
        description: t('auth.cameraError'),
        variant: 'destructive'
      });
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setSelfieImage(imageData);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfieImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = () => {
    if (!selfieImage) {
      toast({
        title: t('auth.error') || 'שגיאה',
        description: t('users.selfieRequired') || 'יש להעלות תמונת סלפי',
        variant: 'destructive'
      });
      return;
    }

    const newUser = addUser({
      name: userInfo.name || `משתמש ${Date.now()}`,
      phone: '',
      email: '',
      selfieImage
    });

    console.log('New user added from AddUserModal:', newUser);
    setStep('complete');
    
    setTimeout(() => {
      onClose();
      // Reset form
      setStep('info');
      setUserInfo({ name: '', phone: '', email: '' });
      setSelfieImage(null);
      
      // Force parent component re-render by triggering window event
      window.dispatchEvent(new CustomEvent('userAdded', { detail: newUser }));
    }, 1500);
  };

  const handleClose = () => {
    // Stop camera if active
    if (videoRef.current && isCapturing) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    onClose();
    // Reset form
    setStep('info');
    setUserInfo({ name: '', phone: '', email: '' });
    setSelfieImage(null);
    setIsCapturing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'info' && (t('users.addUser') || 'הוסף משתמש')}
            {step === 'selfie' && (t('auth.selfieCapture') || 'צילום סלפי')}
            {step === 'complete' && (t('users.userAdded') || 'משתמש נוסף בהצלחה')}
          </DialogTitle>
        </DialogHeader>

        {step === 'info' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('users.name') || 'שם'} ({t('common.optional') || 'אופציונלי'})</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('users.namePlaceholder') || 'הזן שם (אופציונלי)'}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                {t('common.cancel') || 'ביטול'}
              </Button>
              <Button onClick={handleInfoSubmit}>
                {t('common.next') || 'הבא'}
              </Button>
            </div>
          </div>
        )}

        {step === 'selfie' && (
          <div className="space-y-4">
            {!selfieImage && !isCapturing && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  {t('auth.selfieInstruction') || 'צלם סלפי כדי לזהות את התמונות שלך בגלרייה'}
                </p>
                <div className="flex gap-2">
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    {t('auth.camera') || 'מצלמה'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('auth.selectFile') || 'בחר קובץ'}
                  </Button>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-lg bg-muted"
                />
                <div className="flex gap-2">
                  <Button onClick={takeSelfie} className="flex-1">
                    {t('auth.takePhoto') || 'צלם'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const stream = videoRef.current?.srcObject as MediaStream;
                      if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                      }
                      setIsCapturing(false);
                    }}
                  >
                    {t('common.cancel') || 'ביטול'}
                  </Button>
                </div>
              </div>
            )}

            {selfieImage && (
              <div className="space-y-3">
                <img
                  src={selfieImage}
                  alt="Selfie preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateUser} className="flex-1">
                    {t('auth.confirm') || 'אישור'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelfieImage(null)}
                  >
                    {t('auth.retake') || 'צלם שוב'}
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-medium">
              {t('users.userAdded') || 'משתמש נוסף בהצלחה!'}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('users.userSwitched') || 'המשתמש החדש הפך לפעיל'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};