
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3, MoreVertical, Download, CheckSquare, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface GalleryHeaderProps {
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
  const columnOptions = [
    { value: 2, icon: Grid, label: "2 עמודות" },
    { value: 3, icon: LayoutGrid, label: "3 עמודות" },
    { value: 4, icon: Grid3x3, label: "4 עמודות" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-gallery-bg/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              גלריית תמונות
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSelectionMode && selectedCount > 0 
                ? `${selectedCount} תמונות נבחרו מתוך ${totalImages.toLocaleString()}`
                : `${totalImages.toLocaleString()} תמונות`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selection mode indicator and controls */}
            {isSelectionMode && (
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownloadSelected}
                  disabled={selectedCount === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  הורד נבחרות ({selectedCount})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSelection}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  ביטול
                </Button>
              </div>
            )}

            {/* Column selector for desktop - hide in selection mode */}
            {!isSelectionMode && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-3">עמודות:</span>
                {columnOptions.map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    variant={columns === value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onColumnsChange(value)}
                    className={cn(
                      "gap-2",
                      columns === value && "bg-gradient-primary"
                    )}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{value}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* More options menu */}
            {!isSelectionMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDownloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    הורדת כל התמונות
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onToggleSelection}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    בחירת תמונות
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    שיתוף הגלריה
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
