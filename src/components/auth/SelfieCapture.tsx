import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, Upload } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SelfieCaptureProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

export const SelfieCapture = ({ onCapture, onBack }: SelfieCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      
      // בדיקה אם יש תמיכה במצלמה
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('המצלמה אינה נתמכת בדפדפן זה');
        return;
      }

      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        },
        audio: false
      };
      
      console.log('Requesting camera access with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCapturing(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // טיפול בשגיאות ספציפיות
      if (error.name === 'NotAllowedError') {
        alert('יש לאשר גישה למצלמה כדי לצלם סלפי');
      } else if (error.name === 'NotFoundError') {
        alert('מצלמה לא נמצאה במכשיר');
      } else {
        alert('שגיאה בגישה למצלמה. נסה להעלות תמונה במקום זאת.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the image horizontally for selfie effect
    context.scale(-1, 1);
    context.translate(-canvas.width, 0);
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          {t('auth.selfieInstruction')}
        </p>
      </div>

      {/* Camera/Image display */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center min-h-[300px]">
        {!isCapturing && !capturedImage && (
          <div className="text-center">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {isMobile ? t('auth.takeSelfie') : t('auth.selectImageOrCamera')}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={handleFileUpload} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                {t('auth.selectFile')}
              </Button>
              <Button onClick={startCamera} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t('auth.loading')}
                  </div>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    {t('auth.camera')}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {isCapturing && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1] absolute inset-0"
            style={{ minHeight: '300px' }}
          />
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full h-full object-cover"
          />
        )}

        {/* Capture overlay */}
        {isCapturing && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Frame overlay */}
            <div className="absolute inset-4 border-2 border-white rounded-full opacity-50" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 border-2 border-white rounded-full" />
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        {isCapturing && (
          <>
            <Button
              onClick={capturePhoto}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              {t('auth.takePhoto')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              {t('common.back')}
            </Button>
          </>
        )}

        {capturedImage && (
          <>
            <Button
              onClick={confirmPhoto}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              {t('auth.confirm')}
            </Button>
            <Button
              variant="outline"
              onClick={retakePhoto}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('auth.retake')}
            </Button>
          </>
        )}

        {!isCapturing && !capturedImage && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            {t('common.back')}
          </Button>
        )}
      </div>
    </div>
  );
};