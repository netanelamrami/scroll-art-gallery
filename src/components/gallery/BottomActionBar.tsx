import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Download, X, Heart, CheckSquare } from "lucide-react";

interface BottomActionBarProps {
  selectedCount: number;
  onDownloadSelected: () => void;
  onToggleFavorites: () => void;
  onCancel: () => void;
}

export const BottomActionBar = ({
  selectedCount,
  onDownloadSelected,
  onToggleFavorites,
  onCancel
}: BottomActionBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center animate-slide-in-from-bottom">
      <div className="bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-2xl max-w-screen-sm w-full">
        <div className="safe-area-bottom px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Selected count indicator */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 backdrop-blur-sm">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {selectedCount} נבחרו
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFavorites}
                disabled={selectedCount === 0}
                className="gap-2 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 rounded-xl"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden xs:inline">מועדפים</span>
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={onDownloadSelected}
                disabled={selectedCount === 0}
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 rounded-xl"
              >
                <Download className="h-4 w-4" />
                <span className="hidden xs:inline">הורדה</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 rounded-xl"
              >
                <X className="h-4 w-4" />
                <span className="hidden xs:inline">ביטול</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};