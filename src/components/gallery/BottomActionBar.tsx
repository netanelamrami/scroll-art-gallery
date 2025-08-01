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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg animate-slide-in-from-bottom">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Selected count indicator */}
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
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
              className="gap-2 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-all duration-200"
            >
              <Heart className="h-4 w-4" />
              מועדפים
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadSelected}
              disabled={selectedCount === 0}
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              הורדה
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              ביטול
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};