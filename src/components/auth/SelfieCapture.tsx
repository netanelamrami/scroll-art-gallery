import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";
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
  const { t } = useLanguage();

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("שגיאה בגישה למצלמה. אנא וודא שהמצלמה מחוברת ונתת הרשאה.");
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          צלם סלפי כדי לזהות את התמונות שלך בגלרייה
        </p>
      </div>

      {/* Camera/Image display */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
        {!isCapturing && !capturedImage && (
          <div className="text-center">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              הפעל מצלמה לצילום סלפי
            </p>
            <Button onClick={startCamera} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  טוען...
                </div>
              ) : (
                "התחל צילום"
              )}
            </Button>
          </div>
        )}

        {isCapturing && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
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

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          חזור
        </Button>

        {isCapturing && (
          <Button
            onClick={capturePhoto}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            צלם
          </Button>
        )}

        {capturedImage && (
          <>
            <Button
              variant="outline"
              onClick={retakePhoto}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              צלם שוב
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              אישור
            </Button>
          </>
        )}
      </div>
    </div>
  );
};