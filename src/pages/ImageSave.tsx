import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Info } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export const ImageSave = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  
  const imageUrl = searchParams.get('url');
  const imageName = searchParams.get('name') || 'image';
  
  useEffect(() => {
    // Show instructions after a brief delay for better UX
    const timer = setTimeout(() => setShowInstructions(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!imageUrl) {
    navigate(-1);
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-foreground hover:bg-accent"
          >
            {language === 'he' ? 
              <ArrowLeft className="h-5 w-5 rotate-180" /> : 
              <ArrowLeft className="h-5 w-5" />
            }
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {t('imageSave.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('imageSave.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions Banner */}
      <div 
        className={cn(
          "mx-4 mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-all duration-500",
          showInstructions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              {t('imageSave.instructions.title')}
            </p>
            <ol className="space-y-1 text-blue-800 dark:text-blue-200">
              <li>1. {t('imageSave.instructions.step1')}</li>
              <li>2. {t('imageSave.instructions.step2')}</li>
              <li>3. {t('imageSave.instructions.step3')}</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div 
            className={cn(
              "relative bg-card border border-border rounded-lg overflow-hidden shadow-lg transition-all duration-700",
              showInstructions ? "opacity-100 scale-100" : "opacity-70 scale-95"
            )}
          >
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-auto max-h-[70vh] object-contain"
              draggable={false}
            />
            
            {/* Download Hint Overlay */}
            <div 
              className={cn(
                "absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-1000",
                showInstructions ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-4 animate-pulse">
                <Download className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Help Text */}
          <div 
            className={cn(
              "text-center mt-6 transition-all duration-700 delay-300",
              showInstructions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <p className="text-muted-foreground">
              {t('imageSave.longPressHint')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            {language === 'he' ? 
              <ArrowLeft className="h-4 w-4 rotate-180" /> : 
              <ArrowLeft className="h-4 w-4" />
            }
            {t('common.backToGallery')}
          </Button>
        </div>
      </div>
    </div>
  );
};