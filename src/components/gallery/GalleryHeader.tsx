
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3, MoreVertical, Download, CheckSquare, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/types/event";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface GalleryHeaderProps {
  event: event;
  totalImages: number;
  columns: number;
  onColumnsChange: (columns: number) => void;
  onDownloadAll: () => void;
  onDownloadSelected: () => void;
  onToggleSelection: () => void;
  onShare: () => void;
  isSelectionMode: boolean;
  selectedCount: number;
}

export const GalleryHeader = ({
  event,
  totalImages,
  columns,
  onColumnsChange,
  onDownloadAll,
  onDownloadSelected,
  onToggleSelection,
  onShare,
  isSelectionMode,
  selectedCount
}: GalleryHeaderProps) => {
  const { t, language } = useLanguage();
  // Check if mobile for different column options
  const isMobile = window.innerWidth < 768;
  const columnOptions = isMobile 
    ? [
        { value: 1, icon: Grid, label: "עמודה 1" },
        { value: 2, icon: LayoutGrid, label: "עמודות 2" },
        { value: 3, icon: Grid3x3, label: "עמודות 3" },
      ]
    : [
        { value: 3, icon: Grid, label: "עמודות 3" },
        { value: 4, icon: LayoutGrid, label: "עמודות 4" },
        { value: 5, icon: Grid3x3, label: "עמודות 5" },
      ];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full">
      <div className="w-full px-4 py-2 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {event.name} 
            </h1>
            {/* <p className="text-muted-foreground mt-1">
              {isSelectionMode && selectedCount > 0 
                ? `${selectedCount} ${t('gallery.selectedImages')} ${totalImages.toLocaleString()}`
                : `${totalImages.toLocaleString()} ${t('gallery.totalImages')}`
              }
            </p> */}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selection mode indicator and controls */}
            {isSelectionMode && (
              <div className="flex items-center gap-3 mr-4 animate-in slide-in-from-left duration-300">
                {/* Selected count indicator */}
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {selectedCount} נבחרו
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onDownloadSelected}
                    disabled={selectedCount === 0}
                    className="gap-2 bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                    הורדה
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleSelection}
                    className="gap-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition-all duration-200 hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                    ביטול
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
